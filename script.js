// Web Audio API Synthesizer (No external dependencies needed)
let audioCtx = null;

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

// Crisp, gentle click/pop sound
function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.12); // B5
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (e) {}
}

// Romantic harp chime when heart is tapped
function playHeartChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Romantic Arpeggio: F4, A4, C5, E5, G5, C6
    const notes = [349.23, 440.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.55);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.55);
    });
  } catch (e) {}
}

// Celebration chime for "I Forgive You!"
function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.8);
    });
  } catch (e) {}
}

// Ambient Romantic Music Box
let isMusicPlaying = false;
let musicInterval = null;
const melodyNotes = [
  523.25, 587.33, 659.25, 783.99, 880.00,
  1046.50, 880.00, 783.99, 659.25, 587.33,
  523.25, 659.25, 783.99, 1046.50, 1174.66, 1318.51
];
let noteStep = 0;

function toggleMusic() {
  const btn = document.getElementById('musicToggleBtn');
  const icon = document.getElementById('musicIcon');
  const label = document.getElementById('musicLabel');
  const eq = document.getElementById('musicEq');
  
  if (isMusicPlaying) {
    clearInterval(musicInterval);
    isMusicPlaying = false;
    if (icon) icon.textContent = '🎵';
    if (label) label.textContent = 'Play Music';
    if (eq) eq.classList.add('hidden');
    if (btn) btn.classList.remove('border-rose-400', 'bg-rose-500/25');
  } else {
    getAudioContext();
    isMusicPlaying = true;
    if (icon) icon.textContent = '🎶';
    if (label) label.textContent = 'Music Playing';
    if (eq) eq.classList.remove('hidden');
    if (btn) btn.classList.add('border-rose-400', 'bg-rose-500/25');
    
    musicInterval = setInterval(() => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(melodyNotes[noteStep % melodyNotes.length], ctx.currentTime);
        
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
        noteStep++;
      } catch (e) {}
    }, 420);
  }
}

