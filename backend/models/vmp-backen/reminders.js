'use strict';
/**
 * Eslatma (xabarnoma) mantiqi.
 *
 * Bu fayl faqat "kimga, qachon, qanday xabar yuborish kerak?" degan savolga javob beradi
 * (internet va bazaga bog'liq emas), shuning uchun uni oson sinab ko'rish mumkin.
 * Yuborish ishini server.js bajaradi.
 *
 * Ikki xil eslatma bor:
 *   1) "Kirmadingiz" — foydalanuvchi 12 soat ilovaga kirmasa (keyin 24 va 48 soatda yana bir marta).
 *   2) "Dars vaqti" — har kuni ikki vaqt oralig'ida: 04:00–06:00 va 20:00–24:00.
 *      Har oraliqda ikki marta: oraliq boshida va (hali kirmagan bo'lsa) bir ozdan keyin yana.
 *
 * Sozlamalarni pastdagi CONFIG dan o'zgartirish mumkin.
 */

const CONFIG = {
    timezone: process.env.TIMEZONE || 'Asia/Tashkent',
    inactivityHours: [12, 24, 48],     // shuncha soat kirilmasa — "kirmadingiz" xabari
    quietHours: { from: 0, to: 4 },    // 00:00–04:00 da "kirmadingiz" xabari yuborilmaydi (uyqu vaqti)
    minGapMinutes: 55,                 // ikki xabar orasida kamida shuncha vaqt bo'lsin
    justActiveMinutes: 45,             // oxirgi 45 daqiqada kirgan bo'lsa, bezovta qilinmaydi
    windows: [
        { id: 'morning', start: 4,  end: 6,  nudgeAfterMin: 60 },    // 04:00–06:00, takror eslatma 05:00 da
        { id: 'evening', start: 20, end: 24, nudgeAfterMin: 120 },   // 20:00–24:00, takror eslatma 22:00 da
    ],
};

// ---------------------------------------------------------------- Vaqt yordamchilari

/** Berilgan vaqtning kerakli vaqt mintaqasidagi sana va soatini qaytaradi. */
function localTime(date, tz) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(date);
    const o = {};
    parts.forEach(p => { o[p.type] = p.value; });
    return {
        dateKey: `${o.year}-${o.month}-${o.day}`,
        hour: Number(o.hour) % 24,
        minute: Number(o.minute),
        second: Number(o.second),
    };
}

function isQuietHour(hour, cfg = CONFIG) {
    const { from, to } = cfg.quietHours;
    return hour >= from && hour < to;
}

/** Bugungi (mahalliy vaqt bo'yicha) dars oraliqlari va ularning eslatma "slot"lari. */
function todaysWindows(now, cfg = CONFIG) {
    const lt = localTime(now, cfg.timezone);
    const msIntoDay = ((lt.hour * 60 + lt.minute) * 60 + lt.second) * 1000 + now.getMilliseconds();
    const dayStartMs = now.getTime() - msIntoDay;   // mahalliy yarim tun
    return cfg.windows.map(w => {
        const startMs = dayStartMs + w.start * 3600000;
        const endMs = dayStartMs + w.end * 3600000;
        return {
            id: w.id, startMs, endMs,
            slots: [
                { key: `${lt.dateKey}|${w.id}|a`, atMs: startMs, kind: w.id },
                { key: `${lt.dateKey}|${w.id}|b`, atMs: startMs + w.nudgeAfterMin * 60000, kind: 'nudge' },
            ],
        };
    });
}

// ---------------------------------------------------------------- Xabar matnlari

const MESSAGES = {
    // 12 soat kirilmaganda
    inactive0: [
        "👋 {name}, 12 soatdan beri darsga kirmadingiz. 10 daqiqa ham yetarli — bugungi so'zlarni birga takrorlaymiz!",
        "📚 So'zlar sizni kutmoqda, {name}! O'rgangan narsangiz esdan chiqmasin — hozir bitta dars qiling.",
        "⏰ Ishlash vaqti keldi, {name}! Kichik qadamlar katta natija beradi: bitta dars — va kun yutuqli o'tadi.",
        "🧠 Xotira mashq bilan mustahkamlanadi. Siz bir necha soatdan beri kirmadingiz — hoziroq 10 ta so'z o'rganing!",
    ],
    // 24 soat kirilmaganda
    inactive1: [
        "⏳ {name}, bir kun o'tdi! Odatni uzib qo'ymang — hozir kirib, bitta dars bajaring.",
        "🔥 Lug'at boyligi har kuni o'sadi. Bugun hali bitta ham so'z o'rganmadingiz — keling, boshlaymiz!",
        "💡 Eslatma: kuniga 10 ta so'z — yilda 3650 ta so'z. Bugungi 10 tasini o'rganing, {name}!",
    ],
    // 48 soat kirilmaganda
    inactive2: [
        "💪 {name}, sizni sog'indik! Qaytishning eng yaxshi vaqti — hozir. Bitta dars bilan qayta boshlang.",
        "🌱 Hech qachon kech emas! Ikki kun tanaffus bo'ldi, endi yana yo'lga chiqamiz — bir dars qiling.",
    ],
    // Ertalabki oraliq (04:00–06:00)
    morning: [
        "🌅 Xayrli tong, {name}! Ertalab xotira eng kuchli bo'ladi. Dars vaqti keldi — 10 ta yangi so'z o'rganing!",
        "☀️ Tong otdi! Kuningizni yangi so'zlar bilan boshlang: bugungi dars sizni kutmoqda.",
        "🕓 Erta turganlar g'alaba qozonadi! Hozir 10 daqiqa lug'at ustida ishlang — butun kun bardam bo'lasiz.",
        "📖 Dars vaqti keldi, {name}! Tinch tong soatlarida o'rganilgan so'zlar uzoq yodda qoladi.",
    ],
    // Kechki oraliq (20:00–24:00)
    evening: [
        "🌙 Xayrli kech, {name}! Kunni foydali yakunlang — dars vaqti keldi. Uxlashdan oldin o'rganilgan so'zlar yaxshi yodda qoladi.",
        "📚 Ishlash vaqti keldi! Bugungi maqsadingizga yetdingizmi? Yana bitta dars — va kun to'liq bo'ladi.",
        "✨ Kun oxirida kichik g'alaba: 10 ta yangi so'z. Hoziroq boshlang, {name}!",
        "🎯 Maqsadga intilish — har kuni qadam tashlash. Bugungi darsni bajarib, tinchgina dam oling.",
    ],
    // Oraliqning ikkinchi (takror) eslatmasi — foydalanuvchi hali kirmagan bo'lsa
    nudge: [
        "⏰ Eslatma: bugungi dars hali bajarilmadi. Atigi 10 daqiqa — hozir boshlang, {name}!",
        "🔔 Hali ham vaqt bor! Bitta dars bajarib, kunlik maqsadingizga yeting.",
        "👀 {name}, so'zlar kutib qoldi. Birgina dars — va siz oldinga bir qadam tashladingiz!",
    ],
};

