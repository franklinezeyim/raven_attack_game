// ═══════════════════════════════════════════════════════════════════════════
//  RAVEN ATTACK  ·  script.js
// ═══════════════════════════════════════════════════════════════════════════

// ── DOM ──────────────────────────────────────────────────────────────────────
const canvas          = document.getElementById('canvas1');
const ctx             = canvas.getContext('2d');
const bgCanvas        = document.getElementById('bgCanvas');
const bgCtx           = bgCanvas.getContext('2d');
const collisionCanvas = document.getElementById('collisionCanvas');
const gameContainer   = document.getElementById('gameContainer');

const startScreen           = document.getElementById('startScreen');
const gameOverScreen        = document.getElementById('gameOverScreen');
const victoryScreen         = document.getElementById('victoryScreen');
const milestoneScreen       = document.getElementById('milestoneScreen');
const startBtn              = document.getElementById('startBtn');
const restartBtn            = document.getElementById('restartBtn');
const victoryRestartBtn     = document.getElementById('victoryRestartBtn');
const milestoneContinueBtn  = document.getElementById('milestoneContinueBtn');
const scoreDisplay          = document.getElementById('scoreDisplay');
const levelDisplay          = document.getElementById('levelDisplay');
const comboDisplay          = document.getElementById('comboDisplay');
const livesDisplay          = document.getElementById('livesDisplay');
const xpBarFill             = document.getElementById('xpBarFill');
const rankDisplay           = document.getElementById('rankDisplay');
const highScoreDisplay      = document.getElementById('highScoreDisplay');
const finalScoreEl          = document.getElementById('finalScore');
const finalHighScoreEl      = document.getElementById('finalHighScore');
const finalLevelEl          = document.getElementById('finalLevel');
const finalRavensHitEl      = document.getElementById('finalRavensHit');
const finalAccuracyEl       = document.getElementById('finalAccuracy');
const finalGradeEl          = document.getElementById('finalGrade');
const victoryScorel         = document.getElementById('victoryScore');
const soundBtn              = document.getElementById('soundBtn');
const musicBtn              = document.getElementById('musicBtn');
const pauseBtn              = document.getElementById('pauseBtn');
const pauseOverlay          = document.getElementById('pauseOverlay');
const pauseHomeBtn          = document.getElementById('pauseHomeBtn');
const levelCompleteScreen   = document.getElementById('levelCompleteScreen');
const levelCompleteNumberEl = document.getElementById('levelCompleteNumber');
const levelCompleteScoreEl  = document.getElementById('levelCompleteScore');
const levelCompleteRavensEl = document.getElementById('levelCompleteRavens');
const lcAccuracyEl          = document.getElementById('lcAccuracy');
const lcGradeEl             = document.getElementById('lcGrade');
const lcBestEl              = document.getElementById('lcBest');
const lcHomeBtn             = document.getElementById('lcHomeBtn');
const nextLevelBtn          = document.getElementById('nextLevelBtn');
const progressBarFill       = document.getElementById('progressBarFill');
const comboDecayWrap        = document.getElementById('comboDecayWrap');
const comboDecayFill        = document.getElementById('comboDecayFill');
const countdownOverlay      = document.getElementById('countdownOverlay');
const countdownText         = document.getElementById('countdownText');
const toastEl               = document.getElementById('toast');
const leaderboardList       = document.getElementById('leaderboardList');
const gameOverLeaderboardList = document.getElementById('gameOverLeaderboardList');
const statsBtn              = document.getElementById('statsBtn');
const statsPanel            = document.getElementById('statsPanel');
const statsCloseBtn         = document.getElementById('statsCloseBtn');
const missionDisplay        = document.getElementById('missionDisplay');
const missionTargetEl       = document.getElementById('missionTarget');
const missionProgress       = document.getElementById('missionProgress');
const gameOverHomeBtn       = document.getElementById('gameOverHomeBtn');
const bossHealthBarWrap     = document.getElementById('bossHealthBarWrap');
const bossHealthFill        = document.getElementById('bossHealthFill');
const bossNameEl            = document.getElementById('bossName');
const warningBanner         = document.getElementById('warningBanner');
const warningText           = document.getElementById('warningText');
const dailyChallengeBtn     = document.getElementById('dailyChallengeBtn');
const dailyBadge            = document.getElementById('dailyBadge');
const powerupSlots          = document.getElementById('powerupSlots');
const powerupBar            = document.getElementById('powerupBar');
const milestoneTitle        = document.getElementById('milestoneTitle');
const milestoneText         = document.getElementById('milestoneText');
const lcPowerupRewardEl     = document.getElementById('lcPowerupReward');
const dailyTimerEl          = document.getElementById('dailyTimer');
const dailyHudBadge         = document.getElementById('dailyHudBadge');

// ── Constants ─────────────────────────────────────────────────────────────────
const COMBO_TIMEOUT_MS     = 1500;
const MAX_LEVEL            = 200;
const MAX_RAVENS_ON_SCREEN = 8;
const MIN_RAVEN_INTERVAL   = 130;
const BOSS_LEVEL_INTERVAL  = 5;
const BOSS_BASE_HP         = 3;
const BOSS_HP_PER_TIER     = 2;
const BOSS_POINTS_PER_HIT  = 15;
const GOLDEN_POINTS_MULT   = 10;
const EXTRA_LIFE_CHANCE    = 0.06;
const SLOWMO_DURATION_MS   = 3000;
const LEVEL_UP_FLASH_DUR   = 1800;
const SHAKE_HIT_MS=80,  SHAKE_HIT_AMT=3;
const SHAKE_LVL_MS=200, SHAKE_LVL_AMT=6;
const SHAKE_BOSS_MS=400,SHAKE_BOSS_AMT=10;
const XP_PER_HIT=2, XP_PER_LEVEL=50, XP_PER_BOSS=100;

// Mobile detection & scaling
const IS_MOBILE = window.innerWidth < 1024;
const MOBILE_RAVEN_SCALE = 0.65; // Scale ravens down to 65% on mobile

// Daily challenge: 90-second time limit, harder raven mix
const DAILY_TIME_LIMIT_SEC = 90;
// Daily raven table: each entry is [type, weight]
const DAILY_RAVEN_WEIGHTS = [
    ['normal', 20], ['red', 18], ['ghost', 22],
    ['golden', 10], ['blue', 12], ['giant', 10], ['boss_wave', 8]
];

const RANKS = [
    {name:'Fledgling',   minXP:0},
    {name:'Cadet',       minXP:200},
    {name:'Hunter',      minXP:600},
    {name:'Marksman',    minXP:1400},
    {name:'Knight',      minXP:2800},
    {name:'Veteran',     minXP:5000},
    {name:'Lord',        minXP:8000},
    {name:'Champion',    minXP:12000},
    {name:'Legend',      minXP:18000},
    {name:'Raven Slayer',minXP:25000},
];

const DIFFICULTY_SETTINGS = {
    easy: {
        maxLives:        9,
        baseInterval:    800,   // ravens spawn slowly
        speedPerLevel:   0.04,  // speed scales very gently
        minInterval:     220,   // never spawns faster than this
        maxOnScreen:     5,     // fewer ravens visible at once
        redChance:       0.03,  // rare -2 heart reds
        ghostChanceBase: 0.005, // ghosts barely appear
        ghostChanceCap:  0.06,
        giantChanceBase: 0.005,
        giantChanceCap:  0.05,
        extraLifeChance: 0.12,  // generous heart drops
        comboTimeout:    2200,  // very forgiving combo window
        bossInterval:    8,     // boss every 8 levels (rare)
        bossHPMult:      0.6,   // bosses have fewer HP
    },
    normal: {
        maxLives:        5,
        baseInterval:    500,
        speedPerLevel:   0.09,
        minInterval:     130,
        maxOnScreen:     8,
        redChance:       0.08,
        ghostChanceBase: 0.02,
        ghostChanceCap:  0.15,
        giantChanceBase: 0.01,
        giantChanceCap:  0.10,
        extraLifeChance: 0.06,
        comboTimeout:    1500,
        bossInterval:    5,
        bossHPMult:      1.0,
    },
    hard: {
        maxLives:        3,
        baseInterval:    320,   // already fast at level 1
        speedPerLevel:   0.16,  // speed ramps steeply
        minInterval:     80,    // can get very fast
        maxOnScreen:     12,    // chaotic screen
        redChance:       0.16,  // reds are common
        ghostChanceBase: 0.06,  // ghosts from level 1
        ghostChanceCap:  0.28,
        giantChanceBase: 0.02,
        giantChanceCap:  0.14,
        extraLifeChance: 0.025, // almost no free hearts
        comboTimeout:    900,   // tight combo window
        bossInterval:    4,     // boss every 4 levels
        bossHPMult:      1.5,   // bosses tankier
    }
};

const COMBO_FEEDBACK = {
    3:'Nice!', 5:'Great!', 8:'On Fire! 🔥',
    10:'Amazing!', 15:'Unstoppable! ⚡', 20:'GODLIKE!! 👑'
};

const MILESTONES = {
    25:  {title:'The Skies Darken…',    text:'The ravens are learning. Ghost tactics and giant allies now flood the skies.'},
    50:  {title:'Halfway to Legend',    text:'Level 50. The storm rages. Only sharpshooters survive from here.'},
    100: {title:'The Inferno Begins',   text:'Level 100. Ancient fire-feathered ravens now lead the charge.'},
    150: {title:'The Void Opens',       text:'Level 150. The raven flock has breached the void. Rules no longer apply.'},
    199: {title:'The Final Gauntlet',   text:'One level remains. The Raven King himself awaits. Finish this.'},
};

const POWERUP_TYPES = {
    shield:    {emoji:'🛡️', label:'Shield',    color:'#e8a020', desc:'Blocks the next life loss'},
    magnet:    {emoji:'🧲', label:'Magnet',    color:'#e03a20', desc:'Zaps all ravens instantly'},
    doublepts: {emoji:'⭐', label:'2× Points', color:'#ffd700', desc:'Double points for 8 seconds'},
    freeze:    {emoji:'❄️', label:'Freeze',    color:'#5cc8e0', desc:'Freezes all ravens for 3 sec'},
};

const RAVEN_TYPES_DEF = {
    normal:null, golden:[255,215,0], red:[255,60,60],
    blue:[80,120,255], ghost:[200,220,255], giant:[160,80,20], boss:[255,100,0]
};

// ═══════════════════════════════════════════════════════════════
//  WEB AUDIO ENGINE  — all sounds generated procedurally
// ═══════════════════════════════════════════════════════════════
let _audioCtx = null;
let soundMuted = localStorage.getItem('ravenAttackMuted') === '1';

