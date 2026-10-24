/**
 * ChessHub - Grandmaster Interactive Suite Scripts
 */

// Web Audio API for Acoustic Piece Movement & Clock Sounds (Local device isolation)
let audioCtx = null;
let isAudioMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Crisp wooden piece move sound
function playPieceSound(type = 'move') {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'capture') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'check') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      // Gentle wooden tap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    }
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile menu
  const mobileBtn = document.getElementById('chessMobileBtn');
  const mobileMenu = document.getElementById('chessMobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Initialize Dual Chess Clock (Pass & Play)
  initChessClock();

  // Initialize 3D Persona Selector
  initPersonaSelector();

  // Initialize Interactive Board
  initChessBoard();

  // FAQ Accordion
  initFaqAccordion();
});

// --- DUAL CHESS CLOCK ENGINE (Pass & Play) ---
let clockInterval = null;
let activeSide = null; // 'white' or 'black'
let whiteTime = 300; // default 5m
let blackTime = 300;
let initialTime = 300;
let moveCount = 0;
let isClockRunning = false;

function formatClockTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateClockDisplays() {
  const wElem = document.getElementById('whiteClockDisplay');
  const bElem = document.getElementById('blackClockDisplay');
  const mElem = document.getElementById('clockMoveCount');
  
  if (wElem) wElem.textContent = formatClockTime(whiteTime);
  if (bElem) bElem.textContent = formatClockTime(blackTime);
  if (mElem) mElem.textContent = `Moves: ${moveCount}`;
}

function initChessClock() {
  updateClockDisplays();

  const whiteBtn = document.getElementById('whiteClockBtn');
  const blackBtn = document.getElementById('blackClockBtn');
  const togglePlayBtn = document.getElementById('clockTogglePlay');
  const resetBtn = document.getElementById('clockResetBtn');
  const muteBtn = document.getElementById('clockMuteBtn');

  // Time preset buttons (1m, 3m, 5m, 10m)
  document.querySelectorAll('.time-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-preset-btn').forEach(b => b.classList.remove('bg-amber-500', 'text-slate-950', 'font-black'));
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-black');
      
      const mins = parseInt(btn.getAttribute('data-min'), 10);
      initialTime = mins * 60;
      whiteTime = initialTime;
      blackTime = initialTime;
      moveCount = 0;
      stopClock();
      activeSide = null;
      if (whiteBtn) whiteBtn.classList.remove('clock-btn-active');
      if (blackBtn) blackBtn.classList.remove('clock-btn-active');
      updateClockDisplays();
    });
  });

  // White clock hit
  if (whiteBtn) {
    whiteBtn.addEventListener('click', () => {
      if (activeSide === 'black' && isClockRunning) return; // not white's turn
      playPieceSound('move');
      moveCount++;
      activeSide = 'black';
      startClock();
      whiteBtn.classList.remove('clock-btn-active');
      if (blackBtn) blackBtn.classList.add('clock-btn-active');
    });
  }

  // Black clock hit
  if (blackBtn) {
    blackBtn.addEventListener('click', () => {
      if (activeSide === 'white' && isClockRunning) return; // not black's turn
      playPieceSound('move');
      moveCount++;
      activeSide = 'white';
      startClock();
      blackBtn.classList.remove('clock-btn-active');
      if (whiteBtn) whiteBtn.classList.add('clock-btn-active');
    });
  }

  // Pause / Play toggle
  if (togglePlayBtn) {
    togglePlayBtn.addEventListener('click', () => {
      if (isClockRunning) {
        stopClock();
      } else {
        if (!activeSide) activeSide = 'white';
        startClock();
      }
    });
  }

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stopClock();
      whiteTime = initialTime;
      blackTime = initialTime;
      moveCount = 0;
      activeSide = null;
      if (whiteBtn) whiteBtn.classList.remove('clock-btn-active');
      if (blackBtn) blackBtn.classList.remove('clock-btn-active');
      updateClockDisplays();
    });
  }

  // Mute toggle (Section 1.3: local device audio isolation)
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      muteBtn.innerHTML = isAudioMuted 
        ? `<i data-lucide="volume-x" class="w-4 h-4 text-rose-400"></i><span>Muted (Local)</span>`
        : `<i data-lucide="volume-2" class="w-4 h-4 text-emerald-400"></i><span>Sound On</span>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

function startClock() {
  if (isClockRunning) return;
  isClockRunning = true;
  const toggleBtn = document.getElementById('clockTogglePlay');
  if (toggleBtn) {
    toggleBtn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i><span>Pause</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  clockInterval = setInterval(() => {
    if (activeSide === 'white') {
      whiteTime = Math.max(0, whiteTime - 1);
      if (whiteTime === 0) {
        stopClock();
        playPieceSound('check');
        alert("Time Out! Black wins on time (FIDE clock expiration).");
      }
    } else if (activeSide === 'black') {
      blackTime = Math.max(0, blackTime - 1);
      if (blackTime === 0) {
        stopClock();
        playPieceSound('check');
        alert("Time Out! White wins on time (FIDE clock expiration).");
      }
    }
    updateClockDisplays();
  }, 1000);
}

function stopClock() {
  clearInterval(clockInterval);
  isClockRunning = false;
  const toggleBtn = document.getElementById('clockTogglePlay');
  if (toggleBtn) {
    toggleBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i><span>Resume</span>`;
    if (window.lucide) window.lucide.createIcons();
  }
}

