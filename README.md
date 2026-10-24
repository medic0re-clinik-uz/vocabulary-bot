# Vocab Master Pro

Telegram Web App (ingliz tili lug'ati) + bot. Foydalanuvchi botga kiradi → 10 savollik daraja testi (A1–C2) → darslar, o'yinlar, jonlar, bosqichlar.
Bot esa eslatma yuboradi (pastda).

```
frontend/   sayt (index.html, script.js, words.js, style.css)
backend/models/vmp-backen/   bot + API + eslatmalar (server.js, reminders.js)
```

## 1. Lokal ishga tushirish

```bash
cd backend/models/vmp-backen
npm install
npm start          # http://localhost:10000
```

* Brauzerda `http://localhost:10000` ni oching — sayt **mehmon rejimida** ishlaydi (Telegramsiz ham to'liq ishlaydi, progress brauzerda saqlanadi).
* `.env` fayli shu papkada (`BOT_TOKEN`, `MONGO_URI`, `ADMIN_ID`). Namunasi: `.env.example`.
* Bir xil bot tokeni bilan bir vaqtda faqat **bitta** joyda (lokal yoki Render) ishlating, aks holda `409 Conflict` chiqadi.
* Testlar: `npm test`

## 2. Telegram ichida ishlashi uchun (Render)

Telegram Web App faqat HTTPS manzilda ochiladi, shuning uchun serverni Render'ga joylang:

1. Loyihani GitHub'ga yuklang (`.env` avtomatik e'tiborga olinmaydi — `.gitignore`).
2. Render → New → Web Service → shu repo. **Root Directory:** `backend/models/vmp-backen`, **Build:** `npm install`, **Start:** `npm start`.
3. Render → Environment: `BOT_TOKEN`, `MONGO_URI`, `ADMIN_ID`, `WEBAPP_URL` (= Render bergan `https://...onrender.com`) ni kiriting.
4. MongoDB Atlas → Network Access → `0.0.0.0/0` ruxsat bering.
5. Server saytni ham o'zi beradi, shuning uchun alohida Netlify shart emas. (Netlify ishlatsangiz, `frontend/script.js` dagi `DEPLOYED_BACKEND_URL` ni Render manziliga o'zgartiring.)
6. BotFather → `/newapp` (yoki `/mybots` → Bot Settings → Menu Button) → Web App URL = `WEBAPP_URL`.
7. **Eslatmalar uzilmasligi uchun:** Render bepul tarifida server 15 daqiqa harakatsizlikdan keyin uxlaydi va eslatmalar to'xtaydi.
   [UptimeRobot](https://uptimerobot.com) (bepul) da `https://SIZNING-SERVER.onrender.com/health` manzilini har 5 daqiqada tekshiradigan monitor qo'shing.
8. Botga `/start` yozing — shundan keyin bot sizga xabar yubora oladi.

## 3. Eslatmalar

| Qachon | Nima |
|---|---|
| Ilovaga **12 soat** kirilmasa | "Kirmadingiz" xabari (keyin 24 va 48 soatda yana bir martadan) |
| Har kuni **04:00–06:00** | "Dars vaqti keldi" (04:00 da, kirmagan bo'lsangiz 05:00 da yana) |
| Har kuni **20:00–24:00** | "Ishlash vaqti keldi" (20:00 da, kirmagan bo'lsangiz 22:00 da yana) |

* Xabarlar har safar tasodifiy motivatsion matn bilan, ismingiz va streak'ingiz bilan keladi.
* 00:00–04:00 da "kirmadingiz" xabari yuborilmaydi (uyqu vaqti).
* Vaqt mintaqasi: Toshkent (`TIMEZONE` bilan o'zgartiriladi). Vaqtlar, matnlar: `reminders.js` (`CONFIG`, `MESSAGES`).
* Profil → "Eslatmalar" tugmasi yoki botda `/off` va `/on` bilan o'chirib-yoqish mumkin.

## 4. So'z qo'shish

`frontend/words.js` da har daraja — mavzuli darslar ro'yxati, har darsda aynan 10 ta `{ en, uz }`.
Yangi dars qo'shsangiz, saytda avtomatik chiqadi.

## Yangiliklar
- Har daraja (A1–C2) uchun 50 ta dars, jami 3000 ta so'z.
- Faqat joriy daraja ochiq; daraja tugagach keyingisiga avtomatik o'tiladi.
- Eslatmalar web app ochilmasa ham keladi: `/health` manzilini UptimeRobot har 5 daqiqada chaqirishi kerak (Render bepul tarifi 15 daqiqada uxlab qoladi).
- Bot buyruqlari: `/test` (namuna eslatma), `/status`, `/on`, `/off`.