function getAudioCtx() {
    if (!_audioCtx) {
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_audioCtx.state === 'suspended') _audioCtx.resume();
    return _audioCtx;
}

// Master volume node
function getMasterGain() {
    const ac = getAudioCtx();
    if (!_masterGain) {
        _masterGain = ac.createGain();
        _masterGain.gain.value = soundMuted ? 0 : 0.6;
        _masterGain.connect(ac.destination);
    }
    return _masterGain;
}
let _masterGain = null;

function setMutedAudio(muted) {
    soundMuted = muted;
    if (_masterGain) _masterGain.gain.value = muted ? 0 : 0.6;
    // Note: music mute is separate — use toggleMusic() for BGM
}

// ── Synth helpers ─────────────────────────────────────────────
function playTone(opts) {
    // opts: { freq, type, duration, attack, decay, volume, detune, freqEnd }
    if (soundMuted) return;
    try {
        const ac = getAudioCtx();
        const mg = getMasterGain();
        const gain = ac.createGain();
        gain.connect(mg);
        const osc = ac.createOscillator();
        osc.connect(gain);
        osc.type = opts.type || 'sine';
        osc.frequency.setValueAtTime(opts.freq, ac.currentTime);
        if (opts.detune) osc.detune.setValueAtTime(opts.detune, ac.currentTime);
        if (opts.freqEnd !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), ac.currentTime + (opts.duration || 0.15));
        const vol = (opts.volume || 0.4);
        const atk = opts.attack || 0.005;
        const dur = opts.duration || 0.15;
        const dec = opts.decay || dur * 0.7;
        gain.gain.setValueAtTime(0, ac.currentTime);
        gain.gain.linearRampToValueAtTime(vol, ac.currentTime + atk);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + atk + dec);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + dur + 0.05);
    } catch (_) {}
}

function playNoise(opts) {
    // white noise burst — for explosions/impacts
    if (soundMuted) return;
    try {
        const ac = getAudioCtx();
        const mg = getMasterGain();
        const dur = opts.duration || 0.12;
        const bufSize = Math.floor(ac.sampleRate * dur);
        const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
        const src = ac.createBufferSource();
        src.buffer = buf;
        // Band-pass to shape the noise
        const filt = ac.createBiquadFilter();
        filt.type = 'bandpass';
        filt.frequency.value = opts.freq || 400;
        filt.Q.value = opts.Q || 1;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(opts.volume || 0.5, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
        src.connect(filt); filt.connect(gain); gain.connect(mg);
        src.start(); src.stop(ac.currentTime + dur + 0.05);
    } catch (_) {}
}

// ── Individual sounds ─────────────────────────────────────────
const SFX = {
    hit(pitch = 1) {
        // Short crisp click + tone
        playNoise({ duration: 0.04, freq: 800, Q: 4, volume: 0.35 });
        playTone({ freq: 420 * pitch, type: 'triangle', duration: 0.12, decay: 0.1, volume: 0.3, freqEnd: 280 * pitch });
    },
    explosion() {
        playNoise({ duration: 0.22, freq: 200, Q: 0.6, volume: 0.65 });
        playTone({ freq: 80, type: 'sawtooth', duration: 0.18, decay: 0.15, volume: 0.4, freqEnd: 30 });
    },
    bossHit() {
        playNoise({ duration: 0.15, freq: 300, Q: 1.5, volume: 0.7 });
        playTone({ freq: 160, type: 'square', duration: 0.25, decay: 0.2, volume: 0.5, freqEnd: 60 });
    },
    bossSlain() {
        // Triumphant descending chord
        [660, 550, 440, 330].forEach((f, i) => {
            setTimeout(() => {
                playTone({ freq: f, type: 'triangle', duration: 0.35, decay: 0.3, volume: 0.4 });
            }, i * 80);
        });
        playNoise({ duration: 0.4, freq: 250, Q: 0.5, volume: 0.5 });
    },
    levelUp() {
        [330, 440, 550, 660].forEach((f, i) => {
            setTimeout(() => {
                playTone({ freq: f, type: 'triangle', duration: 0.2, decay: 0.18, volume: 0.35 });
            }, i * 70);
        });
    },
    combo(count) {
        const base = 300 + count * 25;
        playTone({ freq: base, type: 'square', duration: 0.08, decay: 0.07, volume: 0.28 });
        playTone({ freq: base * 1.25, type: 'triangle', duration: 0.1, decay: 0.08, volume: 0.2, attack: 0.01 });
    },
    powerupCollect() {
        playTone({ freq: 880, type: 'sine', duration: 0.15, decay: 0.12, volume: 0.35 });
        playTone({ freq: 1100, type: 'sine', duration: 0.12, decay: 0.1, volume: 0.25, attack: 0.04 });
    },
    powerupActivate() {
        [440, 550, 660, 880].forEach((f, i) => {
            setTimeout(() => playTone({ freq: f, type: 'sine', duration: 0.12, decay: 0.1, volume: 0.3 }), i * 50);
        });
    },
    shieldBlock() {
        playTone({ freq: 220, type: 'triangle', duration: 0.25, decay: 0.22, volume: 0.5 });
        playNoise({ duration: 0.1, freq: 600, Q: 3, volume: 0.3 });
    },
    escape() {
        playTone({ freq: 180, type: 'sawtooth', duration: 0.18, decay: 0.15, volume: 0.38, freqEnd: 90 });
    },
    warning() {
        playTone({ freq: 440, type: 'square', duration: 0.12, decay: 0.1, volume: 0.45 });
        setTimeout(() => playTone({ freq: 440, type: 'square', duration: 0.12, decay: 0.1, volume: 0.45 }), 200);
        setTimeout(() => playTone({ freq: 550, type: 'square', duration: 0.25, decay: 0.22, volume: 0.5 }), 400);
    },
    dailyStart() {
        [220, 330, 440, 660, 880].forEach((f, i) => {
            setTimeout(() => playTone({ freq: f, type: 'triangle', duration: 0.2, decay: 0.18, volume: 0.3 }), i * 60);
        });
    },
    victory() {
        const melody = [523, 659, 784, 1047, 784, 1047];
        melody.forEach((f, i) => {
            setTimeout(() => playTone({ freq: f, type: 'triangle', duration: 0.35, decay: 0.3, volume: 0.38 }), i * 120);
        });
    },
    freeze() {
        // High icy shimmer
        [1200, 1400, 1000, 900].forEach((f, i) => {
            setTimeout(() => playTone({ freq: f, type: 'sine', duration: 0.12, decay: 0.1, volume: 0.22 }), i * 40);
        });
    },
    countdown() {
        playTone({ freq: 660, type: 'triangle', duration: 0.1, decay: 0.09, volume: 0.4 });
    },
    countdownGo() {
        playTone({ freq: 880, type: 'triangle', duration: 0.25, decay: 0.22, volume: 0.5 });
    },
    milestone() {
        [220, 277, 330, 440].forEach((f, i) => {
            setTimeout(() => playTone({ freq: f, type: 'triangle', duration: 0.4, decay: 0.35, volume: 0.3 }), i * 100);
        });
    },
    timeWarning() {
        // Urgent pulsing beep (under 20s daily)
        playTone({ freq: 880, type: 'square', duration: 0.08, decay: 0.06, volume: 0.5 });
    }
};

// ── Background music — synthesized Web Audio API ────────────
// Separate from SFX mute: musicMuted controls BGM, soundMuted controls SFX
let musicMuted = localStorage.getItem('ravenAttackMusicMuted') === '1'; // default ON (false)

// Synthesized background music loop
class SynthMusic {
    constructor() {
        this.playing = false;
        this.loopTimeout = null;
    }
    play() {
        this.playing = true;
        this.playLoop();
    }
    pause() {
        this.playing = false;
        if (this.loopTimeout) clearTimeout(this.loopTimeout);
    }
    playLoop() {
        if (!this.playing) return;
        // 8-bar pattern (looped)
        const pattern = [
            { freq: 220, dur: 0.4, delay: 0 },
            { freq: 275, dur: 0.4, delay: 0.4 },
            { freq: 330, dur: 0.4, delay: 0.8 },
            { freq: 220, dur: 0.4, delay: 1.2 },
            { freq: 330, dur: 0.4, delay: 1.6 },
            { freq: 440, dur: 0.8, delay: 2.0 },
            { freq: 330, dur: 0.4, delay: 2.8 },
            { freq: 275, dur: 0.4, delay: 3.2 }
        ];
        pattern.forEach(note => {
            if (this.playing) {
                setTimeout(() => {
                    if (this.playing) playTone({ freq: note.freq, type: 'sine', duration: note.dur, decay: note.dur * 0.8, volume: 0.15, attack: 0.02 });
                }, note.delay * 1000);
            }
        });
        const loopDuration = 4000; // 4 seconds per loop
        this.loopTimeout = setTimeout(() => this.playLoop(), loopDuration);
    }
}

const _bgMusic = new SynthMusic();
const _bgMusicPlaybackRate = 1.0;

function applyMusicMute() {
    _bgMusic.muted = musicMuted;
    // Update all music toggle buttons (HUD + start screen share the same id — only one is visible at a time)
    document.querySelectorAll('#musicBtn').forEach(btn => {
        btn.textContent = musicMuted ? '🔇🎵' : '🎵';
        btn.classList.toggle('muted', musicMuted);
    });
    // Update start-screen dedicated button if present
    const startBtn2 = document.getElementById('musicBtnStart');
    if (startBtn2) {
        startBtn2.textContent = musicMuted ? '🔇 Music: OFF' : '🎵 Music: ON';
        startBtn2.classList.toggle('muted', musicMuted);
    }
}

function startMusic() {
    if (musicMuted) return;
    // Resume AudioContext for SFX (browsers require gesture)
    try { getAudioCtx(); } catch(_) {}
    // Slightly faster playback in daily mode (playbackRate adjusts loop duration if needed)
    if (!_bgMusic.playing) {
        _bgMusic.play();
    }
}

function stopMusic() {
    _bgMusic.pause();
}

function toggleMusic() {
    musicMuted = !musicMuted;
    localStorage.setItem('ravenAttackMusicMuted', musicMuted ? '1' : '0');
    applyMusicMute();
    if (!musicMuted && (gameStarted || !document.getElementById('startScreen').classList.contains('hidden'))) {
        startMusic();
    } else if (musicMuted) {
        stopMusic();
    }
}

// ── Raven ambient sound — synthesized Web Audio API every 5 seconds ─────
let _ravenAmbientTimer = null;
let _ravenSoundTimer = 0;
const RAVEN_SOUND_INTERVAL = 5000; // ms

function playRavenCall() {
    // Synthesized raven caw: descending warble with noise
    if (soundMuted) return;
    playNoise({ duration: 0.15, freq: 600, Q: 2, volume: 0.4 });
    playTone({ freq: 320, type: 'sawtooth', duration: 0.35, decay: 0.3, volume: 0.35, freqEnd: 180 });
}

function tickRavenSound(dt) {
    // Only tick during pure active gameplay — stop on any overlay/end state
    if (soundMuted || gamePaused || !gameStarted || gameOver || levelCompleteActive || milestoneActive || gameWon) {
        _ravenSoundTimer = 0;
        return;
    }
    _ravenSoundTimer += dt;
    if (_ravenSoundTimer >= RAVEN_SOUND_INTERVAL) {
        _ravenSoundTimer = 0;
        try {
            playRavenCall();
        } catch(_) {}
    }
}

// ═══════════════════════════════════════════════════════════════
//  DAILY CHALLENGE — seeded, different rules
// ═══════════════════════════════════════════════════════════════
function getDailyKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function getDailySeed() {
    let h = 0, s = getDailyKey();
    for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
}
// Simple seeded LCG random
function makeSeededRng(seed) {
    let s = seed >>> 0;
    return function() {
        s = (Math.imul(1664525, s) + 1013904223) >>> 0;
        return s / 4294967296;
    };
}
let dailyRng = null; // set when daily starts

function hasDoneDaily() { return localStorage.getItem('ravenAttackDailyDate') === getDailyKey(); }
function markDailyDone(sc) { localStorage.setItem('ravenAttackDailyDate', getDailyKey()); localStorage.setItem('ravenAttackDailyScore', sc); }
function getDailyScore() { return localStorage.getItem('ravenAttackDailyScore') || '—'; }

// Daily: seeded raven type selection using weighted table
function pickDailyRavenType() {
    const rng = dailyRng || Math.random;
    const totalWeight = DAILY_RAVEN_WEIGHTS.reduce((a, [, w]) => a + w, 0);
    let r = rng() * totalWeight;
    for (const [type, weight] of DAILY_RAVEN_WEIGHTS) {
        r -= weight;
        if (r <= 0) return type === 'boss_wave' ? 'red' : type; // boss_wave becomes red for fairness
    }
    return 'normal';
}

// Daily timer
let dailyTimeLeft = DAILY_TIME_LIMIT_SEC;
let dailyTimerInterval = null;

function startDailyTimer() {
    dailyTimeLeft = DAILY_TIME_LIMIT_SEC;
    updateDailyTimerUI();
    dailyTimerInterval = setInterval(() => {
        if (!gameStarted || gamePaused || levelCompleteActive || milestoneActive) return;
        dailyTimeLeft--;
        updateDailyTimerUI();
        if (dailyTimeLeft <= 20) SFX.timeWarning();
        if (dailyTimeLeft <= 0) {
            clearInterval(dailyTimerInterval);
            // Time's up — end game with current score
            gameOver = true;
        }
    }, 1000);
}

function stopDailyTimer() {
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
}

function updateDailyTimerUI() {
    if (!dailyTimerEl) return;
    if (!isDailyChallenge) { dailyTimerEl.classList.add('hidden'); return; }
    dailyTimerEl.classList.remove('hidden');
    const mins = Math.floor(dailyTimeLeft / 60);
    const secs = dailyTimeLeft % 60;
    dailyTimerEl.textContent = `⏰ ${mins}:${secs.toString().padStart(2, '0')}`;
    dailyTimerEl.classList.toggle('timer-urgent', dailyTimeLeft <= 20);
}

// ── LocalStorage ───────────────────────────────────────────────────────────────
function getHighScore()  { return parseInt(localStorage.getItem('ravenAttackHighScore') || '0', 10); }
function setHighScore(v) { highScore = Math.max(highScore, v); localStorage.setItem('ravenAttackHighScore', String(highScore)); }
function getLeaderboard(){ try{return JSON.parse(localStorage.getItem('ravenAttackLeaderboard')||'[]');}catch(_){return[];} }
function saveLeaderboard(l){ localStorage.setItem('ravenAttackLeaderboard', JSON.stringify(l.slice(0, 5))); }
function addToLeaderboard(s, lvl, daily) {
    const l = getLeaderboard();
    l.push({ score: s, level: lvl, date: Date.now(), daily: !!daily });
    l.sort((a, b) => b.score - a.score);
    saveLeaderboard(l);
}
function renderLeaderboard(el) {
    const l = getLeaderboard();
    el.innerHTML = l.length
        ? l.map((e, i) => `<li>#${i+1} ${e.score} (Lv.${e.level})${e.daily ? ' 📅' : ''}</li>`).join('')
        : '<li>No games yet</li>';
}
function getStats() {
    return {
        totalGames:    +(localStorage.getItem('ravenAttackTotalGames')     || 0),
        bestLevel:     +(localStorage.getItem('ravenAttackBestLevel')      || 1),
        bestCombo:     +(localStorage.getItem('ravenAttackBestCombo')      || 0),
        totalRavensHit:+(localStorage.getItem('ravenAttackTotalRavensHit') || 0),
        bossesKilled:  +(localStorage.getItem('ravenAttackBossesKilled')   || 0),
    };
}
function saveStats(s) {
    localStorage.setItem('ravenAttackTotalGames',     s.totalGames);
    localStorage.setItem('ravenAttackBestLevel',      s.bestLevel);
    localStorage.setItem('ravenAttackBestCombo',      s.bestCombo);
    localStorage.setItem('ravenAttackTotalRavensHit', s.totalRavensHit);
    localStorage.setItem('ravenAttackBossesKilled',   s.bossesKilled);
}
function updateStatsOnGameEnd() {
    const s = getStats();
    s.totalGames++;
    s.bestLevel      = Math.max(s.bestLevel, level);
    s.bestCombo      = Math.max(s.bestCombo, maxComboThisGame);
    s.totalRavensHit += ravensHitThisGame;
    // bossesKilled is written directly on boss kill — just carry current value through
    saveStats(s);
}

// ── Achievements ───────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
    {id:'level5',   name:'Reach Level 5',    check:()=>level>=5},
    {id:'level10',  name:'Reach Level 10',   check:()=>level>=10},
    {id:'level25',  name:'Reach Level 25',   check:()=>level>=25},
    {id:'level50',  name:'Reach Level 50',   check:()=>level>=50},
    {id:'level100', name:'Reach Level 100',  check:()=>level>=100},
    {id:'level200', name:'👑 Raven Slayer',  check:()=>level>=200},
    {id:'score500', name:'Score 500',        check:()=>score>=500},
    {id:'score1k',  name:'Score 1000',       check:()=>score>=1000},
    {id:'combo10',  name:'10-hit combo',     check:()=>maxComboThisGame>=10},
    {id:'combo20',  name:'20-hit combo',     check:()=>maxComboThisGame>=20},
    {id:'boss5',    name:'Beat 5 bosses',    check:()=>+(localStorage.getItem('ravenAttackBossesKilled')||0)>=5},
    {id:'accuracy', name:'100% Accuracy',    check:()=>totalTapsThisLevel>5&&ravensHitThisLevel===totalTapsThisLevel},
    {id:'daily',    name:'Daily Challenger', check:()=>hasDoneDaily()},
];
function getUnlocked() { try{return JSON.parse(localStorage.getItem('ravenAttackAchievements')||'[]');}catch(_){return[];} }
function unlockAchievement(id, name) {
    const u = getUnlocked(); if (u.includes(id)) return;
    u.push(id); localStorage.setItem('ravenAttackAchievements', JSON.stringify(u));
    showToast('🏆 ' + name);
}
function checkAchievements() {
    const u = getUnlocked();
    ACHIEVEMENTS.forEach(a => { if (a.check() && !u.includes(a.id)) unlockAchievement(a.id, a.name); });
}

