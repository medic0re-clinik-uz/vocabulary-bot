'use strict';
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { CONFIG, planReminder } = require('./reminders');

// ===================================================================
//  Sozlamalar (.env faylidan olinadi)
//    BOT_TOKEN   — BotFather bergan token
//    MONGO_URI   — MongoDB Atlas ulanish manzili
//    ADMIN_ID    — sizning Telegram ID raqamingiz (eslatmalar shu foydalanuvchiga ham boradi)
//    WEBAPP_URL  — saytning HTTPS manzili (botdagi "Darsni boshlash" tugmasi uchun)
//    PORT        — server porti (Render o'zi beradi)
//    TIMEZONE    — vaqt mintaqasi (standart: Asia/Tashkent)
// ===================================================================
const PORT = process.env.PORT || 10000;
const WEBAPP_URL = (process.env.WEBAPP_URL || '').trim();
const ADMIN_ID = Number(process.env.ADMIN_ID) || null;

/** Telegram "web_app" tugmasi faqat HTTPS manzilda ishlaydi. */
function webAppButton() {
    if (!WEBAPP_URL.startsWith('https://')) return {};
    return { reply_markup: { inline_keyboard: [[{ text: '📚 Darsni boshlash', web_app: { url: WEBAPP_URL } }]] } };
}

// ===================================================================
//  Ilova (express) — bot va baza tashqaridan beriladi, shuning uchun sinab ko'rish oson
// ===================================================================
function createApp({ User, bot, isDbReady = () => true }) {
    const app = express();
    app.use(cors());           // Netlify / GitHub Pages dan keladigan so'rovlarga ruxsat
    app.use(express.json());

    // Render uyg'oq turishi uchun (UptimeRobot shu manzilni tekshiradi)
    app.get('/health', (req, res) => res.json({ ok: true, db: isDbReady() }));

    // Frontend ham shu serverdan berilishi mumkin (ixtiyoriy)
    const frontendDir = path.resolve(__dirname, '../../../frontend');
    if (fs.existsSync(path.join(frontendDir, 'index.html'))) {
        app.use(express.static(frontendDir));
    } else {
        app.get('/', (req, res) => res.send('Backend va Bot muvaffaqiyatli ishlamoqda!'));
    }

    // Foydalanuvchi aniq Telegram ichida emas (masalan, mehmon sifatida brauzerda) bo'lsa — jim o'tkazib yuboramiz
    const validId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

    // "Men hozir faolman" signali: ilova ochilganda, dars tugaganda, eslatma tugmasi o'zgarganda
    app.post('/api/ping', async (req, res) => {
        const b = req.body || {};
        if (!validId(b.userId)) return res.json({ success: true, skipped: true });
        if (!isDbReady()) return res.status(503).json({ success: false, message: 'Baza hali ulanmagan' });
        try {
            const set = { lastActiveAt: new Date(), inactiveStage: 0 };
            if (typeof b.username === 'string') set.username = b.username;
            if (typeof b.firstName === 'string') set.firstName = b.firstName;
            if (typeof b.level === 'string') set.level = b.level;
            if (Number.isFinite(Number(b.streak))) set.streak = Number(b.streak);
            if (Number.isFinite(Number(b.xp))) set.xp = Number(b.xp);
            if (typeof b.notifications === 'boolean') set.notifications = b.notifications;
            await User.findOneAndUpdate({ userId: Number(b.userId) }, { $set: set }, { upsert: true, new: true });
            res.json({ success: true });
        } catch (error) {
            console.error('Ping xatosi:', error.message);
            res.status(500).json({ success: false, message: 'Serverda xato yuz berdi' });
        }
    });

    // Daraja testi natijasini saqlash
    app.post('/api/save-score', async (req, res) => {
        const b = req.body || {};
        if (!validId(b.userId)) return res.json({ success: true, skipped: true });
        if (!isDbReady()) return res.status(503).json({ success: false, message: 'Baza hali ulanmagan' });
        const score = Number(b.score) || 0;
        try {
            const set = { score, lastPlayed: new Date(), lastActiveAt: new Date(), inactiveStage: 0 };
            if (typeof b.username === 'string') set.username = b.username;
            if (typeof b.firstName === 'string') set.firstName = b.firstName;
            if (typeof b.level === 'string') set.level = b.level;
            await User.findOneAndUpdate({ userId: Number(b.userId) }, { $set: set }, { upsert: true, new: true });
            res.json({ success: true, message: 'Natija saqlandi' });
        } catch (error) {
            console.error('Saqlashda xato:', error.message);
            return res.status(500).json({ success: false, message: 'Serverda xato yuz berdi' });
        }
        // Telegramga xabar yuborish alohida: u xato bersa ham natija saqlangan hisoblanadi
        if (bot) {
            const lvl = b.level ? ` Darajangiz: ${b.level}.` : '';
            bot.sendMessage(Number(b.userId), `🎉 Test yakunlandi!${lvl} Natija: ${score} ball.`)
                .catch(e => console.log('Natija xabarini yuborib bo\'lmadi:', e.message));
        }
    });

    return app;
}

// ===================================================================
//  Eslatmalarni yuborish (har 5 daqiqada ishga tushadi)
// ===================================================================
async function runReminderTick({ User, bot, now = new Date(), log = console.log }) {
    const users = await User.find({ notifications: { $ne: false } }).lean();
    let sent = 0;
    for (const user of users) {
        let plan;
        try { plan = planReminder(user, now); } catch (e) { log('Rejalashda xato:', e.message); continue; }
        if (!plan) continue;
        try {
            if (plan.text) {
                await bot.sendMessage(user.userId, plan.text, webAppButton());
                sent++;
                log(`Eslatma yuborildi → ${user.userId} (${plan.kind})`);
            }
            await User.updateOne({ _id: user._id }, { $set: plan.patch });
        } catch (e) {
            const code = e && e.response && e.response.statusCode;
            if (code === 403) {
                // Foydalanuvchi botni to'xtatgan yoki hali /start bosmagan
                log(`Xabar yuborib bo'lmadi (${user.userId}): bot bloklangan yoki /start bosilmagan. Eslatma o'chirildi.`);
                await User.updateOne({ _id: user._id }, { $set: { notifications: false } }).catch(() => {});
            } else {
                log(`Eslatma yuborishda xato (${user.userId}):`, e.message);
            }
        }
    }
    return sent;
}

