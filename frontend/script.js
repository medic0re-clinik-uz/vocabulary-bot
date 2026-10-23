/* ===================== VOCAB MASTER PRO - script.js ===================== */

// ===================== PARTICLES BACKGROUND =====================
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            color: Math.random() > 0.5 ? '#00ff88' : '#00d9ff',
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
})();

// ===================== USER DATA =====================
const DEFAULT_USER = () => ({
    level: null,
    placement: null,        // { level, score, date } — daraja testi natijasi
    xp: 0,
    streak: 0,
    lastLoginDate: null,
    dailyGoal: 20,
    dailyDate: null,
    dailyWords: [],         // bugun to'g'ri topilgan noyob so'zlar
    dailyWordsLearned: 0,
    totalWordsLearned: 0,   // jami noyob o'rganilgan so'zlar
    lessonsCompleted: {},   // { "A1_0": true, "A1_1": true, ... }
    wordMistakes: {},       // { "word": count }
    wordLastSeen: {},       // { "word": timestamp }
    weekStart: null,
    weeklyActivity: [0,0,0,0,0,0,0], // Dush-Yak: har kuni o'rganilgan yangi so'zlar
    name: "O'quvchi",
    notifications: true,
    badges: {}
});

function loadUserData() {
    try {
        const saved = JSON.parse(localStorage.getItem('vocabMasterData'));
        return Object.assign(DEFAULT_USER(), saved || {});
    } catch (e) {
        return DEFAULT_USER();
    }
}
let userData = loadUserData();

function saveData() {
    try { localStorage.setItem('vocabMasterData', JSON.stringify(userData)); } catch (e) { /* xotira to'la yoki o'chirilgan */ }
}


// ===================== BACKEND (ixtiyoriy) =====================
// Sayt backend'siz ham to'liq ishlaydi: progress brauzer xotirasida saqlanadi.
// Telegram ichida ochilganda esa backend natijani saqlaydi va eslatma xabarlarini yuboradi.
// Backend manzilini o'zgartirish uchun faqat shu qatorni tahrirlang (bo'sh qoldirsangiz o'chadi).
// Sayt backend orqali (http://localhost:10000) ochilsa, o'sha serverning o'ziga ulanadi;
// Netlify / GitHub Pages dan ochilsa — quyidagi Render manziliga.
const DEPLOYED_BACKEND_URL = "https://vmp-backend-1.onrender.com";
const BACKEND_URL = (/^https?:$/.test(location.protocol) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname))
    ? location.origin
    : DEPLOYED_BACKEND_URL;

function getTelegramUser() {
    try {
        const u = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe
            && window.Telegram.WebApp.initDataUnsafe.user;
        return u && u.id ? { userId: u.id, username: u.username || '', firstName: u.first_name || '' } : null;
    } catch (e) { return null; }
}