// ── XP / Rank ─────────────────────────────────────────────────────────────────
let playerXP = parseInt(localStorage.getItem('ravenAttackXP') || '0', 10);
function addXP(n) { playerXP += n; localStorage.setItem('ravenAttackXP', playerXP); }
function getRank(xp) { let r = RANKS[0]; for (const rk of RANKS) { if (xp >= rk.minXP) r = rk; } return r; }
function getNextRankXP(xp) { for (const rk of RANKS) { if (rk.minXP > xp) return rk.minXP; } return null; }

// ── Level bests ────────────────────────────────────────────────────────────────
function getLevelBests() { try{return JSON.parse(localStorage.getItem('ravenAttackLevelBests')||'{}');}catch(_){return{};} }
function saveLevelBest(lvl, sc) { const b=getLevelBests(); if(!b[lvl]||sc>b[lvl]){b[lvl]=sc; localStorage.setItem('ravenAttackLevelBests', JSON.stringify(b));} }

// ── UI helpers ─────────────────────────────────────────────────────────────────
function showToast(msg, dur=2600) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden'); toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.classList.remove('show'); setTimeout(() => toastEl.classList.add('hidden'), 350); }, dur);
}
function triggerShake(ms, amt) { shakeUntil=Date.now()+ms; shakeDuration=ms; shakeAmount=amt; }
function triggerFlash(color, alpha=0.4) { flashColor=color; flashAlpha=alpha; }
function showWarning(msg, dur=2500) {
    warningText.textContent = msg;
    warningBanner.classList.remove('hidden'); warningBanner.classList.add('show');
    clearTimeout(warningBanner._t);
    warningBanner._t = setTimeout(() => { warningBanner.classList.remove('show'); setTimeout(() => warningBanner.classList.add('hidden'), 400); }, dur);
    SFX.warning();
}

function setTheme() {
    let t = 'day';
    if (level > 150)     t = 'void';
    else if (level > 100) t = 'inferno';
    else if (level > 50)  t = 'storm';
    else if (level > 20)  t = 'night';
    else if (level > 9)   t = 'dusk2';
    else if (level > 3)   t = 'dusk';
    if (isDailyChallenge) t = 'daily';
    document.body.dataset.theme = t;
}
function resizeCanvases() {
    const r = gameContainer.getBoundingClientRect();
    canvas.width = collisionCanvas.width = bgCanvas.width = r.width;
    canvas.height = collisionCanvas.height = bgCanvas.height = r.height;
    initBgLayers();
}
function getCanvasCoords(cx, cy) {
    const r = canvas.getBoundingClientRect();
    return { x: (cx - r.left) * (canvas.width / r.width), y: (cy - r.top) * (canvas.height / r.height) };
}
function randomNormalColor() {
    let r, g, b;
    do { r=Math.floor(Math.random()*256); g=Math.floor(Math.random()*256); b=Math.floor(Math.random()*256); }
    while ((r===255&&g===215&&b===0)||(r===255&&g===60&&b===60)||(r===80&&g===120&&b===255)||(r===255&&g===100&&b===0));
    return [r, g, b];
}