// Background Twinkling Starlight
function createStars() {
  const container = document.getElementById('starsContainer');
  if (!container) return;
  
  const starCount = 90;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.8 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2.5}s`);
    star.style.setProperty('--delay', `${Math.random() * 3.5}s`);
    container.appendChild(star);
  }
}

// Screen Tap Ripple Mini Hearts
document.addEventListener('click', (e) => {
  // Ignore clicks on buttons/inputs/modal
  if (e.target.closest('button') || e.target.closest('#photoModal') || e.target.closest('.floating-balloon') || e.target.closest('.floating-heart')) {
    return;
  }
  
  const hearts = ['❤️', '💖', '💕', '✨', '🌸', '🌹'];
  const char = hearts[Math.floor(Math.random() * hearts.length)];
  const p = document.createElement('div');
  p.className = 'tap-heart-particle';
  p.textContent = char;
  p.style.left = `${e.clientX}px`;
  p.style.top = `${e.clientY}px`;
  p.style.setProperty('--size', `${Math.random() * 12 + 18}px`);
  p.style.setProperty('--dx', `${Math.random() * 60 - 30}px`);
  p.style.setProperty('--dy', `${Math.random() * 60 + 60}px`);
  p.style.setProperty('--rot', `${Math.random() * 60 - 30}deg`);
  
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1200);
});

// Balloon Palettes & Messages
const balloonPalettes = [
  { light: '#ff85a2', dark: '#e11d48', shadow: 'rgba(225, 29, 72, 0.5)' },  // Rose
  { light: '#f472b6', dark: '#db2777', shadow: 'rgba(219, 39, 119, 0.5)' }, // Pink Velvet
  { light: '#fb7185', dark: '#be123c', shadow: 'rgba(244, 63, 94, 0.5)' },  // Ruby
  { light: '#c084fc', dark: '#9333ea', shadow: 'rgba(147, 51, 234, 0.5)' }, // Lavender Silk
  { light: '#fca5a5', dark: '#ef4444', shadow: 'rgba(239, 68, 68, 0.5)' },  // Crimson
  { light: '#fde047', dark: '#ea580c', shadow: 'rgba(234, 88, 12, 0.5)' },  // Champagne Gold
  { light: '#fbcfe8', dark: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.5)' },  // Pastel Rose
];

const balloonMessages = [
  "I'm So Sorry Paa 🥺",
  "Love You Pondati ❤️",
  "Please Forgive Me 🙏",
  "You Are My World 🌍",
  "Happy Birthday Love 🎂",
  "Love You Forever 💕",
  "My Heart Is Yours 💓",
  "My Cutie Pondati 🌸",
  "Forever & Always 🌹",
  "I'm Really Sorry 🥺",
  "You Mean Everything ✨",
  "Love You Beyond Words 💖",
  "My Queen 👑",
  "Can't Stay Without You 🥺",
  "Always Yours 💍"
];

let totalBalloonsReleased = 0;

function updateBalloonCounter() {
  const wrapper = document.getElementById('balloonCounterWrapper');
  const text = document.getElementById('balloonCounterText');
  if (wrapper && text) {
    wrapper.classList.remove('hidden');
    text.textContent = `${totalBalloonsReleased} Floating with Love`;
  }
}

// Spawn a 3D Floating Balloon
function spawnBalloon() {
  const container = document.getElementById('floatContainer');
  if (!container) return;
  
  const balloon = document.createElement('div');
  const isHeartShape = Math.random() > 0.6;
  balloon.className = `floating-balloon ${isHeartShape ? 'heart-shape' : ''}`;
  
  const palette = balloonPalettes[Math.floor(Math.random() * balloonPalettes.length)];
  const msg = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
  
  const width = Math.floor(Math.random() * 20 + 72); // 72px - 92px
  const height = isHeartShape ? width : Math.floor(width * 1.25);
  const leftPos = Math.random() * 88 + 4; // 4% to 92%
  const speed = Math.random() * 5 + 9.5; // 9.5s - 14.5s
  const swaySpeed = Math.random() * 1.8 + 3.2;
  const swayAmp = Math.floor(Math.random() * 26 + 18);
  
  balloon.style.left = `${leftPos}%`;
  balloon.style.setProperty('--b-width', `${width}px`);
  balloon.style.setProperty('--b-height', `${height}px`);
  balloon.style.setProperty('--b-light', palette.light);
  balloon.style.setProperty('--b-dark', palette.dark);
  balloon.style.setProperty('--b-shadow', palette.shadow);
  balloon.style.setProperty('--speed', `${speed}s`);
  balloon.style.setProperty('--sway-speed', `${swaySpeed}s`);
  balloon.style.setProperty('--sway-amp', `${swayAmp}px`);
  
  if (isHeartShape) {
    balloon.innerHTML = `
      <div class="balloon-body">
        <svg class="heart-balloon-svg" viewBox="0 0 24 24">
          <path fill="${palette.dark}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span class="balloon-tag">${msg}</span>
      </div>
      <div class="balloon-knot"></div>
      <div class="balloon-string"></div>
    `;
  } else {
    balloon.innerHTML = `
      <div class="balloon-body">
        <span class="balloon-tag">${msg}</span>
      </div>
      <div class="balloon-knot"></div>
      <div class="balloon-string"></div>
    `;
  }
  
  // Popping balloon
  balloon.addEventListener('click', (e) => {
    e.stopPropagation();
    popElement(balloon, e.clientX, e.clientY);
  });
  
  container.appendChild(balloon);
  totalBalloonsReleased++;
  updateBalloonCounter();
  
  setTimeout(() => {
    if (balloon.parentNode) {
      balloon.parentNode.removeChild(balloon);
    }
  }, speed * 1000);
}

// Spawn a Floating Heart (Clicking opens image)
function spawnHeart(isSpecial = false) {
  const container = document.getElementById('floatContainer');
  if (!container) return;
  
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  
  const size = isSpecial ? 76 : Math.floor(Math.random() * 26 + 48); // 48px - 74px
  const leftPos = isSpecial ? (Math.random() * 60 + 20) : (Math.random() * 88 + 5);
  const speed = isSpecial ? (Math.random() * 3 + 9) : (Math.random() * 4 + 8.5);
  const swaySpeed = Math.random() * 1.5 + 2.8;
  const swayAmp = Math.floor(Math.random() * 30 + 20);
  
  heart.style.left = `${leftPos}%`;
  heart.style.setProperty('--heart-size', `${size}px`);
  heart.style.setProperty('--speed', `${speed}s`);
  heart.style.setProperty('--sway-speed', `${swaySpeed}s`);
  heart.style.setProperty('--sway-amp', `${swayAmp}px`);
  
  heart.innerHTML = `
    <svg class="heart-svg" viewBox="0 0 24 24" fill="url(#heartGradient)">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <span class="heart-badge">${isSpecial ? '💖 Special Gift' : 'Tap Me ❤️'}</span>
  `;
  
  // Clicking the heart opens the surprise photo!
  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    popElement(heart, e.clientX, e.clientY);
    playHeartChime();
    openPhotoModal();
  });
  
  container.appendChild(heart);
  totalBalloonsReleased++;
  updateBalloonCounter();
  
  setTimeout(() => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  }, speed * 1000);
}

// Particle pop explosion
function popElement(elem, x, y) {
  playClickSound();
  
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#ffffff', '#fbbf24', '#a855f7'];
  const particles = 20;
  
  for (let i = 0; i < particles; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const size = Math.random() * 9 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 / particles) * i + (Math.random() * 0.4 - 0.2);
    const dist = Math.random() * 80 + 45;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.backgroundColor = color;
    p.style.left = `${x || window.innerWidth / 2}px`;
    p.style.top = `${y || window.innerHeight / 2}px`;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--time', `${Math.random() * 0.3 + 0.65}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
  
  elem.style.transform = 'scale(0)';
  elem.style.opacity = '0';
  elem.style.transition = 'all 0.2s ease-out';
  setTimeout(() => elem.remove(), 250);
}