// ===================================================================
//  Ishga tushirish
// ===================================================================
function main() {
    // Tarmoqdagi tasodifiy uzilishlar (ECONNRESET va h.k.) botni to'xtatib qo'ymasin
    process.on('uncaughtException', (e) => console.error('Kutilmagan xato (bot ishlashda davom etadi):', e.message));
    process.on('unhandledRejection', (e) => console.error('Kutilmagan va\'da xatosi:', e && e.message ? e.message : e));

    const mongoose = require('mongoose');
    const TelegramBot = require('node-telegram-bot-api');
    const cron = require('node-cron');

    // ---- Baza
    const userSchema = new mongoose.Schema({
        userId: { type: Number, unique: true, required: true },
        username: String,
        firstName: String,
        level: String,
        streak: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        notifications: { type: Boolean, default: true },
        lastPlayed: { type: Date, default: Date.now },
        lastActiveAt: { type: Date, default: Date.now },   // oxirgi marta qachon kirgan
        lastReminderAt: Date,                              // oxirgi eslatma qachon yuborilgan
        inactiveStage: { type: Number, default: 0 },       // nechta "kirmadingiz" xabari yuborilgan
        sentSlots: { type: [String], default: [] },        // bugungi dars-vaqt eslatmalari
    });
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const isDbReady = () => mongoose.connection.readyState === 1;

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGO_URI topilmadi (.env faylini tekshiring). Server bazasiz ishlaydi.');
    } else {
        mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 })
            .then(async () => {
                console.log('MongoDB-ga muvaffaqiyatli ulandi');
                if (ADMIN_ID) {
                    // Egasi bazada bo'lsin: eslatmalar /start bosilmasa ham hisobga olinadi
                    await User.updateOne({ userId: ADMIN_ID }, { $setOnInsert: { lastActiveAt: new Date() } }, { upsert: true });
                }
            })
            .catch((err) => console.error('MongoDB ulanishida xato:', err.message));
    }

    // ---- Bot
    const token = process.env.BOT_TOKEN;
    let bot = null;
    if (!token) {
        console.error('BOT_TOKEN topilmadi (.env faylini tekshiring). Bot ishga tushmaydi.');
    } else {
        bot = new TelegramBot(token, { polling: true });
        bot.on('polling_error', (error) => {
            // 409 — bir xil token bilan ikkinchi joyda ham bot ishlayapti
            console.log(`Polling xatosi: ${error.code} - ${error.message}`);
        });

        const registerUser = (msg) => {
            if (!msg.from || !isDbReady()) return Promise.resolve();
            return User.findOneAndUpdate(
                { userId: msg.from.id },
                { $set: { username: msg.from.username || '', firstName: msg.from.first_name || '', lastActiveAt: new Date(), inactiveStage: 0 } },
                { upsert: true, new: true }
            ).catch(e => console.error('Foydalanuvchini saqlashda xato:', e.message));
        };

        bot.onText(/^\/start/, async (msg) => {
            await registerUser(msg);
            const name = (msg.from && msg.from.first_name) || "do'stim";
            bot.sendMessage(msg.chat.id,
                `👋 Salom, ${name}! Vocab Master Pro — ingliz tili lug'atini mustahkamlash uchun o'yinlar, jonlar va bosqichlar.\n\n` +
                `🔔 Eslatmalar: har kuni 04:00–06:00 va 20:00–24:00 oralig'ida, shuningdek 12 soat kirmasangiz.\n` +
                `/off — eslatmalarni o'chirish, /on — yoqish.`,
                webAppButton()
            ).catch(e => console.log('/start javobini yuborib bo\'lmadi:', e.message));
        });

        const setNotifications = (value) => async (msg) => {
            if (isDbReady() && msg.from) {
                await User.findOneAndUpdate({ userId: msg.from.id }, { $set: { notifications: value } }, { upsert: true }).catch(() => {});
            }
            bot.sendMessage(msg.chat.id, value ? '🔔 Eslatmalar yoqildi.' : "🔕 Eslatmalar o'chirildi. Qayta yoqish uchun /on yozing.")
                .catch(() => {});
        };
        bot.onText(/^\/on\b/, setNotifications(true));
        bot.onText(/^\/off\b/, setNotifications(false));
    }

    // ---- Server
    const app = createApp({ User, bot, isDbReady });
    app.listen(PORT, '0.0.0.0', () => console.log(`Server ${PORT}-portda ishlamoqda...`));

    // ---- Eslatmalar: har 5 daqiqada tekshiradi (vaqt mintaqasi: CONFIG.timezone)
    if (bot && process.env.DISABLE_REMINDERS !== '1') {
        let running = false;
        cron.schedule('*/5 * * * *', async () => {
            if (running || !isDbReady()) return;
            running = true;
            try { await runReminderTick({ User, bot }); }
            catch (e) { console.error('Eslatma tekshiruvida xato:', e.message); }
            finally { running = false; }
        }, { timezone: CONFIG.timezone });
        console.log(`Eslatmalar yoqilgan (vaqt mintaqasi: ${CONFIG.timezone})`);
    }
}

if (require.main === module) main();

module.exports = { createApp, runReminderTick };