// ── Accuracy / Grade ───────────────────────────────────────────────────────────
function getAccuracy(hits, taps) { return taps === 0 ? 100 : Math.round((hits / taps) * 100); }
function getGrade(acc) {
    if (acc >= 95) return {grade:'S', color:'#ffd700'};
    if (acc >= 85) return {grade:'A', color:'#7bed9f'};
    if (acc >= 70) return {grade:'B', color:'#e8a020'};
    if (acc >= 55) return {grade:'C', color:'#ff8c42'};
    return {grade:'D', color:'#e03a20'};
}

// ── Mission target ─────────────────────────────────────────────────────────────
function getMissionTarget(lvl) {
    if (isDailyChallenge) return 999; // daily: survive time limit, no per-level cap
    return Math.round(5 + (lvl - 1) * 1.8);
}
function getBossHP(lvl) { const tier=Math.max(1,Math.floor(lvl/diffBossInterval)); return BOSS_BASE_HP+(tier-1)*BOSS_HP_PER_TIER; }

// ── Parallax background ────────────────────────────────────────────────────────
let bgLayers = [];
function initBgLayers() {
    bgLayers = [];
    for (let layer = 0; layer < 3; layer++) {
        const count = 6 + layer * 4;
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push({ x: Math.random()*bgCanvas.width, y: Math.random()*bgCanvas.height,
                r: 4+Math.random()*(20-layer*4), speed: 0.08*(layer+1),
                alpha: 0.04+layer*0.03, wobble: Math.random()*Math.PI*2, wobbleSpeed: 0.002+Math.random()*0.003 });
        }
        bgLayers.push(items);
    }
}
function drawBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const themeColors = {
        day:'rgba(180,220,255', dusk:'rgba(255,140,60', dusk2:'rgba(200,90,30',
        night:'rgba(50,70,180', storm:'rgba(40,55,140', inferno:'rgba(200,40,15',
        void:'rgba(90,20,130', daily:'rgba(60,10,10'
    };
    const t = document.body.dataset.theme || 'day';
    const base = themeColors[t] || themeColors.day;
    bgLayers.forEach((layer, li) => {
        layer.forEach(s => {
            s.x -= s.speed; s.wobble += s.wobbleSpeed;
            if (s.x < -s.r) s.x = bgCanvas.width + s.r;
            const yOff = Math.sin(s.wobble) * 12;
            bgCtx.beginPath();
            bgCtx.arc(s.x, s.y + yOff, s.r, 0, Math.PI * 2);
            bgCtx.fillStyle = `${base},${s.alpha + li * 0.02})`;
            bgCtx.fill();
        });
    });
}