// Flow Engine
let flowInterval = null;

function startFlow() {
  playClickSound();
  
  // Instant multi-wave burst
  for (let i = 0; i < 5; i++) {
    setTimeout(spawnBalloon, i * 140);
  }
  for (let i = 0; i < 4; i++) {
    setTimeout(() => spawnHeart(i === 0), i * 160 + 80);
  }
  
  const clickBtn = document.getElementById('clickMeBtn');
  const hintText = document.getElementById('hintText');
  
  if (clickBtn) {
    clickBtn.innerHTML = `
      <span class="text-2xl sm:text-3xl animate-bounce">🎈</span>
      <span class="tracking-wide">Release More Love!</span>
      <span class="text-2xl sm:text-3xl animate-bounce">💖</span>
    `;
  }
  
  if (hintText) {
    hintText.innerHTML = `
      ✨ <strong class="text-rose-300 font-extrabold text-sm sm:text-base">Touch ANY rising heart</strong> to open your surprise! ✨
    `;
    hintText.className = 'text-sm sm:text-base text-rose-200 font-bold animate-pulse';
  }
  
  if (!flowInterval) {
    flowInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        spawnBalloon();
      } else {
        spawnHeart(Math.random() > 0.8);
      }
    }, 420);
  }
}

// Open Photo Modal
function openPhotoModal() {
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  launchModalConfetti();
}

// Close Photo Modal
function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  
  modal.classList.remove('active');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 450);
}

// Modal Confetti Celebration
function launchModalConfetti() {
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#ffd166', '#06d6a0', '#a855f7', '#ffffff'];
  const count = 60;
  
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const isCircle = Math.random() > 0.45;
    const width = Math.random() * 11 + 6;
    const height = isCircle ? width : (Math.random() * 14 + 6);
    
    p.style.width = `${width}px`;
    p.style.height = `${height}px`;
    p.style.borderRadius = isCircle ? '50%' : '2px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${window.innerWidth / 2}px`;
    p.style.top = `${window.innerHeight / 2}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (Math.min(window.innerWidth, window.innerHeight) * 0.48) + 70;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--time', `${Math.random() * 0.5 + 0.85}s`);
    p.style.setProperty('--rot', `${Math.random() * 1080 - 540}deg`);
    
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1350);
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  
  // Set up SVG Heart Gradient Definition
  const svgDef = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDef.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none;');
  svgDef.innerHTML = `
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff6b8b"/>
        <stop offset="45%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#be123c"/>
      </linearGradient>
    </defs>
  `;
  document.body.appendChild(svgDef);
  
  // Grand Click Me Button
  const clickBtn = document.getElementById('clickMeBtn');
  if (clickBtn) {
    clickBtn.addEventListener('click', startFlow);
  }
  
  // Center 3D Heart Crystal Trigger
  const centerHeart = document.getElementById('centerHeartBtn');
  if (centerHeart) {
    centerHeart.addEventListener('click', (e) => {
      popElement(centerHeart, e.clientX, e.clientY);
      playHeartChime();
      openPhotoModal();
    });
  }
  
  // Close Modal
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePhotoModal);
  }
  
  const modal = document.getElementById('photoModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closePhotoModal();
      }
    });
  }
  
  // Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoModal();
    }
  });
  
  // Music Toggle
  const musicBtn = document.getElementById('musicToggleBtn');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }
  
  // Modal Release More Balloons
  const modalFlowBtn = document.getElementById('modalFlowBtn');
  if (modalFlowBtn) {
    modalFlowBtn.addEventListener('click', () => {
      closePhotoModal();
      startFlow();
      for (let i = 0; i < 8; i++) {
        setTimeout(spawnBalloon, i * 100);
      }
    });
  }
  
  // "I Forgive You!" Celebration Handler
  const forgiveBtn = document.getElementById('forgiveBtn');
  const forgiveCelebration = document.getElementById('forgiveCelebration');
  if (forgiveBtn) {
    forgiveBtn.addEventListener('click', () => {
      playCelebrationSound();
      launchModalConfetti();
      launchModalConfetti();
      
      forgiveBtn.classList.add('hidden');
      if (forgiveCelebration) {
        forgiveCelebration.classList.remove('hidden');
      }
      
      // Also release a stream of balloons in background
      startFlow();
      for (let i = 0; i < 10; i++) {
        setTimeout(spawnBalloon, i * 120);
        setTimeout(() => spawnHeart(true), i * 150 + 50);
      }
    });
  }
});