// --- 7 DISTINCTIVE 3D ANIMATED PERSONAS DATA & ENGINE ---
const personasData = [
  {
    id: 'grandmaster',
    name: 'The Grandmaster',
    title: 'Absolute Balance & Universal Mastery',
    style: 'Universal • FIDE Master',
    quote: '"Every move is governed by relentless calculation and timeless patience."',
    badge: 'Legendary',
    avatar: '👑',
    stats: { attack: 96, defense: 98, speed: 92, endgame: 99 }
  },
  {
    id: 'tactical-queen',
    name: 'Tactical Queen',
    title: 'Fierce Attacking & Geometric Pins',
    style: 'Sharp Tactics • King Hunter',
    quote: '"One positional inaccuracy is all I need to dismantle your entire king safety."',
    badge: 'Grandmaster',
    avatar: '👸',
    stats: { attack: 99, defense: 84, speed: 91, endgame: 93 }
  },
  {
    id: 'blitz-sovereign',
    name: 'Blitz Sovereign',
    title: 'Lightning Time Pressure & Chaos',
    style: 'Speed Demon • Flagging Specialist',
    quote: '"While you calculate two moves, I have already solved the next ten."',
    badge: 'Blitz King',
    avatar: '⚡',
    stats: { attack: 94, defense: 80, speed: 100, endgame: 89 }
  },
  {
    id: 'classical-maestro',
    name: 'Classical Maestro',
    title: 'Pure Positional Harmony & Endgames',
    style: 'Prophylaxis • Karpov-Style',
    quote: '"Control the center, constrict their pieces, and the win arrives naturally."',
    badge: 'Master Theorist',
    avatar: '🎼',
    stats: { attack: 85, defense: 99, speed: 82, endgame: 98 }
  },
  {
    id: 'cyber-neo',
    name: 'Cyber Neo',
    title: 'Hypermodern AI Openings & Angles',
    style: 'Silicon Precision • Deep Theory',
    quote: '"Novelty identified on move 14. Your defense is mathematically evaluated as -2.4."',
    badge: 'Futurist',
    avatar: '🤖',
    stats: { attack: 93, defense: 94, speed: 95, endgame: 92 }
  },
  {
    id: 'prodigy-ace',
    name: 'Prodigy Ace',
    title: 'Fearless Sacrifices & Creative Magic',
    style: 'Romantic Era • Tal-Style',
    quote: '"Take my queen! You will see the checkmate three moves later."',
    badge: 'Prodigy',
    avatar: '🎯',
    stats: { attack: 98, defense: 82, speed: 90, endgame: 88 }
  },
  {
    id: 'speed-falcon',
    name: 'Speed Falcon',
    title: '1-Minute Bullet Flagging & Intuition',
    style: 'Bullet Virtuoso • Pre-move Elite',
    quote: '"Sixty seconds is a lifetime when you play with pure instinct."',
    badge: 'Bullet Elite',
    avatar: '🦅',
    stats: { attack: 91, defense: 78, speed: 99, endgame: 86 }
  }
];