// ═══════════════════════════════════════════════════════════════
//  POWER-UPS
// ═══════════════════════════════════════════════════════════════
class PowerupItem {
    constructor(type) {
        this.type = type;
        const def = POWERUP_TYPES[type];
        this.emoji = def.emoji; this.color = def.color;
        this.x = canvas.width + 60;
        this.y = Math.random() * (canvas.height - 100) + 50;
        this.speed = 2.2 + Math.random() * 1.5;
        this.radius = 28;
        this.markedForDeletion = false;
        this.pulse = Math.random() * Math.PI * 2;
        this.bobY = this.y; this.bobPhase = Math.random() * Math.PI * 2;
    }
    update(dt) {
        this.x -= this.speed;
        this.bobPhase += 0.003 * dt;
        this.y = this.bobY + Math.sin(this.bobPhase) * 8;
        this.pulse += 0.005 * dt;
        if (this.x < -this.radius * 2) this.markedForDeletion = true;
    }
    draw() {
        const glow = 0.55 + 0.45 * Math.abs(Math.sin(this.pulse));
        ctx.save();
        ctx.globalAlpha = glow * 0.35;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius + 7, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.fill();
        ctx.globalAlpha = 0.92;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.font = `${this.radius}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y);
        ctx.restore();
    }
    isHit(px, py) { return Math.hypot(px - this.x, py - this.y) < this.radius + 8; }
}

let powerupSpawnTimer = 0;
const POWERUP_SPAWN_INTERVAL = 18000;
let shieldActive = false, doublePointsUntil = 0, freezeUntil = 0;
let powerupInventory = [];

function spawnPowerup() {
    const keys = Object.keys(POWERUP_TYPES);
    const type = keys[Math.floor(Math.random() * keys.length)];
    powerups.push(new PowerupItem(type));
}

function activatePowerup(type) {
    SFX.powerupActivate();
    triggerFlash(POWERUP_TYPES[type].color, 0.28);
    if (type === 'shield') {
        shieldActive = true;
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2-60, '🛡️ SHIELD ACTIVE!', '#e8a020', 30));
        showToast('🛡️ Shield Active — next escape blocked!');
    } else if (type === 'magnet') {
        let zapped = 0;
        ravens.forEach(r => {
            if (!r.markedForDeletion && r.type !== 'boss') {
                r.markedForDeletion = true;
                const mult = doublePointsUntil > Date.now() ? 2 : 1;
                const pts = (r.type === 'golden' ? GOLDEN_POINTS_MULT : r.type === 'giant' ? 5 : 3) * mult;
                score += pts; ravensHitThisGame++; ravensHitThisLevel++;
                explosions.push(new Explosion(r.x, r.y, r.width));
                for (let i = 0; i < 5; i++) particles.push(new Particle(r.x, r.y, r.width, r.color));
                zapped++;
            }
        });
        if (score > highScore) setHighScore(score);
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2-60, `🧲 ZAPPED ${zapped}!`, '#e03a20', 30));
        triggerShake(300, 6);
        showToast(`🧲 Magnet — ${zapped} ravens zapped!`);
    } else if (type === 'doublepts') {
        doublePointsUntil = Date.now() + 8000;
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2-60, '⭐ 2× POINTS!', '#ffd700', 30));
        showToast('⭐ 2× Points active for 8 seconds!');
    } else if (type === 'freeze') {
        freezeUntil = Date.now() + 3000;
        SFX.freeze();
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2-60, '❄️ FROZEN!', '#5cc8e0', 30));
        triggerFlash('#5cc8e0', 0.22);
        showToast('❄️ Freeze — ravens frozen for 3 seconds!');
    }
    renderPowerupInventory();
}

function collectPowerup(pu) {
    pu.markedForDeletion = true;
    SFX.powerupCollect();
    if (powerupInventory.length >= 2) {
        // Inventory full — auto-use it
        activatePowerup(pu.type);
        showToast(`${POWERUP_TYPES[pu.type].emoji} Inventory full — ${POWERUP_TYPES[pu.type].label} used instantly!`);
    } else {
        const slotIdx = powerupInventory.length;
        powerupInventory.push(pu.type);
        renderPowerupInventory();
        // Pulse the newly filled slot
        const slots = powerupSlots.querySelectorAll('.powerup-slot');
        if (slots[slotIdx]) {
            slots[slotIdx].classList.add('just-collected');
            setTimeout(() => slots[slotIdx]?.classList.remove('just-collected'), 2000);
        }
        // First-ever collect tutorial (shown once)
        if (!localStorage.getItem('ravenAttackPowerupTip')) {
            localStorage.setItem('ravenAttackPowerupTip', '1');
            showToast(`${POWERUP_TYPES[pu.type].emoji} Powerup saved! Tap the slot (bottom-left) or press [${slotIdx + 1}] to use it!`, 4000);
        } else {
            showToast(`${POWERUP_TYPES[pu.type].emoji} ${POWERUP_TYPES[pu.type].label} — tap slot [${slotIdx + 1}] or press [${slotIdx + 1}]!`);
        }
    }
}

function renderPowerupInventory() {
    powerupSlots.innerHTML = '';
    const activeEffectsEl = document.getElementById('activeEffects');
    if (activeEffectsEl) activeEffectsEl.innerHTML = '';

    for (let i = 0; i < 2; i++) {
        const type = powerupInventory[i];
        const slot = document.createElement('div');
        slot.className = 'powerup-slot' + (type ? '' : ' empty');
        slot.dataset.slotIndex = i;

        // Key label [1] / [2]
        const keyLabel = document.createElement('div');
        keyLabel.className = 'powerup-slot-key';
        keyLabel.textContent = `[${i + 1}]`;
        slot.appendChild(keyLabel);

        // Box (the visual square)
        const box = document.createElement('div');
        box.className = 'powerup-slot-box';

        if (type) {
            const def = POWERUP_TYPES[type];
            box.style.borderColor = def.color + 'bb';
            box.style.boxShadow = `0 0 14px ${def.color}44, inset 0 0 8px ${def.color}11`;
            box.textContent = def.emoji;
            box.title = `${def.label} — ${def.desc}\nPress [${i + 1}] or tap to use`;
            slot.addEventListener('click', () => useSlot(i));
            slot.addEventListener('touchend', (e) => { e.preventDefault(); useSlot(i); });
        } else {
            const hint = document.createElement('span');
            hint.className = 'powerup-slot-empty-hint';
            hint.textContent = '·';
            box.appendChild(hint);
        }
        slot.appendChild(box);

        // Name label below box
        const nameLabel = document.createElement('div');
        nameLabel.className = 'powerup-slot-name';
        nameLabel.textContent = type ? POWERUP_TYPES[type].label : 'Empty';
        slot.appendChild(nameLabel);

        powerupSlots.appendChild(slot);
    }

    // Active effects with countdown bars
    if (!activeEffectsEl) return;
    const now = Date.now();
    const effects = [];
    if (shieldActive) effects.push({ emoji:'🛡️', label:'Shield', color:'#e8a020', pct:1, infinite:true });
    if (doublePointsUntil > now) effects.push({ emoji:'⭐', label:`2× ${Math.ceil((doublePointsUntil-now)/1000)}s`, color:'#ffd700', pct:(doublePointsUntil-now)/8000 });
    if (freezeUntil > now)       effects.push({ emoji:'❄️', label:`Frozen ${Math.ceil((freezeUntil-now)/1000)}s`,   color:'#5cc8e0', pct:(freezeUntil-now)/3000 });

    effects.forEach(ef => {
        const row = document.createElement('div');
        row.className = 'active-effect';
        row.innerHTML = `<span class="active-effect-emoji">${ef.emoji}</span>
            <div class="active-effect-bar-wrap"><div class="active-effect-bar" style="width:${Math.min(100,ef.pct*100)}%;background:${ef.color}"></div></div>
            <span class="active-effect-label">${ef.label}</span>`;
        activeEffectsEl.appendChild(row);
    });
}

function useSlot(idx) {
    if (!gameStarted || gameOver || gamePaused || levelCompleteActive) return;
    if (!powerupInventory[idx]) return;
    const t = powerupInventory.splice(idx, 1)[0];
    activatePowerup(t);
    renderPowerupInventory();
}

// ═══════════════════════════════════════════════════════════════
//  GAME STATE
// ═══════════════════════════════════════════════════════════════
let maxLives=5, baseInterval=500, speedPerLevel=0.09;
let ravenInterval=500, timeToNextRaven=0, lastTime=0;
let score=0, level=1, levelUpFlashUntil=0;
let highScore = getHighScore();
let lives=5, ravensEscaped=0;
let gameOver=false, gameStarted=false, gamePaused=false, gameWon=false;
let comboCount=0, maxComboThisGame=0, lastHitTime=0;
let animationId=null;
let bossSpawnedThisLevel=false, currentBoss=null, bossHP=0, bossMaxHP=0;
let slowMoUntil=0, shakeUntil=0, shakeAmount=0, shakeDuration=1;
let ravensHitThisGame=0, ravensHitThisLevel=0;
let totalTapsThisGame=0, totalTapsThisLevel=0;
let levelCompleteActive=false, levelCompleteShown=false;
let difficulty = localStorage.getItem('ravenAttackDifficulty') || 'normal';
let isDailyChallenge = false;
let escapeTimestamps = [];
let flashColor = '', flashAlpha = 0;
let ravens=[], explosions=[], particles=[], floatingTexts=[], powerups=[];
let pendingMilestone = null, milestoneActive = false;

// ═══════════════════════════════════════════════════════════════
//  GAME CLASSES
// ═══════════════════════════════════════════════════════════════
class Raven {
    constructor(speedMultiplier=1, options={}) {
        const isBoss  = options.type === 'boss';
        const isGiant = options.type === 'giant';
        this.type = options.type || 'normal';
        this.spriteWidth = 271; this.spriteHeight = 194;
        this.sizeModifier = isBoss ? 1.7 : isGiant ? 1.3 : (Math.random() * 0.6 + 0.4);
        // Apply mobile scaling
        if (IS_MOBILE) this.sizeModifier *= MOBILE_RAVEN_SCALE;
        this.width  = this.spriteWidth  * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        let bsx, bsy;
        if (isBoss)       { bsx = Math.random()*5+6; bsy = Math.random()*7-3.5; }
        else if (isGiant) { bsx = Math.random()*2+2; bsy = Math.random()*2-1; }
        else              { bsx = Math.random()*5+3; bsy = Math.random()*5-2.5; }
        this.directionX = bsx * speedMultiplier;
        this.directionY = bsy * speedMultiplier;
        this.zigzag = isBoss; this.zigzagTimer = 0; this.zigzagInterval = 500 + Math.random()*400;
        this.isGhost = this.type === 'ghost';
        this.ghostPhase = Math.random() * Math.PI * 2;
        this.ghostInvisTimer = 0;
        this.ghostInvisInterval = 1800 + Math.random() * 1500;
        this.ghostInvisDur = 900 + Math.random() * 700;
        this.ghostIsInvis = false;
        this.markedForDeletion = false; this.escaped = false;
        this.image = ASSETS.ravenImage;
        this.frame = 0; this.maxFrame = 4;
        this.timeSinceFlap = 0; this.flapInterval = Math.random() * 50 + 50;
        if (RAVEN_TYPES_DEF[this.type] && RAVEN_TYPES_DEF[this.type].length) {
            this.randomColors = RAVEN_TYPES_DEF[this.type].slice();
        } else {
            this.randomColors = randomNormalColor();
        }
        this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
        this.hasTrail = (Math.random() > 0.5 && this.type === 'normal') || this.type === 'golden' || this.type === 'boss';
        this.trailColor = this.type === 'golden' ? '#ffd700' : this.type === 'boss' ? '#ff4400' : this.color;
    }
    update(dt) {
        if (freezeUntil > Date.now() && this.type !== 'boss') return;
        if (this.y <= 0) { this.y=0; this.directionY = Math.abs(this.directionY); }
        if (this.y >= canvas.height - this.height) { this.y=canvas.height-this.height; this.directionY=-Math.abs(this.directionY); }
        if (this.zigzag) { this.zigzagTimer+=dt; if(this.zigzagTimer>this.zigzagInterval){this.directionY*=-1;this.zigzagTimer=0;this.zigzagInterval=400+Math.random()*500;} }
        this.x -= this.directionX; this.y += this.directionY;
        if (this.x < -this.width) { this.escaped = true; this.markedForDeletion = true; }
        if (this.isGhost) {
            this.ghostInvisTimer += dt;
            if (!this.ghostIsInvis && this.ghostInvisTimer > this.ghostInvisInterval) { this.ghostIsInvis=true; this.ghostInvisTimer=0; }
            else if (this.ghostIsInvis && this.ghostInvisTimer > this.ghostInvisDur) { this.ghostIsInvis=false; this.ghostInvisTimer=0; }
        }
        this.timeSinceFlap += dt;
        if (this.timeSinceFlap > this.flapInterval) {
            this.frame++; if(this.frame>this.maxFrame) this.frame=0; this.timeSinceFlap=0;
            if (this.hasTrail) for (let i=0;i<4;i++) particles.push(new Particle(this.x,this.y,this.width,this.trailColor));
        }
    }
    draw() {
        if (this.isGhost && this.ghostIsInvis) return;
        ctx.save();
        if      (this.isGhost) { this.ghostPhase+=0.04; ctx.globalAlpha=0.15+0.5*Math.abs(Math.sin(this.ghostPhase)); ctx.filter='brightness(1.8) saturate(0.2)'; }
        else if (this.type==='golden') { ctx.globalAlpha=0.92; ctx.filter='brightness(1.4) saturate(1.4)'; }
        else if (this.type==='red')    { ctx.filter='hue-rotate(-10deg) saturate(2) brightness(1.1)'; }
        else if (this.type==='blue')   { ctx.filter='hue-rotate(200deg) saturate(1.5)'; }
        else if (this.type==='giant')  { ctx.filter='sepia(0.5) saturate(1.3)'; }
        else if (this.type==='boss')   { const p=0.8+0.2*Math.sin(Date.now()/120); ctx.filter=`brightness(${p}) saturate(2.5) hue-rotate(-20deg)`; }
        ctx.drawImage(ASSETS.ravenImage, this.frame*271,0,271,194, this.x,this.y,this.width,this.height);
        if (this.type==='boss' && bossHP>0) {
            const pipW=14,pipH=8,gap=3,total=bossMaxHP;
            const sx=this.x+(this.width-(total*(pipW+gap)-gap))/2, sy=this.y-18;
            for (let i=0;i<total;i++) {
                ctx.globalAlpha=1; ctx.filter='none';
                ctx.fillStyle = i<bossHP ? '#ff3300' : 'rgba(255,255,255,0.15)';
                ctx.beginPath();
                if(ctx.roundRect) ctx.roundRect(sx+i*(pipW+gap),sy,pipW,pipH,3); else ctx.rect(sx+i*(pipW+gap),sy,pipW,pipH);
                ctx.fill();
            }
        }
        ctx.restore();
    }
}

class Explosion {
    constructor(x,y,size){this.image=ASSETS.explosionImage;this.spriteWidth=200;this.spriteHeight=179;this.size=size;this.x=x;this.y=y;this.frame=0;this.timeSinceLastFrame=0;this.frameInterval=80;this.markedForDeletion=false;this._soundPlayed=false;}
    update(dt){if(!this._soundPlayed){SFX.explosion();this._soundPlayed=true;}this.timeSinceLastFrame+=dt;if(this.timeSinceLastFrame>this.frameInterval){this.frame++;this.timeSinceLastFrame=0;if(this.frame>5)this.markedForDeletion=true;}}
    draw(){if(this.markedForDeletion)return;ctx.drawImage(ASSETS.explosionImage,this.frame*200,0,200,179,this.x,this.y-this.size/4,this.size,this.size);}
}
class Particle {
    constructor(x,y,size,color){this.size=size;this.x=x+size/2+Math.random()*50-25;this.y=y+size/3+Math.random()*50-25;this.radius=Math.random()*size/10;this.maxRadius=Math.random()*20+35;this.markedForDeletion=false;this.speedX=Math.random()*1+0.5;this.color=color;}
    update(){this.x+=this.speedX;this.radius+=0.3;if(this.radius>this.maxRadius-5)this.markedForDeletion=true;}
    draw(){ctx.save();ctx.globalAlpha=Math.max(0,1-this.radius/this.maxRadius);ctx.beginPath();ctx.fillStyle=this.color;ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.restore();}
}
class FloatingText {
    constructor(x,y,text,color='#fff',size=24){this.x=x;this.y=y;this.text=text;this.color=color;this.size=size;this.life=1;this.markedForDeletion=false;}
    update(){this.y-=1.5;this.life-=0.016;if(this.life<=0)this.markedForDeletion=true;}
    draw(){ctx.save();ctx.textAlign='center';ctx.font=`bold ${this.size}px Impact`;ctx.globalAlpha=Math.max(0,this.life);ctx.fillStyle=this.color;ctx.strokeStyle='#000';ctx.lineWidth=3;ctx.strokeText(this.text,this.x,this.y);ctx.fillText(this.text,this.x,this.y);ctx.restore();}
}

const ASSETS = { ravenImage: new Image(), explosionImage: new Image() };
ASSETS.ravenImage.src = 'raven.png'; ASSETS.explosionImage.src = 'boom.png';

// ═══════════════════════════════════════════════════════════════
//  DIFFICULTY / SPAWNING
// ═══════════════════════════════════════════════════════════════
// Per-difficulty live vars (set by applyDifficulty)
let diffRedChance=0.08, diffGhostBase=0.02, diffGhostCap=0.15;
let diffGiantBase=0.01, diffGiantCap=0.10, diffExtraLife=0.06;
let diffComboTimeout=1500, diffBossInterval=5, diffBossHPMult=1.0;
let diffMinInterval=130, diffMaxOnScreen=8;

function applyDifficulty() {
    const s = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.normal;
    maxLives       = s.maxLives;
    baseInterval   = s.baseInterval;
    speedPerLevel  = s.speedPerLevel;
    diffMinInterval    = s.minInterval;
    diffMaxOnScreen    = s.maxOnScreen;
    diffRedChance      = s.redChance;
    diffGhostBase      = s.ghostChanceBase;
    diffGhostCap       = s.ghostChanceCap;
    diffGiantBase      = s.giantChanceBase;
    diffGiantCap       = s.giantChanceCap;
    diffExtraLife      = s.extraLifeChance;
    diffComboTimeout   = s.comboTimeout;
    diffBossInterval   = s.bossInterval;
    diffBossHPMult     = s.bossHPMult;
}
function getLevelSpeedMult(lvl) { return 1 + (lvl - 1) * speedPerLevel; }

function pickRavenType() {
    if (isDailyChallenge) return pickDailyRavenType();
    const ghostChance = Math.min(diffGhostCap, diffGhostBase + level * 0.001);
    const giantChance = Math.min(diffGiantCap, diffGiantBase + level * 0.0005);
    const r = Math.random();
    if (r < 0.05)                                    return 'golden';
    if (r < 0.05 + diffRedChance)                    return 'red';
    if (r < 0.05 + diffRedChance + 0.03)             return 'blue';
    if (r < 0.05 + diffRedChance + 0.03 + ghostChance) return 'ghost';
    if (r < 0.05 + diffRedChance + 0.03 + ghostChance + giantChance) return 'giant';
    return 'normal';
}

function spawnRaven(speedMult, forceBoss) {
    if (ravens.filter(r => !r.markedForDeletion).length >= diffMaxOnScreen) return;
    // Daily: boss every 30 ravens instead of every level
    const isBossDaily = isDailyChallenge && !bossSpawnedThisLevel && ravensHitThisGame > 0 && ravensHitThisGame % 30 === 0;
    const isBoss = forceBoss || (level % diffBossInterval === 0 && !bossSpawnedThisLevel) || isBossDaily;
    if (isBoss) {
        bossSpawnedThisLevel = true;
        bossMaxHP = Math.max(1, Math.round(getBossHP(level) * diffBossHPMult));
        bossHP = bossMaxHP;
        triggerShake(SHAKE_BOSS_MS, SHAKE_BOSS_AMT); triggerFlash('#ff3300', 0.35);
        showWarning(`⚠️ BOSS LV${level} — ${bossMaxHP} HP ⚠️`, 3000);
    }
    const type = isBoss ? 'boss' : pickRavenType();
    const raven = new Raven(speedMult, { type });
    if (isBoss) currentBoss = raven;
    ravens.push(raven);
    ravens.sort((a, b) => a.width - b.width);
}

function updateDifficulty() {
    if (!isDailyChallenge) setTheme();
    const step = (level - 1) * 15;
    // Daily: faster spawn, harder
    const effectiveBase = isDailyChallenge ? Math.max(200, baseInterval - 150) : baseInterval;
    ravenInterval = Math.max(isDailyChallenge ? 100 : diffMinInterval, effectiveBase - step);
    const now = Date.now();
    escapeTimestamps = escapeTimestamps.filter(t => now - t < 5000);
    if (escapeTimestamps.length >= 3) { ravenInterval = Math.min(ravenInterval + 40, effectiveBase + 100); escapeTimestamps = []; }
    // Normal mode: level complete by ravens
    if (!isDailyChallenge && ravensHitThisLevel >= getMissionTarget(level) && !levelCompleteActive) {
        levelCompleteActive = true; levelCompleteShown = false; checkAchievements();
    }
}

// ── Boss health bar ────────────────────────────────────────────────────────────
function updateBossHealthBar() {
    if (!currentBoss || bossHP <= 0) { bossHealthBarWrap.classList.add('hidden'); return; }
    bossHealthBarWrap.classList.remove('hidden');
    bossNameEl.textContent = isDailyChallenge ? `👹 DAILY BOSS` : `👹 BOSS LV${level}`;
    bossHealthFill.style.width = ((bossHP / bossMaxHP) * 100) + '%';
    const pct = bossHP / bossMaxHP;
    bossHealthFill.style.background = `linear-gradient(90deg,hsl(${Math.round(pct*30)},100%,50%),hsl(${Math.round(pct*15)},100%,40%))`;
}

// ═══════════════════════════════════════════════════════════════
//  HIT PROCESSING
// ═══════════════════════════════════════════════════════════════
function processRavenHit(obj) {
    // Count the tap for the hit (miss taps counted separately in handleHit)
    totalTapsThisLevel++; totalTapsThisGame++;
    const mult = doublePointsUntil > Date.now() ? 2 : 1;

    if (obj.type === 'boss') {
        bossHP--;
        triggerShake(SHAKE_HIT_MS*2, SHAKE_HIT_AMT*2); triggerFlash('#ff6600', 0.2);
        SFX.bossHit();
        const pts = BOSS_POINTS_PER_HIT * mult;
        score += pts; if (score > highScore) setHighScore(score);
        addXP(20);
        floatingTexts.push(new FloatingText(obj.x+obj.width/2, obj.y, `-1 HP ⚡`, '#ff6600', 28));
        explosions.push(new Explosion(obj.x + obj.width*Math.random(), obj.y + obj.height*0.3, obj.width*0.6));
        if (bossHP > 0) { updateBossHealthBar(); return; }
        // Boss dead
        obj.markedForDeletion = true; currentBoss = null;
        bossHealthBarWrap.classList.add('hidden');
        const bonus = BOSS_POINTS_PER_HIT * 5 * mult;
        score += bonus; if (score > highScore) setHighScore(score);
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2-40, `BOSS SLAIN! +${bonus}`, '#ff4500', 36));
        triggerShake(SHAKE_BOSS_MS, SHAKE_BOSS_AMT); triggerFlash('#ff4500', 0.5);
        SFX.bossSlain();
        const bk = +(localStorage.getItem('ravenAttackBossesKilled')||0) + 1;
        localStorage.setItem('ravenAttackBossesKilled', bk);
        addXP(XP_PER_BOSS);
        for (let i=0;i<20;i++) particles.push(new Particle(obj.x+obj.width/2, obj.y+obj.height/2, obj.width, '#ff6600'));
        const now = Date.now();
        comboCount = (now - lastHitTime < diffComboTimeout) ? comboCount + 1 : 1;
        if (comboCount > maxComboThisGame) maxComboThisGame = comboCount;
        lastHitTime = now;
        ravensHitThisGame++; ravensHitThisLevel++;
        updateMissionUI(); checkAchievements(); updateXPBar();
        return;
    }

    obj.markedForDeletion = true;
    ravensHitThisGame++; ravensHitThisLevel++;
    const now = Date.now();
    comboCount = (now - lastHitTime < diffComboTimeout) ? comboCount + 1 : 1;
    if (comboCount > maxComboThisGame) maxComboThisGame = comboCount;
    lastHitTime = now;

    let pts = comboCount > 1 ? comboCount : 1;
    if (obj.type === 'golden') pts = Math.round(pts * GOLDEN_POINTS_MULT);
    else if (obj.type === 'giant') pts = Math.max(5, pts + 2);
    pts *= mult;
    score += pts; if (score > highScore) setHighScore(score);
    addXP(XP_PER_HIT + (comboCount > 4 ? 2 : 0));
    explosions.push(new Explosion(obj.x, obj.y, obj.width));
    floatingTexts.push(new FloatingText(obj.x+obj.width/2, obj.y, '+'+pts, obj.type==='golden'?'#ffd700':obj.type==='giant'?'#c8a060':'#fff'));
    triggerShake(SHAKE_HIT_MS, SHAKE_HIT_AMT);
    if (navigator.vibrate) navigator.vibrate(20);

    // Pitch-scaled hit sound: higher pitch with bigger combos
    const pitch = Math.min(2.0, 0.85 * (1 + comboCount * 0.07));
    SFX.hit(pitch);

    if (obj.type === 'blue') slowMoUntil = Date.now() + SLOWMO_DURATION_MS;
    if (Math.random() < diffExtraLife && obj.type !== 'red' && obj.type !== 'boss') {
        lives = Math.min(maxLives, lives + 1);
        floatingTexts.push(new FloatingText(obj.x+obj.width/2, obj.y-24, '+1 ❤️', '#ff4757'));
    }
    if (COMBO_FEEDBACK[comboCount]) {
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2-40, COMBO_FEEDBACK[comboCount], '#ffe600', 32));
        SFX.combo(comboCount);
    }
    checkAchievements(); updateMissionUI(); updateXPBar();
}

function handleHit(x, y) {
    if (gameOver || !gameStarted || gamePaused || levelCompleteActive) return;
    for (let i=powerups.length-1;i>=0;i--) {
        if (!powerups[i].markedForDeletion && powerups[i].isHit(x, y)) { collectPowerup(powerups[i]); return; }
    }
    let hit = false;
    for (let i=ravens.length-1;i>=0;i--) {
        const r = ravens[i];
        if (r.isGhost && r.ghostIsInvis) continue;
        if (!r.markedForDeletion && x>=r.x && x<r.x+r.width && y>=r.y && y<r.y+r.height) {
            processRavenHit(r); hit = true; return;
        }
    }
    // Missed tap — count as a tap but not a hit
    if (!hit) {
        totalTapsThisGame++; totalTapsThisLevel++;
        if (!currentBoss) comboCount = 0;
    }
}

// ── HUD ────────────────────────────────────────────────────────────────────────
function updateXPBar() {
    const rank = getRank(playerXP);
    const nextXP = getNextRankXP(playerXP);
    const prevXP = rank.minXP;
    rankDisplay.textContent = rank.name;
    if (nextXP) {
        const pct = ((playerXP - prevXP) / (nextXP - prevXP)) * 100;
        xpBarFill.style.width = pct + '%';
    } else {
        xpBarFill.style.width = '100%';
    }
}
function updateMissionUI() {
    if (!missionDisplay) return;
    if (isDailyChallenge) {
        if (missionTargetEl) missionTargetEl.textContent = `🎯 ${ravensHitThisGame} hit`;
        if (missionProgress) { missionProgress.style.width = '100%'; missionProgress.style.background = 'linear-gradient(90deg,#e03a20,#ff8c42)'; }
        return;
    }
    const tgt = getMissionTarget(level), cur = Math.min(ravensHitThisLevel, tgt), pct = (cur/tgt)*100;
    if (missionTargetEl) missionTargetEl.textContent = `🎯 ${cur}/${tgt}`;
    if (missionProgress) { missionProgress.style.width=pct+'%'; missionProgress.style.background=cur>=tgt?'linear-gradient(90deg,#7bed9f,#2ed573)':'linear-gradient(90deg,#ffd700,#ffaa00)'; }
}
function updateHUD() {
    scoreDisplay.textContent = isDailyChallenge ? '📅 ' + score : score;
    levelDisplay.textContent = isDailyChallenge ? `Daily` : `Lv.${level}/${MAX_LEVEL}`;
    comboDisplay.textContent = comboCount > 1 ? `x${comboCount}!` : '';
    livesDisplay.textContent = '❤️ ' + lives;
    if (progressBarFill) { const p=getMissionTarget(level); progressBarFill.style.width=(isDailyChallenge?'100%':(Math.min(1,ravensHitThisLevel/p)*100)+'%'); }
    const cr = comboCount>1 ? Math.max(0,1-(Date.now()-lastHitTime)/diffComboTimeout) : 0;
    if (comboDecayWrap && comboDecayFill) { if(cr>0){comboDecayWrap.classList.remove('hidden');comboDecayFill.style.width=(cr*100)+'%';}else comboDecayWrap.classList.add('hidden'); }
    soundBtn.textContent = soundMuted ? '🔇' : '🔊';
    soundBtn.classList.toggle('muted', soundMuted);
    updateMissionUI(); updateBossHealthBar(); updateXPBar(); renderPowerupInventory();
    if (dailyHudBadge) dailyHudBadge.classList.toggle('hidden', !isDailyChallenge);
    updateDailyTimerUI();
}

function drawStatusOverlays() {
    if (slowMoUntil > Date.now()) { ctx.save(); ctx.textAlign='center'; ctx.font='bold 16px Impact'; ctx.fillStyle='rgba(80,180,255,0.9)'; ctx.fillText('⏱ SLOW-MO', canvas.width/2, canvas.height-36); ctx.restore(); }
    if (freezeUntil > Date.now()) { ctx.save(); ctx.textAlign='center'; ctx.font='bold 16px Impact'; ctx.fillStyle='rgba(92,200,224,0.95)'; ctx.fillText(`❄️ FROZEN ${Math.ceil((freezeUntil-Date.now())/1000)}s`, canvas.width/2, canvas.height-18); ctx.restore(); }
    if (doublePointsUntil > Date.now()) { ctx.save(); ctx.textAlign='center'; ctx.font='bold 16px Impact'; ctx.fillStyle='rgba(255,215,0,0.95)'; ctx.fillText(`⭐ 2× ${Math.ceil((doublePointsUntil-Date.now())/1000)}s`, canvas.width-70, canvas.height-18); ctx.restore(); }
}
function drawGameOverCanvas() { ctx.save(); ctx.textAlign='center'; ctx.font=Math.max(24,canvas.width/20)+'px Impact'; ctx.fillStyle='black'; ctx.fillText('Game Over! Score: '+score,canvas.width/2,canvas.height/2-10); ctx.fillStyle='white'; ctx.fillText('Game Over! Score: '+score,canvas.width/2,canvas.height/2-5); ctx.restore(); }

function handleRavenEscaped(raven) {
    escapeTimestamps.push(Date.now());
    const lost = raven.type === 'red' ? 2 : 1;
    if (shieldActive) {
        shieldActive = false;
        SFX.shieldBlock();
        floatingTexts.push(new FloatingText(canvas.width/2, canvas.height/2, '🛡️ Shield Blocked!', '#e8a020', 28));
        renderPowerupInventory(); return;
    }
    SFX.escape();
    ravensEscaped += lost; lives = Math.max(0, lives - lost);
    triggerFlash('#ff0000', 0.25);
    if (lives <= 0) gameOver = true;
}

// ═══════════════════════════════════════════════════════════════
//  LEVEL COMPLETE
// ═══════════════════════════════════════════════════════════════
function showLevelComplete() {
    if (levelCompleteShown) return;
    levelCompleteShown = true;
    SFX.levelUp();
    const tgt = getMissionTarget(level);
    const acc = getAccuracy(ravensHitThisLevel, totalTapsThisLevel);
    const { grade, color } = getGrade(acc);
    const bests = getLevelBests();
    const prevBest = bests[level] || 0;
    saveLevelBest(level, score);
    levelCompleteNumberEl.textContent = level;
    levelCompleteScoreEl.textContent = score;
    levelCompleteRavensEl.textContent = `${ravensHitThisLevel}/${tgt}`;
    lcAccuracyEl.textContent = acc + '%';
    lcGradeEl.textContent = grade; lcGradeEl.style.color = color;
    lcBestEl.textContent = prevBest ? `Personal Best: ${prevBest}` : '';
    const keys = Object.keys(POWERUP_TYPES);
    const reward = keys[level % keys.length];
    if (level % 5 === 0 && powerupInventory.length < 2) {
        powerupInventory.push(reward);
        lcPowerupRewardEl.textContent = `🎁 Reward: ${POWERUP_TYPES[reward].emoji} ${POWERUP_TYPES[reward].label}!`;
        renderPowerupInventory();
    } else { lcPowerupRewardEl.textContent = ''; }
    addXP(XP_PER_LEVEL);
    levelCompleteScreen.classList.remove('hidden');
}

function goToNextLevel() {
    levelCompleteActive = false; levelCompleteShown = false;
    levelCompleteScreen.classList.add('hidden'); countdownOverlay.classList.add('hidden');
    if (level >= MAX_LEVEL) { triggerVictory(); return; }
    if (MILESTONES[level + 1]) { pendingMilestone = MILESTONES[level + 1]; showMilestone(); return; }
    advanceLevel();
}

function advanceLevel() {
    pendingMilestone = null; milestoneActive = false;
    milestoneScreen.classList.add('hidden');
    level++; checkAchievements();
    ravensHitThisLevel = 0; totalTapsThisLevel = 0;
    bossSpawnedThisLevel = false; currentBoss = null; bossHP = 0;
    bossHealthBarWrap.classList.add('hidden');
    levelUpFlashUntil = Date.now() + LEVEL_UP_FLASH_DUR;
    triggerShake(SHAKE_LVL_MS, SHAKE_LVL_AMT); triggerFlash('#ffd700', 0.3);
    SFX.levelUp(); setTheme();
    lives = maxLives; ravensEscaped = 0;
    const step = (level-1)*15; ravenInterval = Math.max(diffMinInterval, baseInterval - step);
    ravens=[]; explosions=[]; particles=[]; floatingTexts=[]; powerups=[];
    timeToNextRaven = 0; updateHUD();
}

function showMilestone() {
    milestoneActive = true;
    SFX.milestone();
    milestoneTitle.textContent = pendingMilestone.title;
    milestoneText.textContent  = pendingMilestone.text;
    milestoneScreen.classList.remove('hidden');
}

function startNextLevelCountdown() {
    levelCompleteScreen.classList.add('hidden'); countdownOverlay.classList.remove('hidden');
    const steps = ['3','2','1','GO!']; let i = 0;
    function show() {
        if (i < steps.length) {
            countdownText.textContent = steps[i];
            countdownText.style.animation = 'none'; countdownText.offsetHeight;
            countdownText.style.animation = 'countdownPop .35s ease';
            if (steps[i] === 'GO!') SFX.countdownGo(); else SFX.countdown();
            i++; setTimeout(show, 1000);
        } else { setTimeout(() => { countdownOverlay.classList.add('hidden'); goToNextLevel(); }, 500); }
    }
    show();
}

// ═══════════════════════════════════════════════════════════════
//  VICTORY
// ═══════════════════════════════════════════════════════════════
function triggerVictory() {
    gameWon = true; gameStarted = false;
    if (powerupBar) powerupBar.classList.add('hidden');
    _ravenSoundTimer = 0;
    SFX.victory();
    if (isDailyChallenge) markDailyDone(score);
    checkAchievements(); updateStatsOnGameEnd(); addToLeaderboard(score, level, isDailyChallenge);
    if (victoryScorel) victoryScorel.textContent = score;
    victoryScreen.classList.remove('hidden');
    for (let i=0;i<120;i++) { const c=`hsl(${Math.random()*360},100%,60%)`; const p=new Particle(canvas.width*Math.random(),canvas.height*Math.random(),80+Math.random()*120,c); p.speedX=(Math.random()-0.5)*3; p.radius=0; p.maxRadius=30+Math.random()*30; particles.push(p); }
    showToast('👑 RAVEN SLAYER!', 6000);
}

function goHome() {
    stopDailyTimer(); _ravenSoundTimer = 0;
    if (powerupBar) powerupBar.classList.add('hidden');
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    gameStarted=false; gameOver=false; gamePaused=false; gameWon=false; levelCompleteActive=false; milestoneActive=false; isDailyChallenge=false;
    [pauseOverlay,levelCompleteScreen,countdownOverlay,gameOverScreen,victoryScreen,bossHealthBarWrap,warningBanner,milestoneScreen]
        .forEach(el => el.classList.add('hidden'));
    ravens=[]; explosions=[]; particles=[]; floatingTexts=[]; powerups=[]; currentBoss=null; bossHP=0;
    applyDifficulty();
    highScore = getHighScore(); highScoreDisplay.textContent = highScore;
    syncDifficultyUI(); renderLeaderboard(leaderboardList); setTheme();
    updateDailyUI();
    // Keep music playing on home screen (reset speed to normal)
    _bgMusic.playbackRate = 1.0;
    startMusic();
    startScreen.classList.remove('hidden');
}

// ── Daily UI ────────────────────────────────────────────────────────────────────
function updateDailyUI() {
    if (hasDoneDaily()) {
        dailyChallengeBtn.textContent = '📅 Daily Done ✓';
        dailyChallengeBtn.disabled = true;
        dailyBadge.textContent = `Today's best: ${getDailyScore()}`;
        dailyBadge.classList.remove('hidden');
    } else {
        dailyChallengeBtn.textContent = '📅 Daily Challenge';
        dailyChallengeBtn.disabled = false;
        dailyBadge.classList.add('hidden');
    }
}