// Telegram ichida bo'lmasa (masalan, ish beruvchi brauzerda ochsa) hech narsa yuborilmaydi.
function apiPost(path, extra) {
    const u = getTelegramUser();
    if (!u || !BACKEND_URL) return Promise.resolve(null);
    return fetch(`${BACKEND_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({}, u, extra))
    }).then(r => r.json()).catch(() => null);
}

function sendResultToBackend(score) {
    return apiPost('/api/save-score', { score, level: userData.level });
}

// "Men hozir faolman" signali: eslatmalar shu vaqtga qarab yuboriladi.
function pingBackend() {
    return apiPost('/api/ping', {
        level: userData.level,
        streak: userData.streak || 0,
        xp: userData.xp || 0,
        notifications: userData.notifications !== false
    });
}

// ===================== DAILY / WEEKLY COUNTERS & STREAK =====================
function todayKey() { return new Date().toDateString(); }
function mondayKey() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.toDateString();
}

function rollDailyCounters() {
    if (userData.dailyDate !== todayKey()) {
        userData.dailyDate = todayKey();
        userData.dailyWords = [];
        userData.dailyWordsLearned = 0;
    }
    if (userData.weekStart !== mondayKey()) {
        userData.weekStart = mondayKey();
        userData.weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
    }
    userData.dailyWords = userData.dailyWords || [];
    userData.wordLastSeen = userData.wordLastSeen || {};
    userData.wordMistakes = userData.wordMistakes || {};
    userData.lessonsCompleted = userData.lessonsCompleted || {};
    userData.badges = userData.badges || {};
}

function checkStreak() {
    const today = todayKey();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    rollDailyCounters();
    if (userData.lastLoginDate !== today) {
        userData.streak = userData.lastLoginDate === yesterday ? (userData.streak || 0) + 1 : 1;
        userData.lastLoginDate = today;
    }
    saveData();
}

// So'z to'g'ri topilganda: xotiraga yozadi, kunlik maqsad va haftalik grafikni yangilaydi.
function markWordLearned(en) {
    rollDailyCounters();
    userData.wordLastSeen[en] = Date.now();
    if (!userData.dailyWords.includes(en)) {
        userData.dailyWords.push(en);
        userData.dailyWordsLearned = userData.dailyWords.length;
        const dayIdx = (new Date().getDay() + 6) % 7;
        userData.weeklyActivity[dayIdx] = (userData.weeklyActivity[dayIdx] || 0) + 1;
    }
    userData.totalWordsLearned = Object.keys(userData.wordLastSeen).length;
}


// ===================== PLACEMENT TEST (10 ta savol) =====================
// Har bir savolning o'z darajasi bor. Ikki xil savol turi:
//   "mc"   — test (4 variant + "Bilmayman"), tasodifan topib qo'yish mumkin => 1 ball
//   "type" — yozma (javobni o'zi yozadi), taxmin qilib bo'lmaydi            => 2 ball
// Daraja: har daraja bo'yicha ballning kamida 60% i yig'ilsa, daraja "o'tilgan" hisoblanadi.
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_NAMES = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper-Intermediate', C1: 'Advanced', C2: 'Mastery' };

const placementTests = [
    { level: 'A1', type: 'mc',   prompt: '"Window" so\'zining tarjimasi qaysi?', sub: "To'g'ri tarjimani tanlang",
      opts: ["Deraza", "Eshik", "Devor", "Tom"], answer: ["Deraza"] },
    { level: 'A2', type: 'mc',   prompt: 'I missed the bus, so I was ___ for the meeting.', sub: "Bo'sh joyga mos so'zni tanlang",
      opts: ["late", "early", "tall", "cheap"], answer: ["late"] },
    { level: 'A2', type: 'type', prompt: '"Kutubxona" inglizchada qanday yoziladi?', sub: "Inglizcha yozing",
      hint: 'l _ _ _ _ _ _', answer: ["library"] },
    { level: 'B1', type: 'mc',   prompt: 'Regular exercise can ___ the risk of heart disease.', sub: "Bo'sh joyga mos so'zni tanlang",
      opts: ["reduce", "reserve", "refuse", "remain"], answer: ["reduce"] },
    { level: 'B1', type: 'type', prompt: 'I have five years of working ___ in marketing.', sub: "Bo'sh joyni to'ldiring (tajriba)",
      hint: 'e _ _ _ _ _ _ _ _ _', answer: ["experience"] },
    { level: 'B2', type: 'mc',   prompt: 'The new law will have serious ___ for small businesses.', sub: "Bo'sh joyga mos so'zni tanlang",
      opts: ["consequences", "conscience", "consent", "convenience"], answer: ["consequences"] },
    { level: 'B2', type: 'type', prompt: 'She is very ___: she adapts easily to any new situation.', sub: "Bo'sh joyni to'ldiring (moslashuvchan)",
      hint: 'f _ _ _ _ _ _ _', answer: ["flexible"] },
    { level: 'C1', type: 'mc',   prompt: 'The new policy is intended to ___ the effects of inflation.', sub: "Bo'sh joyga mos so'zni tanlang",
      opts: ["mitigate", "imitate", "hesitate", "irritate"], answer: ["mitigate"] },
    { level: 'C1', type: 'type', prompt: 'Her speech was so ___ that the whole audience applauded.', sub: "Bo'sh joyni to'ldiring (notiq, ta'sirchan)",
      hint: 'e _ _ _ _ _ _ _', answer: ["eloquent"] },
    { level: 'C2', type: 'type', prompt: 'The evidence against him was ___: nobody could prove it wrong.', sub: "Bo'sh joyni to'ldiring (inkor qilib bo'lmaydigan)",
      hint: 'i _ _ _ _ _ _ _ _ _ _', answer: ["irrefutable"] }
];

let testIdx = 0;
let placementLog = [];      // [{ q, given, ok }]
let totalPlacementScore = 0;
let placementLocked = false;

const PLACEMENT_WEIGHT = { mc: 1, type: 2 };

function normalizeAnswer(s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?,]+$/, '');
}

function startPlacementTest() {
    document.getElementById('start-btn-wrap').style.display = 'none';
    document.getElementById('question-area').style.display = 'block';
    testIdx = 0;
    placementLog = [];
    totalPlacementScore = 0;
    placementLocked = false;
    renderTestQuestion();
}

function renderTestQuestion() {
    if (testIdx >= placementTests.length) {
        finalizePlacement();
        return;
    }
    placementLocked = false;
    const q = placementTests[testIdx];
    document.getElementById('q-level-badge').textContent = q.level;
    document.getElementById('q-type-badge').textContent = q.type === 'mc' ? '☑ Test' : '✍ Yozma';
    document.getElementById('question-text').textContent = q.prompt;
    document.getElementById('question-sub').textContent = q.sub || '';
    document.getElementById('test-progress-bar').style.width = (testIdx / placementTests.length * 100) + '%';
    document.getElementById('test-counter').textContent = `${testIdx} / ${placementTests.length}`;

    const optsDiv = document.getElementById('test-options');
    const typeWrap = document.getElementById('test-type-wrap');
    optsDiv.innerHTML = '';

    if (q.type === 'mc') {
        typeWrap.style.display = 'none';
        optsDiv.style.display = 'grid';
        [...q.opts].sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.textContent = opt;
            btn.onclick = () => answerPlacement(opt, btn);
            optsDiv.appendChild(btn);
        });
        const skip = document.createElement('button');
        skip.className = 'opt-btn opt-skip';
        skip.textContent = "Bilmayman";
        skip.onclick = () => answerPlacement(null, skip);
        optsDiv.appendChild(skip);
    } else {
        optsDiv.style.display = 'none';
        typeWrap.style.display = 'block';
        const input = document.getElementById('test-input');
        input.value = '';
        input.disabled = false;
        input.classList.remove('correct', 'wrong');
        document.getElementById('test-hint').textContent = q.hint ? `Maslahat: ${q.hint}` : '';
        document.getElementById('test-check-btn').disabled = false;
        document.getElementById('test-skip-btn').disabled = false;
        setTimeout(() => input.focus(), 120);
    }
}

function submitTypedPlacement(skipped) {
    if (placementLocked) return;
    const input = document.getElementById('test-input');
    answerPlacement(skipped ? null : input.value, input);
}

function answerPlacement(given, el) {
    if (placementLocked) return;
    const q = placementTests[testIdx];
    if (given !== null && q.type === 'type' && !normalizeAnswer(given)) return; // bo'sh javob hisobga olinmaydi
    placementLocked = true;

    const ok = given !== null && q.answer.some(a => normalizeAnswer(a) === normalizeAnswer(given));
    placementLog.push({ q, given, ok });
    if (ok) totalPlacementScore += PLACEMENT_WEIGHT[q.type] * (LEVELS.indexOf(q.level) + 1) * 5;

    if (q.type === 'mc') {
        const optsDiv = document.getElementById('test-options');
        optsDiv.querySelectorAll('.opt-btn').forEach(b => {
            b.disabled = true;
            if (q.answer.includes(b.textContent)) b.classList.add('correct');
        });
        if (!ok && given !== null) el.classList.add('wrong');
    } else {
        const input = document.getElementById('test-input');
        input.disabled = true;
        document.getElementById('test-check-btn').disabled = true;
        document.getElementById('test-skip-btn').disabled = true;
        input.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) input.value = q.answer[0];
    }

    setTimeout(() => { testIdx++; renderTestQuestion(); }, ok ? 700 : 1200);
}

// Darajani hisoblash: har daraja uchun yig'ilgan ball / mumkin bo'lgan ball >= 60% bo'lsa, daraja "o'tilgan".
// Bitta daraja tasodifan o'tkazib yuborilgan bo'lsa (keyingisi o'tilgan bo'lsa) kechiriladi, ikkinchisida to'xtaydi.
function computePlacement(log) {
    const earned = {}, max = {};
    LEVELS.forEach(l => { earned[l] = 0; max[l] = 0; });
    log.forEach(({ q, ok }) => {
        max[q.level] += PLACEMENT_WEIGHT[q.type];
        if (ok) earned[q.level] += PLACEMENT_WEIGHT[q.type];
    });
    const passed = LEVELS.map(l => max[l] > 0 && earned[l] >= Math.ceil(max[l] * 0.6));

    let idx = 0, misses = 0;
    for (let i = 1; i < LEVELS.length; i++) {
        if (passed[i]) { idx = i; continue; }
        misses++;
        if (misses >= 2 || i === LEVELS.length - 1 || !passed[i + 1]) break;
    }
    return { level: LEVELS[idx], earned, max, passed };
}

function finalizePlacement() {
    const res = computePlacement(placementLog);
    const level = res.level;
    userData.level = level;
    userData.placement = { level, score: totalPlacementScore, date: Date.now() };
    saveData();

    sendResultToBackend(totalPlacementScore);

    document.getElementById('test-progress-bar').style.width = '100%';
    document.getElementById('test-counter').textContent = '10 / 10';

    const rows = placementLog.map(({ q, ok, given }) => `
        <div class="pl-row">
            <span class="pl-lvl">${q.level}</span>
            <span class="pl-type">${q.type === 'mc' ? 'Test' : 'Yozma'}</span>
            <span class="pl-res ${ok ? 'ok' : 'bad'}">${ok ? '✔ To\'g\'ri' : (given === null ? '✖ Bilmadi' : '✖ Xato')}</span>
            ${ok ? '' : `<span class="pl-ans">${q.answer[0]}</span>`}
        </div>`).join('');
    const correct = placementLog.filter(x => x.ok).length;

    Swal.fire({
        title: '🎉 Test yakunlandi!',
        html: `<div class="pl-summary">
            <div class="pl-level">${level}</div>
            <div class="pl-level-name">${LEVEL_NAMES[level]}</div>
            <div class="pl-line">${correct}/10 to'g'ri javob · ${totalPlacementScore} ball</div>
            <div class="pl-list">${rows}</div>
            <div class="pl-note">Siz ${level} darajadan boshlaysiz. Istalgan vaqtda boshqa darajadagi darslarni ham ochishingiz mumkin.</div>
        </div>`,
        background: '#111118',
        color: '#fff',
        confirmButtonText: 'Boshlash →',
        confirmButtonColor: '#00ff88',
        allowOutsideClick: false
    }).then(() => {
        document.getElementById('onboarding-screen').classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        initApp();
    });
}


// So'zni inglizcha yozuvi bo'yicha topish uchun (takrorlash va xatolar ro'yxatida o'zbekcha tarjimani ko'rsatish)
const WORD_LOOKUP = {};
Object.values(WORD_BANK).forEach(lessons => lessons.forEach(ws => ws.forEach(w => { WORD_LOOKUP[w.en] = w; })));


// ===================== DAILY CONTENT =====================
const WORDS_OF_DAY = [
    { word: "Serendipity", phonetic: "/ˌser.ənˈdɪp.ɪ.ti/", meaning: "Kutilmagan baxt", example: "Finding that book was pure serendipity." },
    { word: "Ephemeral", phonetic: "/ɪˈfem.ər.əl/", meaning: "O'tkinchi, qisqa muddatli", example: "Fame can be ephemeral." },
    { word: "Eloquent", phonetic: "/ˈel.ə.kwənt/", meaning: "So'zamol, notiq", example: "She gave an eloquent speech." },
    { word: "Resilience", phonetic: "/rɪˈzɪl.i.əns/", meaning: "Bardoshlilik", example: "Resilience is key to success." },
    { word: "Magnanimous", phonetic: "/mæɡˈnæn.ɪ.məs/", meaning: "Saxiy, keng ko'ngil", example: "He was magnanimous in victory." },
    { word: "Perspicacious", phonetic: "/ˌpɜː.spɪˈkeɪ.ʃəs/", meaning: "O'tkir zehnli", example: "A perspicacious observer." },
    { word: "Ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", meaning: "Hamma joyda uchraydigan", example: "Smartphones are ubiquitous." }
];

const IDIOMS_OF_DAY = [
    { idiom: "Break the ice", meaning: "Suhbatni boshlash" },
    { idiom: "Hit the nail on the head", meaning: "To'g'ri aytmoq" },
    { idiom: "Under the weather", meaning: "Kasal bo'lmoq" },
    { idiom: "Bite the bullet", meaning: "Qiyinlikka sabr qilmoq" },
    { idiom: "Burn the midnight oil", meaning: "Kech gacha ishlash" },
    { idiom: "A blessing in disguise", meaning: "Yashirin ne'mat" },
    { idiom: "Spill the beans", meaning: "Sirni oshkor qilmoq" }
];

const GRAMMAR_TIPS = [
    "Present Perfect: 'have/has + V3' — tajriba va natijalar uchun ishlatiladi.",
    "Articles: Aniq 'the' vs noaniq 'a/an' — birinchi marta 'a', keyingi gal 'the'.",
    "Conditionals: 'If + present, will + V' real sharoit uchun.",
    "Passive Voice: 'be + V3' — kim qilganini bilmaganingizda.",
    "Reported Speech: Direct 'she said \"I am tired\"' → Indirect 'She said she was tired'.",
    "Gerund vs Infinitive: 'enjoy + -ing', 'want + to'.",
    "Prepositions of time: 'at' soat uchun, 'on' kun uchun, 'in' oy/yil uchun."
];

function loadDailyContent() {
    const dayIdx = new Date().getDay();
    const wotd = WORDS_OF_DAY[dayIdx % WORDS_OF_DAY.length];
    const idiom = IDIOMS_OF_DAY[dayIdx % IDIOMS_OF_DAY.length];
    const grammar = GRAMMAR_TIPS[dayIdx % GRAMMAR_TIPS.length];

    document.getElementById('wotd-word').textContent = wotd.word;
    document.getElementById('wotd-phonetic').textContent = wotd.phonetic;
    document.getElementById('wotd-translation').textContent = wotd.meaning;
    document.getElementById('wotd-example').textContent = `"${wotd.example}"`;
    document.getElementById('idiom-text').textContent = idiom.idiom;
    document.getElementById('idiom-meaning').textContent = idiom.meaning;
    document.getElementById('grammar-tip').textContent = grammar;
}

function playWordAudio() {
    const dayIdx = new Date().getDay();
    const wotd = WORDS_OF_DAY[dayIdx % WORDS_OF_DAY.length];
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(wotd.word);
        utter.lang = 'en-US';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
    }
    document.getElementById('audio-btn').innerHTML = '<i class="fas fa-volume-up" style="color:var(--neon-green)"></i>';
    setTimeout(() => document.getElementById('audio-btn').innerHTML = '<i class="fas fa-volume-up"></i>', 2000);
}

// ===================== BADGES SYSTEM =====================
const ALL_BADGES = [
    { id: "first_word", icon: "🔤", name: "1. So'z", desc: "Birinchi so'z", condition: d => d.totalWordsLearned >= 1 },
    { id: "ten_words", icon: "📚", name: "10 So'z", desc: "10 ta so'z", condition: d => d.totalWordsLearned >= 10 },
    { id: "hundred_words", icon: "💯", name: "100 So'z", desc: "100 ta so'z", condition: d => d.totalWordsLearned >= 100 },
    { id: "five_hundred", icon: "🏆", name: "500 So'z", desc: "500 ta so'z", condition: d => d.totalWordsLearned >= 500 },
    { id: "streak3", icon: "🔥", name: "3 Kun", desc: "3 kunlik streak", condition: d => d.streak >= 3 },
    { id: "streak7", icon: "⚡", name: "7 Kun", desc: "7 kunlik streak", condition: d => d.streak >= 7 },
    { id: "streak30", icon: "🌟", name: "30 Kun", desc: "30 kunlik streak", condition: d => d.streak >= 30 },
    { id: "first_lesson", icon: "🎓", name: "1. Dars", desc: "Birinchi dars", condition: d => Object.keys(d.lessonsCompleted).length >= 1 },
    { id: "ten_lessons", icon: "🎯", name: "10 Dars", desc: "10 ta dars", condition: d => Object.keys(d.lessonsCompleted).length >= 10 },
    { id: "perfectionist", icon: "💎", name: "Mukammal", desc: "100% bilan dars", condition: d => d.badges.perfectionist },
    { id: "speed_demon", icon: "🚀", name: "Quick", desc: "Quick Review", condition: d => d.badges.speed_demon },
    { id: "a1_complete", icon: "🥉", name: "A1 Tugatildi", desc: "A1 daraja tugallandi", condition: d => countLevelLessons(d, 'A1') >= WORD_BANK.A1.length },
    { id: "b1_complete", icon: "🥈", name: "B1 Tugatildi", desc: "B1 daraja tugallandi", condition: d => countLevelLessons(d, 'B1') >= WORD_BANK.B1.length },
    { id: "polyglot", icon: "🌍", name: "Poliglot", desc: "3 darajada dars bajarildi", condition: d => countUniqueLevels(d) >= 3 },
];

function countLevelLessons(d, level) {
    return Object.keys(d.lessonsCompleted).filter(k => k.startsWith(level)).length;
}
function countUniqueLevels(d) {
    const levels = new Set(Object.keys(d.lessonsCompleted).map(k => k.split('_')[0]));
    return levels.size;
}

function checkAndAwardBadges() {
    ALL_BADGES.forEach(badge => {
        if (!userData.badges[badge.id] && badge.condition(userData)) {
            userData.badges[badge.id] = true;
            saveData();
            showXPToast(`🏅 Medal: ${badge.name}!`);
        }
    });
}

function renderBadges(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ALL_BADGES.map(badge => {
        const earned = badge.condition(userData);
        return `<div class="badge-item" title="${badge.desc}">
            <div class="badge-icon ${earned ? 'earned' : 'locked'}">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
        </div>`;
    }).join('');
}

// ===================== WEEKLY GRAPH =====================
function renderWeeklyGraph() {
    const days = ['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Y'];
    const todayIdx = (new Date().getDay() + 6) % 7;
    const maxVal = Math.max(...userData.weeklyActivity, 1);
    const container = document.getElementById('weekly-graph');
    container.innerHTML = days.map((d, i) => {
        const val = userData.weeklyActivity[i] || 0;
        const h = Math.max(4, Math.round((val / maxVal) * 60));
        const isToday = i === todayIdx;
        return `<div class="week-bar-wrap">
            <div class="week-bar ${isToday ? 'today' : ''}" style="height:${h}px"></div>
            <div class="week-label">${d}</div>
        </div>`;
    }).join('');
}

// ===================== SPACED REPETITION =====================
function getWordsForReview() {
    const now = Date.now();
    const reviewInterval = 24 * 60 * 60 * 1000; // 1 day
    return Object.entries(userData.wordLastSeen || {})
        .filter(([word, ts]) => now - ts > reviewInterval)
        .sort((a, b) => a[1] - b[1])
        .map(([word]) => word)
        .slice(0, 10);
}

function renderReviewWords() {
    const words = getWordsForReview();
    const count = words.length;
    document.getElementById('review-count').textContent = count;
    const list = document.getElementById('review-words-list');
    if (count === 0) {
        list.innerHTML = '<span style="font-size:12px;color:var(--text-muted)">Hozircha takrorlanadigan so\'z yo\'q</span>';
    } else {
        list.innerHTML = words.map(w => `<span class="review-word-chip">${w}${WORD_LOOKUP[w] ? ' · ' + WORD_LOOKUP[w].uz : ''}</span>`).join('');
    }
}

function renderForgottenWords() {
    const mistakes = Object.entries(userData.wordMistakes || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    document.getElementById('forgotten-count').textContent = mistakes.length;
    const list = document.getElementById('forgotten-list');
    if (mistakes.length === 0) {
        list.innerHTML = '<span style="font-size:12px;color:var(--text-muted)">Xato so\'z yo\'q 🎉</span>';
    } else {
        list.innerHTML = mistakes.map(([w, c]) =>
            `<span class="review-word-chip danger">${w}${WORD_LOOKUP[w] ? ' · ' + WORD_LOOKUP[w].uz : ''} (${c}x)</span>`
        ).join('');
    }
}

// ===================== VOCAB STRENGTH =====================
function updateVocabStrength() {
    const words = userData.totalWordsLearned || 0;
    let pct = 0;
    let desc = "";
    if (words < 100) { pct = Math.round(words * 0.2); desc = "Kundalik suhbatning ~" + pct + "% ini tushuning"; }
    else if (words < 300) { pct = 20 + Math.round((words-100) * 0.1); desc = "Oddiy muloqot uchun asos bor"; }
    else if (words < 500) { pct = 40 + Math.round((words-300) * 0.05); desc = "Ko'pchilik filmlarni tushunasiz"; }
    else if (words < 1000) { pct = 50 + Math.round((words-500) * 0.02); desc = "Kundalik suhbatni yaxshi tushunasiz"; }
    else { pct = Math.min(95, 60 + Math.round((words-1000) * 0.005)); desc = "Deyarli hamma narsani tushunasiz!"; }

    document.getElementById('vocab-strength-bar').style.width = pct + '%';
    document.getElementById('vocab-strength-pct').textContent = pct + '%';
    document.getElementById('vocab-strength-desc').textContent = desc;
}

// ===================== DAILY GOAL =====================
function updateDailyGoalUI() {
    const current = userData.dailyWordsLearned || 0;
    const target = userData.dailyGoal || 20;
    const pct = Math.min(100, Math.round((current / target) * 100));
    document.getElementById('goal-current').textContent = current;
    document.getElementById('goal-target').textContent = target;
    document.getElementById('goal-progress-bar').style.width = pct + '%';
    document.getElementById('goal-pct').textContent = pct + '%';
    const msg = pct >= 100 ? '🎉 Maqsadga yetdingiz! Ajoyib!' :
                pct >= 50 ? '💪 Yarmiga keldingiz, davom eting!' :
                '🎯 Bugun maqsadingizga yeting!';
    document.getElementById('goal-message').textContent = msg;
}

function openDailyGoalModal() {
    const modal = document.getElementById('daily-goal-modal');
    modal.classList.remove('d-none');
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    document.querySelectorAll('.goal-opt').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.textContent) === userData.dailyGoal);
    });
}

function closeDailyGoalModal() {
    document.getElementById('daily-goal-modal').classList.add('d-none');
}

function setDailyGoal(n) {
    userData.dailyGoal = n;
    saveData();
    closeDailyGoalModal();
    updateDailyGoalUI();
    showXPToast(`🎯 Maqsad: ${n} so'z`);
}

// ===================== XP TOAST =====================
function showXPToast(msg) {
    let stack = document.getElementById('toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'toast-stack';
        document.body.appendChild(stack);
    }
    while (stack.children.length >= 3) stack.firstChild.remove();   // ekranda ko'pi bilan 3 ta xabar
    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.textContent = msg;
    stack.appendChild(toast);
    setTimeout(() => toast.remove(), 1600);
}

// ===================== NAVIGATION =====================
function navTo(section) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.add('d-none'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(section).classList.remove('d-none');
    document.getElementById('nav-' + section).classList.add('active');

    if (section === 'lessons') renderLessons();
    if (section === 'profile') renderProfile();
    if (section === 'home') updateHomeUI();
}

// ===================== HOME UPDATE =====================
function updateHomeUI() {
    const name = userData.name || "O'quvchi";
    document.getElementById('welcome-name').textContent = `Salom, ${name}!`;
    document.getElementById('home-level-badge').textContent = userData.level || 'A1';
    document.getElementById('streak-val').textContent = userData.streak || 0;
    document.getElementById('total-words-val').textContent = userData.totalWordsLearned || 0;
    document.getElementById('xp-val').textContent = userData.xp || 0;
    document.getElementById('lessons-done-val').textContent = Object.keys(userData.lessonsCompleted || {}).length;

    updateDailyGoalUI();
    updateVocabStrength();
    renderWeeklyGraph();
    renderBadges('badges-grid');
    renderReviewWords();
    renderForgottenWords();
}

// ===================== LESSONS RENDER =====================
const LEVEL_ICONS = { A1: '🌱', A2: '🌿', B1: '⭐', B2: '💫', C1: '🔥', C2: '💎' };
const LEVEL_COLORS = { A1: '#00ff88', A2: '#00d9ff', B1: '#b060ff', B2: '#ff6b35', C1: '#ff4088', C2: '#ffd700' };

function renderLessons() {
    const selector = document.getElementById('level-selector');
    const level = selector ? selector.value : (userData.level || 'A1');
    const tree = document.getElementById('lesson-tree');
    tree.innerHTML = '';

    const completedCount = Object.keys(userData.lessonsCompleted || {})
        .filter(k => k.startsWith(level + '_')).length;
    const unlockedUpTo = completedCount;
    const levelColor = LEVEL_COLORS[level] || '#00ff88';

    const lessonCount = WORD_BANK[level].length;
    for (let i = 0; i < lessonCount; i++) {
        const key = `${level}_${i}`;
        const isComplete = userData.lessonsCompleted[key];
        const isOpen = i === unlockedUpTo;
        const isLocked = i > unlockedUpTo && !isComplete;
        const mem = countLessonMemorized(level, i);
        const pct = isComplete ? 100 : mem.pct;

        const node = document.createElement('div');
        node.className = `lesson-node ${isComplete ? 'complete' : isOpen ? 'open' : 'locked'}`;

        // Water fill layer — height based on memorized %
        node.innerHTML = `
            <div class="node-water-clip">
                <div class="node-water-fill" style="height:${pct}%;background:${levelColor}22;border-bottom:${pct > 0 ? '2px solid ' + levelColor + '66' : 'none'}">
                    <div class="node-water-wave" style="background:${levelColor}33"></div>
                </div>
            </div>
            <div class="node-icon">${isComplete ? '✅' : isOpen ? LEVEL_ICONS[level] : '🔒'}</div>
            <div class="node-num" style="color:${isComplete ? levelColor : isOpen ? levelColor : '#555'}">${i + 1}</div>
            <div class="lesson-node-label">${i + 1}. ${LESSON_THEMES[level][i]}</div>
        `;

        // Tooltip with pct
        node.title = `${LESSON_THEMES[level][i]} · ${pct}% yodlangan`;

        if (isComplete || isOpen) {
            node.onclick = () => openLesson(level, i);
        }

        node.style.animationDelay = (i * 25) + 'ms';
        node.classList.add('animate__animated', 'animate__fadeIn');
        tree.appendChild(node);

        if (i >= unlockedUpTo + 4 && !isComplete) break;
    }

    if (unlockedUpTo >= lessonCount) {
        const done = document.createElement('div');
        done.className = 'level-done';
        done.textContent = `🎉 ${level} darajasi to'liq tugatildi!`;
        tree.appendChild(done);
    }
}

// ===================== GAME ENGINE =====================
let currentLesson = { level: null, index: null, words: [], gamePhase: 0, progress: 0, hearts: 3, wordIdx: 0, matchSelected: null };

function openLesson(level, index) {
    currentLesson = {
        level, index,
        words: [...WORD_BANK[level][index]],
        gamePhase: 0,
        progress: 0,
        hearts: 3,
        wordIdx: 0,
        matchSelected: null,
        mistakes: [],
        steps: 0,
        over: false
    };

    const mem = countLessonMemorized(level, index);
    document.getElementById('modal-lesson-title').textContent = `${level} · ${LESSON_THEMES[level][index]}`;
    document.getElementById('lesson-memorized-label').textContent = `🌊 ${mem.pct}% · ${mem.count}/10 so'z yodlandi`;
    document.getElementById('lesson-modal').classList.remove('d-none');
    updateGameUI();
    // Show word preview BEFORE starting games
    showWordPreview();
}

function showWordPreview() {
    const area = document.getElementById('modal-content-area');
    const words = currentLesson.words;
    const level = currentLesson.level;
    const index = currentLesson.index;

    // Update header to show "Preview" state
    document.getElementById('modal-lesson-sub').textContent = "So'zlarni o'rganing · Tayyor bo'lgach bosing";

    window.previewWords = words;
    window.previewRenderCard = function(idx) {
        const word = window.previewWords[idx];
        const progress = Math.round(((idx) / window.previewWords.length) * 100);

        area.innerHTML = `
            <div class="preview-container">
                <div class="preview-progress-row">
                    <span class="preview-counter">${idx + 1} / ${window.previewWords.length}</span>
                    <div class="preview-prog-track">
                        <div class="preview-prog-fill" style="width:${progress}%"></div>
                    </div>
                </div>

                <div class="preview-card animate-card-in">
                    <div class="preview-level-tag">${level} · Dars ${index + 1} · ${LESSON_THEMES[level][index]}</div>
                    <div class="preview-english">${word.en}</div>
                    <div class="preview-divider">
                        <span class="preview-divider-line"></span>
                        <span class="preview-divider-icon">🔄</span>
                        <span class="preview-divider-line"></span>
                    </div>
                    <div class="preview-uzbek">${word.uz}</div>
                    <button class="preview-audio-btn" onclick="speakWord('${word.en.replace(/'/g,"\'")}')" title="Tinglash">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>

                <div class="preview-nav">
                    ${idx > 0 ? `<button class="preview-prev-btn" onclick="previewRenderCard(${idx - 1})">
                        <i class="fas fa-arrow-left"></i> Oldingi
                    </button>` : `<div></div>`}
                    <button class="preview-next-btn" onclick="${idx < window.previewWords.length - 1 ? `previewRenderCard(${idx + 1})` : `startGames()`}">
                        ${idx < window.previewWords.length - 1 ? 'Keyingi <i class="fas fa-arrow-right"></i>' : 'O\'yinni Boshlash <i class="fas fa-gamepad"></i>'}
                    </button>
                </div>

                <div class="preview-dots">
                    ${window.previewWords.map((_, i) => `<span class="preview-dot ${i === idx ? 'active' : i < idx ? 'done' : ''}"></span>`).join('')}
                </div>
            </div>`;

        // Auto-pronounce on first card
        if (idx === 0) speakWord(word.en);
    };

    window.previewRenderCard(0);
}

function speakWord(word) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(word);
        utter.lang = 'en-US';
        utter.rate = 0.8;
        window.speechSynthesis.speak(utter);
    }
}

