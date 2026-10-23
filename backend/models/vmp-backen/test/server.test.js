'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { createApp, runReminderTick } = require('../server');

// Soxta baza (MongoDB o'rniga xotirada)
class FakeUser {
    constructor() { this.docs = []; this.seq = 0; }
    async findOneAndUpdate(filter, upd, opts) {
        let d = this.docs.find(x => x.userId === filter.userId);
        if (!d) {
            if (!opts || !opts.upsert) return null;
            d = { _id: ++this.seq, userId: filter.userId, notifications: true, sentSlots: [], inactiveStage: 0 };
            this.docs.push(d);
        }
        Object.assign(d, upd.$set || {});
        return d;
    }
    find(q) {
        const out = this.docs.filter(d => (q.notifications && q.notifications.$ne === false) ? d.notifications !== false : true);
        return { lean: async () => out.map(d => Object.assign({}, d)) };
    }
    async updateOne(f, u) { const d = this.docs.find(x => x._id === f._id); if (d) Object.assign(d, u.$set || {}); }
}

function fakeBot() {
    const sent = [];
    return { sent, sendMessage: async (id, text, opts) => { sent.push({ id, text, opts }); return {}; } };
}

async function withServer(app, fn) {
    const srv = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
    try { await fn(`http://127.0.0.1:${srv.address().port}`); } finally { srv.close(); }
}
const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async r => ({ status: r.status, json: await r.json() }));

test('/api/ping: foydalanuvchini saqlaydi va faolligini yangilaydi', async () => {
    const User = new FakeUser(); const bot = fakeBot();
    await withServer(createApp({ User, bot }), async (base) => {
        const r = await post(`${base}/api/ping`, { userId: 555, username: 'tester', firstName: 'Test', level: 'B1', streak: 4, xp: 120, notifications: true });
        assert.strictEqual(r.json.success, true);
        const d = User.docs[0];
        assert.strictEqual(d.userId, 555); assert.strictEqual(d.level, 'B1'); assert.strictEqual(d.streak, 4);
        assert.ok(d.lastActiveAt instanceof Date); assert.strictEqual(d.inactiveStage, 0);
        await post(`${base}/api/ping`, { userId: 555, notifications: false });
        assert.strictEqual(User.docs[0].notifications, false);
    });
});

test('/api/ping va /api/save-score: mehmon (userId yo\'q) xato bermaydi', async () => {
    const User = new FakeUser(); const bot = fakeBot();
    await withServer(createApp({ User, bot }), async (base) => {
        for (const p of ['/api/ping', '/api/save-score']) {
            for (const body of [{ userId: 0 }, {}, { userId: 'abc' }]) {
                const r = await post(base + p, body);
                assert.strictEqual(r.status, 200); assert.strictEqual(r.json.skipped, true);
            }
        }
        assert.strictEqual(User.docs.length, 0);
        assert.strictEqual(bot.sent.length, 0);
    });
});

test('/api/save-score: natijani saqlaydi va xabar yuboradi; bot xato bersa ham 200 qaytadi', async () => {
    const User = new FakeUser(); const bot = fakeBot();
    await withServer(createApp({ User, bot }), async (base) => {
        const r = await post(`${base}/api/save-score`, { userId: 7, username: 'u', score: 65, level: 'B2' });
        assert.strictEqual(r.json.success, true);
        assert.strictEqual(User.docs[0].score, 65); assert.strictEqual(User.docs[0].level, 'B2');
        await new Promise(r => setTimeout(r, 20));
        assert.ok(bot.sent[0].text.includes('B2'));
    });
    const badBot = { sendMessage: async () => { throw new Error('chat not found'); } };
    await withServer(createApp({ User: new FakeUser(), bot: badBot }), async (base) => {
        const r = await post(`${base}/api/save-score`, { userId: 8, score: 10 });
        assert.strictEqual(r.status, 200); assert.strictEqual(r.json.success, true);
    });
});

test('baza ulanmagan bo\'lsa 503 qaytaradi', async () => {
    await withServer(createApp({ User: new FakeUser(), bot: fakeBot(), isDbReady: () => false }), async (base) => {
        const r = await post(`${base}/api/ping`, { userId: 5 });
        assert.strictEqual(r.status, 503);
        const h = await fetch(`${base}/health`).then(x => x.json());
        assert.strictEqual(h.ok, true); assert.strictEqual(h.db, false);
    });
});

test('eslatma: 12 soat kirmagan foydalanuvchiga xabar boradi va qayta yuborilmaydi', async () => {
    const User = new FakeUser(); const bot = fakeBot();
    await User.findOneAndUpdate({ userId: 42 }, { $set: { firstName: 'Samar', lastActiveAt: new Date('2026-10-18T02:00:00+05:00') } }, { upsert: true });
    const quiet = () => {};
    const now = new Date('2026-10-18T15:00:00+05:00');
    assert.strictEqual(await runReminderTick({ User, bot, now, log: quiet }), 1);
    assert.strictEqual(bot.sent[0].id, 42);
    assert.ok(bot.sent[0].text.includes('Samar'));
    assert.strictEqual(await runReminderTick({ User, bot, now: new Date(now.getTime() + 5 * 60000), log: quiet }), 0);
    // foydalanuvchi qaytib kirsa hisob qaytadan boshlanadi
    await withServer(createApp({ User, bot }), async (base) => { await post(`${base}/api/ping`, { userId: 42 }); });
    assert.strictEqual(User.docs[0].inactiveStage, 0);
});

test('eslatma: bot bloklangan (403) bo\'lsa, eslatmalar o\'chiriladi', async () => {
    const User = new FakeUser();
    await User.findOneAndUpdate({ userId: 9 }, { $set: { lastActiveAt: new Date('2026-10-17T02:00:00+05:00') } }, { upsert: true });
    const bot = { sendMessage: async () => { const e = new Error('Forbidden'); e.response = { statusCode: 403 }; throw e; } };
    await runReminderTick({ User, bot, now: new Date('2026-10-18T15:00:00+05:00'), log: () => {} });
    assert.strictEqual(User.docs[0].notifications, false);
});