// ═══════════════════════════════════════════════════════════════
//  RESET / START / END
// ═══════════════════════════════════════════════════════════════
function resetGame() {
    applyDifficulty();
    ravens=[]; explosions=[]; particles=[]; floatingTexts=[]; powerups=[];
    score=0; level=1; levelUpFlashUntil=0; lives=maxLives; ravensEscaped=0;
    ravensHitThisLevel=0; ravensHitThisGame=0; totalTapsThisGame=0; totalTapsThisLevel=0;
    gameOver=false; gamePaused=false; gameWon=false;
    comboCount=0; maxComboThisGame=0; lastHitTime=0;
    timeToNextRaven=0; ravenInterval=baseInterval; lastTime=0;
    bossSpawnedThisLevel=false; currentBoss=null; bossHP=0; bossMaxHP=0;
    slowMoUntil=0; freezeUntil=0; doublePointsUntil=0; flashAlpha=0;
    shieldActive=false; powerupInventory=[]; powerupSpawnTimer=0; _ravenSoundTimer=0;
    levelCompleteActive=false; levelCompleteShown=false; milestoneActive=false;
    escapeTimestamps=[];
    [pauseOverlay,levelCompleteScreen,countdownOverlay,bossHealthBarWrap,warningBanner,milestoneScreen].forEach(el=>el.classList.add('hidden'));
    setTheme();
    highScore = getHighScore(); highScoreDisplay.textContent = highScore;
    renderPowerupInventory(); updateHUD();
}