function startGames() {
    currentLesson.gamePhase = 0;
    currentLesson.wordIdx = 0;
    updateGameUI();
    renderGamePhase();
}

function closeLesson() {
    document.getElementById('lesson-modal').classList.add('d-none');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    currentLesson = {};
}

function updateGameUI() {
    if (!currentLesson || currentLesson.gamePhase === undefined || currentLesson.gamePhase === null) return;
    const phaseName = ['Tarjimani tanlang', 'To\'g\'ri / Xato', 'Imlo (yozish)', 'Inglizchasini tanlang', 'Juftlashtirish'][currentLesson.gamePhase] || '';
    document.getElementById('modal-lesson-sub').textContent = `O'yin ${currentLesson.gamePhase + 1}/5 · ${phaseName}`;
    document.getElementById('game-progress-bar').style.width = currentLesson.progress + '%';
    document.getElementById('game-progress-label').textContent = currentLesson.progress + '%';
    if (currentLesson.level) {
        const mem = countLessonMemorized(currentLesson.level, currentLesson.index);
        const lbl = document.getElementById('lesson-memorized-label');
        if (lbl) lbl.textContent = `🌊 ${mem.pct}% · ${mem.count}/10 so'z yodlandi`;
    }
    ['heart1','heart2','heart3'].forEach((id, i) => {
        document.getElementById(id).classList.toggle('lost', i >= currentLesson.hearts);
    });
}