function initPersonaSelector() {
  const container = document.getElementById('personaTabsContainer');
  const card = document.getElementById('personaDetailCard');
  if (!container || !card) return;

  function renderPersona(persona) {
    card.innerHTML = `
      <div class="flex flex-col lg:flex-row items-center gap-8 text-left">
        <div class="relative shrink-0 flex items-center justify-center">
          <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-transparent border-2 border-amber-400/40 flex items-center justify-center text-7xl sm:text-8xl shadow-2xl gold-glow relative overflow-hidden">
            <span class="transform transition hover:scale-110 duration-300 cursor-pointer">${persona.avatar}</span>
          </div>
          <span class="absolute -bottom-3 bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
            ${persona.badge}
          </span>
        </div>

        <div class="flex-1 space-y-4">
          <div>
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="luxury-heading text-2xl sm:text-3xl font-extrabold text-white">${persona.name}</h3>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-medium">
                ${persona.style}
              </span>
            </div>
            <p class="text-sm text-slate-400 font-medium mt-1">${persona.title}</p>
          </div>

          <blockquote class="text-sm italic text-amber-200/90 border-l-2 border-amber-400 pl-3">
            ${persona.quote}
          </blockquote>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Attack</span>
              <span class="text-lg font-black text-amber-400">${persona.stats.attack}%</span>
            </div>
            <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Defense</span>
              <span class="text-lg font-black text-sky-400">${persona.stats.defense}%</span>
            </div>
            <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Speed</span>
              <span class="text-lg font-black text-emerald-400">${persona.stats.speed}%</span>
            </div>
            <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Endgame</span>
              <span class="text-lg font-black text-purple-400">${persona.stats.endgame}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Populate Tab Pills
  container.innerHTML = '';
  personasData.forEach((p, index) => {
    const btn = document.createElement('button');
    btn.className = `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
      index === 0 
        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
        : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
    }`;
    btn.innerHTML = `<span>${p.avatar}</span><span>${p.name}</span>`;
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => {
        b.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800';
      });
      btn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20';
      renderPersona(p);
    });
    container.appendChild(btn);
  });

  renderPersona(personasData[0]);
}

// --- INTERACTIVE CHESSBOARD DEMO ---
function initChessBoard() {
  const boardElem = document.getElementById('interactiveChessboard');
  if (!boardElem) return;

  // Initial standard starting position setup
  const startingGrid = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
  ];

  let selectedSq = null;

  boardElem.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      const isLight = (r + c) % 2 === 0;
      sq.className = `chess-sq ${isLight ? 'light' : 'dark'}`;
      sq.dataset.row = r;
      sq.dataset.col = c;
      sq.textContent = startingGrid[r][c];

      sq.addEventListener('click', () => {
        if (!selectedSq) {
          if (sq.textContent !== '') {
            selectedSq = sq;
            sq.classList.add('selected');
            playPieceSound('move');
          }
        } else {
          if (selectedSq === sq) {
            sq.classList.remove('selected');
            selectedSq = null;
          } else {
            const isCapture = sq.textContent !== '';
            sq.textContent = selectedSq.textContent;
            selectedSq.textContent = '';
            selectedSq.classList.remove('selected');
            selectedSq = null;
            playPieceSound(isCapture ? 'capture' : 'move');

            const fenElem = document.getElementById('activeBoardFen');
            if (fenElem) {
              fenElem.textContent = `Active FEN: Live Sync with Firestore 'game_rooms'`;
            }
          }
        }
      });

      boardElem.appendChild(sq);
    }
  }

  // Reset board demo button
  const resetBtn = document.getElementById('resetBoardDemoBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initChessBoard();
      playPieceSound('check');
    });
  }
}

// --- FAQ ACCORDION ---
function initFaqAccordion() {
  const toggles = document.querySelectorAll('.chess-faq-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      document.querySelectorAll('.chess-faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.chess-faq-toggle .faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