function startGame() {
    startScreen.classList.add('hidden'); gameOverScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden'); levelCompleteScreen.classList.add('hidden');
    if (powerupBar) powerupBar.classList.remove('hidden');
    resetGame(); gameStarted = true;
    if (animationId) cancelAnimationFrame(animationId);
    // Unlock AudioContext on first gesture
    getAudioCtx();
    startMusic();
    if (isDailyChallenge) {
        dailyRng = makeSeededRng(getDailySeed());
        startDailyTimer();
        SFX.dailyStart();
        // Daily: fixed normal difficulty regardless of setting
        difficulty = 'normal'; applyDifficulty();
        // Daily: level stays 1 but speed is higher
        speedPerLevel = 0.16; // much harder speed scaling
        baseInterval = 350;   // faster spawns from the start
    }
    animate(performance.now());
}

function endGame() {
    stopDailyTimer();
    _ravenSoundTimer = 0;
    const acc = getAccuracy(ravensHitThisGame, totalTapsThisGame);
    const { grade, color } = getGrade(acc);
    if (isDailyChallenge) markDailyDone(score);
    addToLeaderboard(score, level, isDailyChallenge);
    addXP(Math.floor(ravensHitThisGame / 2));
    gameStarted=false; gameOver=true;
    finalScoreEl.textContent = score; finalLevelEl.textContent = level;
    finalHighScoreEl.textContent = highScore; finalRavensHitEl.textContent = ravensHitThisGame;
    finalAccuracyEl.textContent = acc + '%';
    finalGradeEl.textContent = grade; finalGradeEl.style.color = color;
    renderLeaderboard(gameOverLeaderboardList);
    gameOverScreen.classList.remove('hidden');
}

