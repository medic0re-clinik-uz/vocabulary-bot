'use strict';
// Ishga tushirish:  npm test
const test = require('node:test');
const assert = require('node:assert');
const { planReminder, buildMessage, CONFIG } = require('../reminders');

// Vaqtlar Toshkent bo'yicha (UTC+5) beriladi
const at = (s) => new Date(`${s}+05:00`);
const rnd0 = () => 0;
const baseUser = (over = {}) => Object.assign({
    userId: 1, firstName: 'Samar', notifications: true, streak: 0,
    lastActiveAt: at('2026-10-17T22:00:00'), inactiveStage: 0, sentSlots: [],
}, over);

test('ertalabki oraliq boshida "dars vaqti" xabari yuboriladi', () => {
    const plan = planReminder(baseUser(), at('2026-10-18T04:00:30'), CONFIG, rnd0);
    assert.strictEqual(plan.kind, 'morning');
    assert.ok(plan.text.includes('Samar'));
    assert.ok(plan.patch.sentSlots.includes('2026-10-18|morning|a'));
});

test('xuddi shu oraliqda bir xil xabar ikki marta yuborilmaydi', () => {
    const first = planReminder(baseUser(), at('2026-10-18T04:00:30'), CONFIG, rnd0);
    const user = baseUser({ lastReminderAt: first.patch.lastReminderAt, sentSlots: first.patch.sentSlots });
    assert.strictEqual(planReminder(user, at('2026-10-18T04:05:00'), CONFIG, rnd0), null);
});

test('05:00 da takror eslatma: hali kirmagan bo\'lsa yuboriladi', () => {
    const user = baseUser({ lastReminderAt: at('2026-10-18T04:00:30'), sentSlots: ['2026-10-18|morning|a'] });
    const plan = planReminder(user, at('2026-10-18T05:00:10'), CONFIG, rnd0);
    assert.strictEqual(plan.kind, 'nudge');
});

test('oraliq boshlanganidan keyin kirgan bo\'lsa, takror eslatma yuborilmaydi', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-18T04:20:00'), lastReminderAt: at('2026-10-18T04:00:30'), sentSlots: ['2026-10-18|morning|a'] });
    const plan = planReminder(user, at('2026-10-18T05:00:10'), CONFIG, rnd0);
    assert.strictEqual(plan.text, null);
    assert.ok(plan.patch.sentSlots.includes('2026-10-18|morning|b'));
});

test('kechki oraliq: 20:00 da "dars vaqti", 22:00 da takror', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-18T14:00:00') });
    const a = planReminder(user, at('2026-10-18T20:00:10'), CONFIG, rnd0);
    assert.strictEqual(a.kind, 'evening');
    const user2 = baseUser({ lastActiveAt: at('2026-10-18T14:00:00'), lastReminderAt: a.patch.lastReminderAt, sentSlots: a.patch.sentSlots });
    assert.strictEqual(planReminder(user2, at('2026-10-18T21:00:00'), CONFIG, rnd0), null);
    const b = planReminder(user2, at('2026-10-18T22:00:10'), CONFIG, rnd0);
    assert.strictEqual(b.kind, 'nudge');
});

test('oraliqdan tashqarida (kunduzi) hech narsa yuborilmaydi', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-18T09:00:00') });
    assert.strictEqual(planReminder(user, at('2026-10-18T13:00:00'), CONFIG, rnd0), null);
    assert.strictEqual(planReminder(user, at('2026-10-18T19:59:00'), CONFIG, rnd0), null);
    assert.strictEqual(planReminder(user, at('2026-10-18T06:10:00'), CONFIG, rnd0), null);
});

test('12 soat kirilmasa "kirmadingiz" xabari yuboriladi (oraliqdan tashqarida ham)', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-18T07:00:00') });
    assert.strictEqual(planReminder(user, at('2026-10-18T18:30:00'), CONFIG, rnd0), null);      // 11.5 soat
    const plan = planReminder(user, at('2026-10-18T19:05:00'), CONFIG, rnd0);                   // 12 soatdan keyin
    assert.strictEqual(plan.kind, 'inactive0');
    assert.strictEqual(plan.patch.inactiveStage, 1);
});

test('"kirmadingiz" xabari 24 va 48 soatda yana bir martadan yuboriladi', () => {
    let user = baseUser({ lastActiveAt: at('2026-10-17T07:00:00'), inactiveStage: 1, lastReminderAt: at('2026-10-17T19:05:00') });
    let plan = planReminder(user, at('2026-10-18T10:00:00'), CONFIG, rnd0);   // 27 soat
    assert.strictEqual(plan.kind, 'inactive1');
    user = baseUser({ lastActiveAt: at('2026-10-15T07:00:00'), inactiveStage: 0 });
    plan = planReminder(user, at('2026-10-18T10:00:00'), CONFIG, rnd0);       // 75 soat, server o'chiq bo'lgan
    assert.strictEqual(plan.kind, 'inactive2');
    assert.strictEqual(plan.patch.inactiveStage, 3);
    user = baseUser({ lastActiveAt: at('2026-10-15T07:00:00'), inactiveStage: 3 });
    assert.strictEqual(planReminder(user, at('2026-10-18T10:00:00'), CONFIG, rnd0), null);   // hammasi yuborilgan
});

test('uyqu vaqtida (00:00–04:00) "kirmadingiz" xabari yuborilmaydi', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-17T12:00:00') });
    assert.strictEqual(planReminder(user, at('2026-10-18T01:30:00'), CONFIG, rnd0), null);
    assert.strictEqual(planReminder(user, at('2026-10-18T03:59:00'), CONFIG, rnd0), null);
});

test('04:00 da ham kirmagan bo\'lsa bitta xabar yuboriladi, ikkita emas', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-17T12:00:00') });
    const plan = planReminder(user, at('2026-10-18T04:00:20'), CONFIG, rnd0);
    assert.strictEqual(plan.kind, 'inactive0');
    assert.ok(plan.patch.sentSlots.includes('2026-10-18|morning|a'));
    const user2 = Object.assign({}, user, plan.patch);
    assert.strictEqual(planReminder(user2, at('2026-10-18T04:05:00'), CONFIG, rnd0), null);
});

test('eslatmalar o\'chirilgan bo\'lsa hech narsa yuborilmaydi', () => {
    const user = baseUser({ notifications: false, lastActiveAt: at('2026-10-10T07:00:00') });
    assert.strictEqual(planReminder(user, at('2026-10-18T20:00:30'), CONFIG, rnd0), null);
});

test('hozirgina (45 daqiqa ichida) kirgan foydalanuvchi bezovta qilinmaydi', () => {
    const user = baseUser({ lastActiveAt: at('2026-10-18T19:40:00') });
    const plan = planReminder(user, at('2026-10-18T20:00:30'), CONFIG, rnd0);
    assert.strictEqual(plan.text, null);
});

test('xabar matnida ism va streak ko\'rsatiladi', () => {
    const t = buildMessage('morning', { firstName: 'Samar', streak: 5 }, rnd0);
    assert.ok(t.includes('Samar') && t.includes('5 kun'));
    assert.ok(buildMessage('nudge', {}, rnd0).length > 10);
});