function pick(list, rnd) {
    return list[Math.min(list.length - 1, Math.floor(rnd() * list.length))];
}

/** Xabar matnini tayyorlaydi: {name} o'rniga ismni, oxiriga streak haqidagi qatorni qo'shadi. */
function buildMessage(kind, user, rnd = Math.random) {
    const list = MESSAGES[kind] || MESSAGES.nudge;
    const name = (user && (user.firstName || user.username)) || "do'stim";
    let text = pick(list, rnd).replace(/\{name\}/g, name);
    const streak = Number(user && user.streak) || 0;
    if (streak >= 2) {
        text += kind.startsWith('inactive')
            ? `\n\n🔥 ${streak} kunlik streak xavf ostida — uzib qo'ymang!`
            : `\n\n🔥 Streak: ${streak} kun. Davom eting!`;
    }
    return text;
}

// ---------------------------------------------------------------- Asosiy qaror

/**
 * Foydalanuvchiga hozir xabar yuborish kerakmi?
 *
 * @param user  { notifications, lastActiveAt, lastReminderAt, inactiveStage, sentSlots, firstName, streak }
 * @param now   Date
 * @returns null (hech narsa qilinmaydi)
 *          yoki { text, kind, patch } — text bo'lsa yuboriladi; patch — bazaga yoziladigan o'zgarishlar.
 */
function planReminder(user, now = new Date(), cfg = CONFIG, rnd = Math.random) {
    if (!user || user.notifications === false) return null;

    const nowMs = now.getTime();
    const lastReminder = user.lastReminderAt ? new Date(user.lastReminderAt).getTime() : 0;
    if (nowMs - lastReminder < cfg.minGapMinutes * 60000) return null;

    // lastActiveAt hali yo'q bo'lsa — hisobni hozirdan boshlaymiz
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : nowMs;
    const lt = localTime(now, cfg.timezone);
    const sent = new Set(user.sentSlots || []);

    // 1) Hozir "ochiq" oraliqlardagi, hali yuborilmagan slotlar
    const dueSlots = [];
    for (const w of todaysWindows(now, cfg)) {
        if (nowMs < w.startMs || nowMs >= w.endMs) continue;
        const activeInWindow = lastActive >= w.startMs;   // oraliq boshlanganidan beri kirganmi?
        for (const s of w.slots) {
            if (nowMs >= s.atMs && !sent.has(s.key)) dueSlots.push(Object.assign({ activeInWindow }, s));
        }
    }
    dueSlots.sort((a, b) => a.atMs - b.atMs);

    const keepSlots = dueSlots.map(s => s.key);
    const mergedSlots = Array.from(new Set([...(user.sentSlots || []), ...keepSlots])).slice(-8);

    // 2) Uzoq vaqt kirilmaganmi?
    const hoursAway = (nowMs - lastActive) / 3600000;
    const stage = user.inactiveStage || 0;
    const reachedStage = cfg.inactivityHours.filter(h => hoursAway >= h).length;
    if (reachedStage > stage && !isQuietHour(lt.hour, cfg)) {
        const kind = `inactive${reachedStage - 1}`;
        return {
            kind,
            text: buildMessage(kind, user, rnd),
            patch: { lastReminderAt: now, inactiveStage: reachedStage, sentSlots: mergedSlots },
        };
    }

    // 3) Dars vaqti oralig'i
    if (dueSlots.length) {
        const slot = dueSlots[dueSlots.length - 1];
        const justActive = nowMs - lastActive < cfg.justActiveMinutes * 60000;
        if (slot.activeInWindow || justActive) {
            // Foydalanuvchi allaqachon kirgan — bezovta qilmaymiz, faqat slotni belgilab qo'yamiz
            return { kind: 'skip', text: null, patch: { sentSlots: mergedSlots } };
        }
        return {
            kind: slot.kind,
            text: buildMessage(slot.kind, user, rnd),
            patch: { lastReminderAt: now, sentSlots: mergedSlots },
        };
    }
    return null;
}

module.exports = { CONFIG, MESSAGES, localTime, isQuietHour, todaysWindows, buildMessage, planReminder };