function getShakeOffset() {
    if (Date.now() >= shakeUntil) return {x:0,y:0};
    const d = (shakeUntil - Date.now()) / shakeDuration;
    return { x:(Math.random()-0.5)*2*shakeAmount*d, y:(Math.random()-0.5)*2*shakeAmount*d };
}

// ═══════════════════════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════════════════════
function animate(timestamp) {
    if (!gameStarted) return;
    const raw = lastTime === 0 ? 16 : timestamp - lastTime;
    const dt = Math.min(raw, 100); lastTime = timestamp;
    const eff = slowMoUntil > Date.now() ? dt * 0.25 : dt;

    drawBg();

    if (!levelCompleteActive && !gamePaused && !milestoneActive) {
        timeToNextRaven += eff; powerupSpawnTimer += dt;
        updateDifficulty();
        if (timeToNextRaven > ravenInterval) { spawnRaven(getLevelSpeedMult(level), level%diffBossInterval===0&&!bossSpawnedThisLevel); timeToNextRaven=0; }
        if (powerupSpawnTimer > POWERUP_SPAWN_INTERVAL) { spawnPowerup(); powerupSpawnTimer=0; }
    }
    tickRavenSound(dt);  // always called — self-silences on pause/gameover/levelComplete/milestone

    const shake = getShakeOffset();
    ctx.save(); ctx.translate(shake.x, shake.y);
    ctx.clearRect(-15,-15,canvas.width+30,canvas.height+30);
    if (flashAlpha > 0) { ctx.save(); ctx.globalAlpha=flashAlpha; ctx.fillStyle=flashColor; ctx.fillRect(-15,-15,canvas.width+30,canvas.height+30); ctx.restore(); flashAlpha=Math.max(0,flashAlpha-0.04); }

    updateHUD();
    if (!gamePaused && !levelCompleteActive && !milestoneActive) {
        particles.forEach(o=>o.update(eff)); ravens.forEach(o=>o.update(eff));
        explosions.forEach(o=>o.update(eff)); floatingTexts.forEach(o=>o.update(eff));
        powerups.forEach(o=>o.update(dt));
    }
    particles.forEach(o=>o.draw()); powerups.forEach(o=>o.draw());
    ravens.forEach(o=>o.draw()); explosions.forEach(o=>o.draw()); floatingTexts.forEach(o=>o.draw());
    ctx.restore();

    if (levelUpFlashUntil > Date.now()) {
        ctx.save(); ctx.textAlign='center'; ctx.globalAlpha=Math.min(1,(levelUpFlashUntil-Date.now())/400);
        ctx.font=Math.max(28,canvas.width/14)+'px Impact'; ctx.fillStyle='#ffd700'; ctx.strokeStyle='#000'; ctx.lineWidth=5;
        const msg=`LEVEL ${level}!`; ctx.strokeText(msg,canvas.width/2,canvas.height/2); ctx.fillText(msg,canvas.width/2,canvas.height/2);
        ctx.restore();
    }
    drawStatusOverlays();

    if (gamePaused) { pauseOverlay.classList.remove('hidden'); animationId=requestAnimationFrame(animate); return; }
    pauseOverlay.classList.add('hidden');
    if (milestoneActive) { animationId=requestAnimationFrame(animate); return; }
    if (levelCompleteActive) { showLevelComplete(); animationId=requestAnimationFrame(animate); return; }

    ravens.forEach(r => { if (r.escaped) handleRavenEscaped(r); });
    ravens=ravens.filter(r=>!r.markedForDeletion);
    explosions=explosions.filter(e=>!e.markedForDeletion);
    particles=particles.filter(p=>!p.markedForDeletion);
    floatingTexts=floatingTexts.filter(f=>!f.markedForDeletion);
    powerups=powerups.filter(p=>!p.markedForDeletion);
    if (particles.length > 500) particles.length = 450;

    if (gameOver) { drawGameOverCanvas(); endGame(); return; }
    animationId = requestAnimationFrame(animate);
}

// ── Input ──────────────────────────────────────────────────────────────────────
canvas.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    if (x>=0 && x<canvas.width && y>=0 && y<canvas.height) handleHit(x, y);
});
document.addEventListener('keydown', function(e) {
    if (e.code==='Space'||e.code==='Escape') {
        e.preventDefault();
        if (!gameStarted || gameOver) return;
        gamePaused = !gamePaused;
        if (gamePaused) _bgMusic.pause(); else startMusic();
    }
    if (e.code === 'Digit1' || e.code === 'Numpad1') useSlot(0);
    if (e.code === 'Digit2' || e.code === 'Numpad2') useSlot(1);
});

// ── Buttons ────────────────────────────────────────────────────────────────────
soundBtn.addEventListener('click', () => { setMutedAudio(!soundMuted); localStorage.setItem('ravenAttackMuted', soundMuted?'1':'0'); updateHUD(); });
if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
document.getElementById('musicBtnStart')?.addEventListener('click', toggleMusic);
pauseBtn.addEventListener('click', () => { if(!gameStarted||gameOver)return; gamePaused=!gamePaused; if(gamePaused) _bgMusic.pause(); else startMusic(); });
pauseHomeBtn.addEventListener('click', goHome);
lcHomeBtn.addEventListener('click', goHome);
gameOverHomeBtn.addEventListener('click', goHome);
nextLevelBtn.addEventListener('click', startNextLevelCountdown);
milestoneContinueBtn.addEventListener('click', () => { milestoneScreen.classList.add('hidden'); milestoneActive=false; advanceLevel(); });
startBtn.addEventListener('click', () => { isDailyChallenge=false; startGame(); });
restartBtn.addEventListener('click', () => { isDailyChallenge=false; startGame(); });
if (victoryRestartBtn) victoryRestartBtn.addEventListener('click', () => { isDailyChallenge=false; startGame(); });
document.getElementById('victoryHomeBtn')?.addEventListener('click', goHome);
dailyChallengeBtn.addEventListener('click', () => { isDailyChallenge=true; startGame(); });

statsBtn.addEventListener('click', function() {
    const s = getStats();
    document.getElementById('statGames').textContent = s.totalGames;
    document.getElementById('statBestLevel').textContent = s.bestLevel;
    document.getElementById('statBestCombo').textContent = s.bestCombo;
    document.getElementById('statRavensHit').textContent = s.totalRavensHit;
    document.getElementById('statBossesKilled').textContent = s.bossesKilled;
    document.getElementById('statXP').textContent = playerXP;
    document.getElementById('statRank').textContent = getRank(playerXP).name;
    statsPanel.classList.remove('hidden');
});
statsCloseBtn.addEventListener('click', () => statsPanel.classList.add('hidden'));

// ── Difficulty UI ──────────────────────────────────────────────────────────────
function syncDifficultyUI() { document.querySelectorAll('.difficulty-btn').forEach(b=>b.classList.toggle('active',b.dataset.difficulty===difficulty)); }
document.querySelectorAll('.difficulty-btn').forEach(b=>b.addEventListener('click',function(){difficulty=this.dataset.difficulty;localStorage.setItem('ravenAttackDifficulty',difficulty);syncDifficultyUI();}));

window.addEventListener('resize', resizeCanvases);
document.addEventListener('DOMContentLoaded', function() {
    difficulty = localStorage.getItem('ravenAttackDifficulty') || 'normal';
    syncDifficultyUI(); resizeCanvases();
    highScore = getHighScore(); highScoreDisplay.textContent = highScore;
    applyDifficulty(); updateHUD(); renderLeaderboard(leaderboardList); setTheme(); updateDailyUI();
    playerXP = parseInt(localStorage.getItem('ravenAttackXP')||'0',10); updateXPBar();
    applyMusicMute();
    // Start home screen music on first user interaction (autoplay policy)
    const startMusicOnce = () => {
        startMusic();
        document.removeEventListener('pointerdown', startMusicOnce);
        document.removeEventListener('keydown', startMusicOnce);
    };
    document.addEventListener('pointerdown', startMusicOnce);
    document.addEventListener('keydown', startMusicOnce);
});