function renderGamePhase() {
    if (!currentLesson || !currentLesson.words) return;
    const phase = currentLesson.gamePhase;
    const area = document.getElementById('modal-content-area');
    area.innerHTML = '';

    if (phase === 0) renderMultipleChoice();
    else if (phase === 1) renderTrueFalse();
    else if (phase === 2) renderSpelling();
    else if (phase === 3) renderReverseChoice();
    else if (phase === 4) renderMatching();
}

function getCurrentWord() {
    const idx = currentLesson.wordIdx % currentLesson.words.length;
    return currentLesson.words[idx];
}

function getOtherWords(exclude, field, count = 3) {
    const all = currentLesson.words.filter(w => w.en !== exclude.en);
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(w => w[field]);
}

function countLessonMemorized(level, index) {
    const words = WORD_BANK[level]?.[index] || [];
    const key = `${level}_${index}`;
    if (userData.lessonsCompleted?.[key]) {
        return { count: words.length, pct: 100 };
    }
    const seen = userData.wordLastSeen || {};
    const count = words.filter(w => Boolean(seen[w.en])).length;
    const pct = words.length ? Math.round((count / words.length) * 100) : 0;
    return { count, pct };
}

// Game 1: Multiple Choice (EN → UZ)
function renderMultipleChoice() {
    const word = getCurrentWord();
    const others = getOtherWords(word, 'uz', 3);
    const options = [word.uz, ...others].sort(() => Math.random() - 0.5);
    const area = document.getElementById('modal-content-area');
    area.innerHTML = `
        <div class="game-word-big">${word.en}</div>
        <div class="game-word-sub">O'zbekcha tarjimasini tanlang</div>
        <div class="game-options-4">
            ${options.map(opt => `<button class="game-opt" onclick="checkMC(this,'${opt.replace(/'/g,"\\'")}','${word.uz.replace(/'/g,"\\'")}','${word.en.replace(/'/g,"\\'")}','${word.uz.replace(/'/g,"\\'")}',0)">${opt}</button>`).join('')}
        </div>`;
}

function checkMC(btn, selected, correct, wordEn, wordUz, phase) {
    document.querySelectorAll('.game-opt').forEach(b => b.disabled = true);
    if (selected === correct) {
        btn.classList.add('correct');
        flashFeedback(true);
        advanceWord(wordEn, true);
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.game-opt').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
        flashFeedback(false);
        recordMistake(wordEn);
        advanceWord(wordEn, false);
    }
}

// Game 2: True/False
function renderTrueFalse() {
    const word = getCurrentWord();
    const isCorrect = Math.random() > 0.5;
    const displayUz = isCorrect ? word.uz : getOtherWords(word, 'uz', 1)[0] || 'Noto\'g\'ri';
    const area = document.getElementById('modal-content-area');
    area.innerHTML = `
        <div class="game-word-big">${word.en}</div>
        <div style="text-align:center;font-size:22px;color:white;margin:16px 0;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px">"${displayUz}"</div>
        <div class="game-word-sub">Bu tarjima to'g'rimi?</div>
        <div class="tf-buttons">
            <button class="btn-true" onclick="checkTF(true, ${isCorrect}, '${word.en.replace(/'/g,"\\'")}')">✅ To'g'ri</button>
            <button class="btn-false" onclick="checkTF(false, ${isCorrect}, '${word.en.replace(/'/g,"\\'")}')">❌ Xato</button>
        </div>`;
}

function checkTF(userAnswer, isCorrect, wordEn) {
    document.querySelector('.btn-true').disabled = true;
    document.querySelector('.btn-false').disabled = true;
    if (userAnswer === isCorrect) {
        flashFeedback(true);
        advanceWord(wordEn, true);
    } else {
        flashFeedback(false);
        recordMistake(wordEn);
        advanceWord(wordEn, false);
    }
}

// Game 3: Spelling
function renderSpelling() {
    const word = getCurrentWord();
    const area = document.getElementById('modal-content-area');
    area.innerHTML = `
        <div class="game-word-big" style="color:var(--neon-blue)">${word.uz}</div>
        <div class="game-word-sub">Inglizcha yoziling</div>
        <input type="text" id="spell-input" class="spell-input" placeholder="Inglizcha yozing..." autocomplete="off" autocorrect="off" spellcheck="false">
        <button class="btn-main" onclick="checkSpell('${word.en.replace(/'/g,"\\'")}','${word.en.replace(/'/g,"\\'")}')">
            <i class="fas fa-check me-2"></i> Tekshirish
        </button>`;
    setTimeout(() => document.getElementById('spell-input')?.focus(), 200);
    document.getElementById('spell-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkSpell(word.en, word.en);
    });
}

function checkSpell(correct, wordEn) {
    const input = document.getElementById('spell-input');
    if (!input) return;
    const val = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!val) return;
    if (val === correct.toLowerCase()) {
        input.style.borderColor = 'var(--neon-green)';
        input.disabled = true;
        flashFeedback(true);
        advanceWord(wordEn, true);
    } else {
        input.style.borderColor = 'var(--danger)';
        input.style.color = 'var(--danger)';
        input.value = correct;   // to'g'ri javobni ko'rsatamiz
        input.disabled = true;
        flashFeedback(false);
        recordMistake(wordEn);
        advanceWord(wordEn, false);
    }
}

// Game 4: Reverse Choice (UZ → EN)
function renderReverseChoice() {
    const word = getCurrentWord();
    const others = getOtherWords(word, 'en', 3);
    const options = [word.en, ...others].sort(() => Math.random() - 0.5);
    const area = document.getElementById('modal-content-area');
    area.innerHTML = `
        <div class="game-word-big" style="color:var(--neon-blue)">${word.uz}</div>
        <div class="game-word-sub">Inglizcha tarjimasini tanlang</div>
        <div class="game-options-4">
            ${options.map(opt => `<button class="game-opt" onclick="checkRC(this,'${opt.replace(/'/g,"\\'")}','${word.en.replace(/'/g,"\\'")}','${word.en.replace(/'/g,"\\'")}',3)">${opt}</button>`).join('')}
        </div>`;
}

function checkRC(btn, selected, correct, wordEn) {
    document.querySelectorAll('.game-opt').forEach(b => b.disabled = true);
    if (selected === correct) {
        btn.classList.add('correct');
        flashFeedback(true);
        advanceWord(wordEn, true);
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.game-opt').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
        flashFeedback(false);
        recordMistake(wordEn);
        advanceWord(wordEn, false);
    }
}

// Game 5: Matching
let matchState = { selected: null, matched: [] };

function renderMatching() {
    const words = [...currentLesson.words].sort(() => Math.random() - 0.5).slice(0, 5);
    matchState = { selected: null, matched: [] };
    const leftItems = words.map(w => ({ id: w.en, text: w.en, pair: w.uz }));
    const rightItems = words.map(w => ({ id: w.en, text: w.uz, pair: w.en }));
    rightItems.sort(() => Math.random() - 0.5);
    const area = document.getElementById('modal-content-area');
    area.innerHTML = `
        <div class="game-word-sub text-center mb-3">So'zlarni juftlashtiring</div>
        <div class="match-grid">
            <div class="match-col">
            ${leftItems.map(item => `<div class="match-item" data-id="${item.id}" data-side="left" onclick="handleMatch(this,'${item.id}','left')">${item.text}</div>`).join('')}
            </div>
            <div class="match-col">
            ${rightItems.map(item => `<div class="match-item" data-id="${item.pair}" data-side="right" onclick="handleMatch(this,'${item.pair}','right')">${item.text}</div>`).join('')}
            </div>
        </div>`;
}

function handleMatch(el, id, side) {
    if (el.classList.contains('matched')) return;
    if (!matchState.selected) {
        // First selection
        document.querySelectorAll('.match-item.selected').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        matchState.selected = { el, id, side };
    } else {
        const prev = matchState.selected;
        if (prev.side === side) {
            // Same side, reselect
            document.querySelectorAll('.match-item.selected').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            matchState.selected = { el, id, side };
            return;
        }
        if (prev.id === id) {
            // Match!
            prev.el.classList.remove('selected');
            prev.el.classList.add('matched');
            el.classList.add('matched');
            matchState.matched.push(id);
            flashFeedback(true);
            currentLesson.steps = (currentLesson.steps || 0) + 1;
            markWordLearned(id);
            userData.xp = (userData.xp || 0) + 10;
            showXPToast('+10 XP');
            saveData();
            syncLessonProgress();
            updateGameUI();
            matchState.selected = null;
            if (matchState.matched.length === 5) {
                const lesson = currentLesson;
                setTimeout(() => { if (currentLesson === lesson && !lesson.over) advancePhase(); }, 800);
            }
        } else {
            // No match
            el.classList.add('wrong-match');
            prev.el.classList.add('wrong-match');
            flashFeedback(false);
            recordMistake(prev.id);
            loseHeart();
            setTimeout(() => {
                el.classList.remove('wrong-match', 'selected');
                prev.el.classList.remove('wrong-match', 'selected');
            }, 600);
            matchState.selected = null;
            if (currentLesson.hearts <= 0) {
                const lesson = currentLesson;
                lesson.over = true;
                setTimeout(() => { if (currentLesson === lesson) showLessonFailed(); }, 900);
            }
        }
    }
}

// ===================== CORE GAME LOGIC =====================
// Dars 5 ta o'yindan iborat: 4 ta o'yin x 10 so'z + juftlashtirish (5 juft) = 45 qadam.
// Har bir o'yinda 3 ta jon bor. Jon tugasa dars to'xtaydi va qaytadan boshlanadi.
const TOTAL_STEPS = 45;

function syncLessonProgress() {
    currentLesson.progress = Math.min(100, Math.round((currentLesson.steps || 0) / TOTAL_STEPS * 100));
}

function advanceWord(wordEn, correct) {
    const lesson = currentLesson;
    if (!lesson || !lesson.words || lesson.over) return;
    lesson.steps = (lesson.steps || 0) + 1;

    if (correct) {
        markWordLearned(wordEn);
        userData.xp = (userData.xp || 0) + 10;
        showXPToast('+10 XP');
    } else {
        loseHeart();
    }
    saveData();
    syncLessonProgress();
    updateGameUI();

    if (lesson.hearts <= 0) {
        lesson.over = true;
        setTimeout(() => { if (currentLesson === lesson) showLessonFailed(); }, 900);
        return;
    }

    setTimeout(() => {
        if (currentLesson !== lesson || lesson.over) return;   // dars yopilgan yoki tugagan bo'lsa to'xtaydi
        lesson.wordIdx++;
        if (lesson.wordIdx > 0 && lesson.wordIdx % 10 === 0) advancePhase();
        else renderGamePhase();
    }, correct ? 600 : 1000);
}

function loseHeart() {
    currentLesson.hearts = Math.max(0, currentLesson.hearts - 1);
    updateGameUI();
}

function advancePhase() {
    const lesson = currentLesson;
    if (!lesson || !lesson.words || lesson.over) return;
    if (lesson.gamePhase < 4) {
        lesson.gamePhase++;
        lesson.wordIdx = 0;
        lesson.hearts = 3;
        updateGameUI();
        const area = document.getElementById('modal-content-area');
        area.style.opacity = '0';
        setTimeout(() => {
            if (currentLesson !== lesson || lesson.over) return;
            area.style.opacity = '1';
            area.style.transition = 'opacity 0.3s';
            renderGamePhase();
        }, 300);
    } else {
        completeLesson();
    }
}

function recordMistake(wordEn) {
    userData.wordMistakes = userData.wordMistakes || {};
    userData.wordMistakes[wordEn] = (userData.wordMistakes[wordEn] || 0) + 1;
    if (currentLesson && currentLesson.mistakes) currentLesson.mistakes.push(wordEn);
    saveData();
}

function flashFeedback(correct) {
    const el = document.createElement('div');
    el.className = correct ? 'feedback-correct' : 'feedback-wrong';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 500);
}

function completeLesson() {
    const { level, index } = currentLesson;
    const key = `${level}_${index}`;
    const firstTime = !userData.lessonsCompleted[key];
    const mistakeCount = currentLesson.mistakes.length;
    currentLesson.over = true;
    currentLesson.progress = 100;
    updateGameUI();

    userData.lessonsCompleted[key] = true;
    if (firstTime) userData.xp = (userData.xp || 0) + 100;
    if (mistakeCount === 0) userData.badges.perfectionist = true;
    saveData();
    checkAndAwardBadges();
    pingBackend();

    const stars = mistakeCount === 0 ? '⭐⭐⭐' : mistakeCount <= 4 ? '⭐⭐☆' : '⭐☆☆';
    const total = WORD_BANK[level].length;
    const hasNext = index + 1 < total;
    const levelDone = Object.keys(userData.lessonsCompleted).filter(k => k.startsWith(level + '_')).length >= total;
    const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

    document.getElementById('modal-content-area').innerHTML = `
        <div class="game-complete">
            <div class="complete-circle">🏆</div>
            <h2 class="neon-text">Tabriklaymiz!</h2>
            <div class="stars-row">${stars}</div>
            <p style="color:var(--text-muted);margin:8px 0">${mistakeCount === 0 ? 'Xatosiz bajarildi!' : `${mistakeCount} ta xato bilan bajarildi`}</p>
            <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:16px;margin:16px 0">
                <div style="color:var(--neon-green);font-size:24px;font-weight:700">+${firstTime ? 110 : 10} XP</div>
                <div style="color:var(--text-muted);font-size:12px">${levelDone ? (nextLevel ? `${level} darajasi tugadi! Keyingisi: ${nextLevel}` : 'Barcha darajalar tugadi! 🎉') : hasNext ? 'Keyingi dars ochildi!' : ''}</div>
            </div>
            ${hasNext ? `<button class="btn-main" onclick="openLesson('${level}', ${index + 1})"><i class="fas fa-arrow-right me-2"></i> Keyingi dars</button>` : ''}
            <button class="btn-outline-cancel mt-3 w-100" onclick="closeLesson(); renderLessons(); updateHomeUI();">Darslar ro'yxati</button>
        </div>`;
}

function showLessonFailed() {
    if (!currentLesson || !currentLesson.words) return;
    const uniqueMistakes = [...new Set(currentLesson.mistakes)];
    const chips = uniqueMistakes.slice(0, 8).map(w => {
        const item = WORD_LOOKUP[w];
        return `<span class="mistake-chip">${w}${item ? ' — ' + item.uz : ''}</span>`;
    }).join('');
    document.getElementById('modal-content-area').innerHTML = `
        <div class="game-complete">
            <div class="complete-circle" style="border-color:var(--neon-orange)">💔</div>
            <h2 style="color:var(--neon-orange)">Jonlar tugadi</h2>
            <p style="color:var(--text-muted);margin:12px 0">Darsning ${currentLesson.progress}% qismini bajardingiz. Xato qilingan so'zlarni yana bir ko'rib chiqing:</p>
            <div class="mistaken-words">${chips || '<span style="color:#aaa">—</span>'}</div>
            <div style="display:flex;gap:10px;margin-top:20px">
                <button class="btn-neon-sm" style="flex:1" onclick="retryLesson()"><i class="fas fa-redo me-1"></i> Qayta urinish</button>
                <button class="btn-outline-cancel" style="flex:1" onclick="closeLesson(); renderLessons();">Chiqish</button>
            </div>
        </div>`;
}

function retryLesson() {
    const { level, index } = currentLesson;
    openLesson(level, index);
}


// ===================== QUICK REVIEW =====================
// 60 soniyalik takrorlash: oldin o'rganilgan (ayniqsa xato qilingan va uzoq ko'rilmagan) so'zlardan.
let quickReviewTimer = null;
let quickReviewScore = 0;
let quickReviewPool = [];
let quickReviewLeft = 60;

function getReviewPool() {
    const seen = userData.wordLastSeen || {};
    const mistakes = userData.wordMistakes || {};
    let pool = Object.keys(seen).map(en => WORD_LOOKUP[en]).filter(Boolean);
    pool.sort((a, b) => ((mistakes[b.en] || 0) - (mistakes[a.en] || 0)) || (seen[a.en] - seen[b.en]));
    pool = pool.slice(0, 40);
    if (pool.length < 6) {
        // Hali yetarli so'z o'rganilmagan bo'lsa, joriy daraja so'zlaridan to'ldiramiz
        const lvl = userData.level || 'A1';
        WORD_BANK[lvl].slice(0, 2).forEach(lesson => lesson.forEach(w => { if (!pool.includes(w)) pool.push(w); }));
    }
    return pool;
}

function startQuickReview() {
    userData.badges.speed_demon = true;
    saveData();

    document.getElementById('quick-review-modal').classList.remove('d-none');
    quickReviewScore = 0;
    quickReviewLeft = 60;
    quickReviewPool = getReviewPool();

    const timerEl = document.getElementById('review-timer');
    timerEl.textContent = quickReviewLeft;
    timerEl.classList.remove('urgent');
    clearInterval(quickReviewTimer);
    quickReviewTimer = setInterval(() => {
        quickReviewLeft--;
        timerEl.textContent = Math.max(0, quickReviewLeft);
        timerEl.classList.toggle('urgent', quickReviewLeft <= 10);
        if (quickReviewLeft <= 0) endQuickReview();
    }, 1000);
    renderQuickReviewQuestion();
}

function renderQuickReviewQuestion() {
    if (quickReviewLeft <= 0) return;
    const words = quickReviewPool;
    const word = words[Math.floor(Math.random() * words.length)];
    const others = words.filter(w => w.uz !== word.uz).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.uz);
    const options = [word.uz, ...others].sort(() => Math.random() - 0.5);
    const esc = s => s.replace(/'/g, "\\'");

    document.getElementById('quick-review-content').innerHTML = `
        <div class="game-word-big" style="font-size:28px">${word.en}</div>
        <div class="game-options-4 mt-3">
            ${options.map(opt => `<button class="game-opt" onclick="checkQuickReview(this,'${esc(opt)}','${esc(word.uz)}','${esc(word.en)}')">${opt}</button>`).join('')}
        </div>
        <div style="text-align:center;margin-top:12px;color:var(--neon-green);font-weight:700">Skor: ${quickReviewScore}</div>`;
}

function checkQuickReview(btn, selected, correct, wordEn) {
    document.querySelectorAll('#quick-review-content .game-opt').forEach(b => b.disabled = true);
    if (selected === correct) {
        btn.classList.add('correct');
        quickReviewScore++;
        flashFeedback(true);
        markWordLearned(wordEn);
        userData.xp = (userData.xp || 0) + 5;
        saveData();
        showXPToast('+5 XP');
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('#quick-review-content .game-opt').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
        flashFeedback(false);
        recordMistake(wordEn);
    }
    setTimeout(renderQuickReviewQuestion, 450);
}

function closeQuickReview() {
    clearInterval(quickReviewTimer);
    document.getElementById('quick-review-modal').classList.add('d-none');
    updateHomeUI();
}

function endQuickReview() {
    clearInterval(quickReviewTimer);
    document.getElementById('quick-review-content').innerHTML = `
        <div class="game-complete">
            <div class="complete-circle">⚡</div>
            <h2 class="neon-text">Vaqt tugadi!</h2>
            <div style="font-size:48px;font-weight:900;color:var(--neon-blue);margin:16px 0">${quickReviewScore}</div>
            <p style="color:var(--text-muted)">to'g'ri javob</p>
            <button class="btn-main mt-4" onclick="closeQuickReview()">Yopish</button>
        </div>`;
}


// ===================== PROFILE =====================
function renderProfile() {
    const level = userData.level || 'A1';
    document.getElementById('profile-name').textContent = userData.name || "O'quvchi";
    const levelNames = { A1:'Beginner', A2:'Elementary', B1:'Intermediate', B2:'Upper-Intermediate', C1:'Advanced', C2:'Mastery' };
    document.getElementById('profile-level-pill').textContent = `${level} · ${levelNames[level] || ''}`;
    document.getElementById('ps-streak').textContent = userData.streak || 0;
    document.getElementById('ps-xp').textContent = userData.xp || 0;
    document.getElementById('ps-words').textContent = userData.totalWordsLearned || 0;
    document.getElementById('ps-lessons').textContent = Object.keys(userData.lessonsCompleted || {}).length;

    // Level progress bars
    const levelContainer = document.getElementById('level-progress-bars');
    const levels = ['A1','A2','B1','B2','C1','C2'];
    const levelColors = ['#00ff88','#00d9ff','#b060ff','#ff6b35','#ff4088','#ffd700'];
    levelContainer.innerHTML = levels.map((lvl, i) => {
        const done = Object.keys(userData.lessonsCompleted || {}).filter(k => k.startsWith(lvl + '_')).length;
        const total = WORD_BANK[lvl].length;
        const pct = Math.round((done / total) * 100);
        return `<div class="level-progress-item">
            <div class="level-progress-label">
                <span>${lvl}</span>
                <span style="color:${levelColors[i]}">${done}/${total} dars</span>
            </div>
            <div class="level-bar-track">
                <div class="level-bar-fill" style="width:${pct}%;background:${levelColors[i]};box-shadow:0 0 8px ${levelColors[i]}"></div>
            </div>
        </div>`;
    }).join('');

    document.getElementById('notif-toggle').classList.toggle('on', userData.notifications !== false);
    renderBadges('profile-badges-grid');
}

function toggleNotif() {
    userData.notifications = !userData.notifications;
    saveData();
    document.getElementById('notif-toggle').classList.toggle('on', userData.notifications);
    pingBackend();
    showXPToast(userData.notifications ? '🔔 Eslatmalar yoqildi' : '🔕 Eslatmalar o\'chirildi');
}

function resetProgress() {
    Swal.fire({
        title: 'Ishonchingiz komilmi?',
        text: 'Barcha progress o\'chib ketadi (daraja testi natijasi saqlanadi).',
        icon: 'warning',
        background: '#111118', color: '#fff',
        showCancelButton: true,
        confirmButtonText: 'Ha, o\'chirish',
        cancelButtonText: 'Bekor qilish',
        confirmButtonColor: '#ff4455'
    }).then(result => {
        if (result.isConfirmed) {
            const { name, level, placement, notifications } = userData;
            localStorage.removeItem('vocabMasterData');
            userData = Object.assign(DEFAULT_USER(), { name, level, placement, notifications });
            saveData();
            location.reload();
        }
    });
}

// ===================== APP INIT =====================
function initApp() {
    const tgUser = getTelegramUser();
    if (tgUser && tgUser.firstName && (!userData.name || userData.name === "O'quvchi")) { userData.name = tgUser.firstName; saveData(); }
    checkStreak();
    loadDailyContent();
    updateHomeUI();

    // Set level selector to user's level
    const selector = document.getElementById('level-selector');
    if (selector && userData.level) selector.value = userData.level;

    checkAndAwardBadges();
    pingBackend();

    // Animate stat chips on load
    setTimeout(() => {
        document.querySelectorAll('.stat-chip').forEach((chip, i) => {
            chip.style.opacity = '0';
            chip.style.transform = 'translateY(20px)';
            setTimeout(() => {
                chip.style.transition = 'all 0.4s ease';
                chip.style.opacity = '1';
                chip.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }, 100);
}

// ===================== STARTUP =====================
document.addEventListener('DOMContentLoaded', () => {
    try { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); } catch (e) { /* oddiy brauzer */ }
    // Daraja testi allaqachon topshirilgan bo'lsa, to'g'ridan-to'g'ri ilovaga o'tamiz
    if (userData.level && userData.placement) {
        document.getElementById('onboarding-screen').classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        initApp();
    } else {
        // Show start button
        document.getElementById('question-area').style.display = 'none';
        document.getElementById('test-options').style.display = 'none';
        document.getElementById('test-type-wrap').style.display = 'none';
    }

    // Pulse streak chip if streak > 0
    if (userData.level && userData.placement && userData.streak >= 3) {
        document.getElementById('streak-chip').style.boxShadow = '0 0 15px rgba(255,140,0,0.4)';
    }
});