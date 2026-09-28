// Sound Synthesis using Web Audio API (No external sound files required)
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

// Play sweet click sound
function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

// Play romantic harp chime when heart is tapped
function playHeartChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.45);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.45);
    });
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

// Optional Ambient Music (Sweet Pentatonic Music Box)
let isMusicPlaying = false;
let musicInterval = null;
const melodyNotes = [
  523.25, 587.33, 659.25, 783.99, 880.00,
  1046.50, 880.00, 783.99, 659.25, 587.33
];
let noteStep = 0;

function toggleMusic() {
  const btn = document.getElementById('musicToggleBtn');
  const icon = document.getElementById('musicIcon');
  const label = document.getElementById('musicLabel');
  
  if (isMusicPlaying) {
    clearInterval(musicInterval);
    isMusicPlaying = false;
    if (icon) icon.textContent = '🔇';
    if (label) label.textContent = 'Play Music';
    if (btn) btn.classList.remove('bg-rose-500/30', 'border-rose-400');
  } else {
    getAudioContext();
    isMusicPlaying = true;
    if (icon) icon.textContent = '🎵';
    if (label) label.textContent = 'Music On';
    if (btn) btn.classList.add('bg-rose-500/30', 'border-rose-400');
    
    musicInterval = setInterval(() => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(melodyNotes[noteStep % melodyNotes.length], ctx.currentTime);
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
        noteStep++;
      } catch (e) {}
    }, 450);
  }
}

// Populate background twinkling stars
function createStars() {
  const container = document.getElementById('starsContainer');
  if (!container) return;
  
  const starCount = 80;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    star.style.setProperty('--delay', `${Math.random() * 3}s`);
    container.appendChild(star);
  }
}

// Balloon Color Palettes
const balloonPalettes = [
  { light: '#ff94b4', dark: '#e11d48', shadow: 'rgba(225, 29, 72, 0.45)' }, // Rose
  { light: '#f472b6', dark: '#db2777', shadow: 'rgba(219, 39, 119, 0.45)' }, // Pink
  { light: '#fb7185', dark: '#e11d48', shadow: 'rgba(244, 63, 94, 0.45)' },  // Coral
  { light: '#c084fc', dark: '#9333ea', shadow: 'rgba(147, 51, 234, 0.45)' }, // Purple
  { light: '#fca5a5', dark: '#ef4444', shadow: 'rgba(239, 68, 68, 0.45)' },  // Crimson
  { light: '#fbcfe8', dark: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.45)' },  // Soft Rose
  { light: '#fde047', dark: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.45)' }, // Golden
];

// Balloon Messages
const balloonMessages = [
  "I'm Sorry 🥺",
  "Love You Pondati ❤️",
  "Sorry Paa 🌸",
  "Love You Forever 💕",
  "Please Forgive Me 🙏",
  "Love You So Much 💖",
  "My Everything ✨",
  "Happy Birthday 🎂",
  "I'm Really Sorry 🥺",
  "Forever & Always 🌹",
  "You Complete Me 💫",
  "I Love You ❤️",
  "My Favorite Person 🌸",
  "Always Yours 💕"
];

// Spawn a Floating Balloon
function spawnBalloon() {
  const container = document.getElementById('floatContainer');
  if (!container) return;
  
  const balloon = document.createElement('div');
  balloon.className = 'floating-balloon';
  
  const palette = balloonPalettes[Math.floor(Math.random() * balloonPalettes.length)];
  const msg = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
  
  const width = Math.floor(Math.random() * 20 + 68); // 68px - 88px
  const height = Math.floor(width * 1.25);
  const leftPos = Math.random() * 88 + 4; // 4% to 92%
  const speed = Math.random() * 5 + 9; // 9s - 14s
  const swaySpeed = Math.random() * 2 + 3; // 3s - 5s
  const swayAmp = Math.floor(Math.random() * 30 + 15); // 15px - 45px
  
  balloon.style.left = `${leftPos}%`;
  balloon.style.setProperty('--balloon-width', `${width}px`);
  balloon.style.setProperty('--balloon-height', `${height}px`);
  balloon.style.setProperty('--b-light', palette.light);
  balloon.style.setProperty('--b-dark', palette.dark);
  balloon.style.setProperty('--b-shadow', palette.shadow);
  balloon.style.setProperty('--speed', `${speed}s`);
  balloon.style.setProperty('--sway-speed', `${swaySpeed}s`);
  balloon.style.setProperty('--sway-amp', `${swayAmp}px`);
  
  balloon.innerHTML = `
    <div class="balloon-body">
      <span class="balloon-tag">${msg}</span>
    </div>
    <div class="balloon-knot"></div>
    <div class="balloon-string"></div>
  `;
  
  // Clicking a balloon pops it with cute sound and particles
  balloon.addEventListener('click', (e) => {
    e.stopPropagation();
    popElement(balloon, e.clientX, e.clientY);
  });
  
  container.appendChild(balloon);
  
  // Cleanup after floating out
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
  
  const size = isSpecial ? 72 : Math.floor(Math.random() * 28 + 42); // 42px - 70px
  const leftPos = isSpecial ? (Math.random() * 60 + 20) : (Math.random() * 88 + 6);
  const speed = isSpecial ? (Math.random() * 3 + 10) : (Math.random() * 5 + 8);
  const swaySpeed = Math.random() * 1.5 + 2.5;
  const swayAmp = Math.floor(Math.random() * 35 + 20);
  
  heart.style.left = `${leftPos}%`;
  heart.style.setProperty('--heart-size', `${size}px`);
  heart.style.setProperty('--speed', `${speed}s`);
  heart.style.setProperty('--sway-speed', `${swaySpeed}s`);
  heart.style.setProperty('--sway-amp', `${swayAmp}px`);
  
  // Heart SVG with romantic gradient
  heart.innerHTML = `
    <svg class="heart-svg" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <span class="heart-label">${isSpecial ? '💖 Open Me!' : 'Click Me ❤️'}</span>
  `;
  
  // Clicking the heart opens the surprise photo!
  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    popElement(heart, e.clientX, e.clientY);
    playHeartChime();
    openPhotoModal();
  });
  
  container.appendChild(heart);
  
  setTimeout(() => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  }, speed * 1000);
}

// Particle pop explosion effect
function popElement(elem, x, y) {
  playClickSound();
  
  // Create particle burst
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#ffffff', '#fbbf24'];
  const particles = 18;
  
  for (let i = 0; i < particles; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const size = Math.random() * 8 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 / particles) * i + (Math.random() * 0.4 - 0.2);
    const dist = Math.random() * 70 + 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.backgroundColor = color;
    p.style.left = `${x || window.innerWidth / 2}px`;
    p.style.top = `${y || window.innerHeight / 2}px`;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--time', `${Math.random() * 0.3 + 0.6}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
  
  // Remove original element with shrink effect
  elem.style.transform = 'scale(0)';
  elem.style.opacity = '0';
  elem.style.transition = 'all 0.2s ease-out';
  setTimeout(() => elem.remove(), 250);
}

// Continuous flow engine
let flowInterval = null;
let flowCount = 0;

function startFlow() {
  playClickSound();
  
  // Immediate burst on first click
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnBalloon, i * 150);
  }
  for (let i = 0; i < 4; i++) {
    setTimeout(() => spawnHeart(i === 0), i * 180 + 100);
  }
  
  // Update button UI
  const clickBtn = document.getElementById('clickMeBtn');
  const hintText = document.getElementById('hintText');
  const countBadge = document.getElementById('flowCountBadge');
  
  flowCount++;
  if (countBadge) {
    countBadge.textContent = `${flowCount * 8}+ Floating`;
    countBadge.classList.remove('hidden');
  }
  
  if (clickBtn) {
    clickBtn.innerHTML = `
      <span class="text-2xl animate-bounce">🎈</span>
      <span class="tracking-wide">Flow More Love &amp; Balloons!</span>
      <span class="text-2xl animate-bounce">❤️</span>
    `;
  }
  
  if (hintText) {
    hintText.innerHTML = `
      ✨ <strong class="text-rose-300 font-bold">Touch or click any floating heart</strong> to open your surprise! ✨
    `;
    hintText.classList.remove('opacity-70');
    hintText.classList.add('text-rose-200', 'animate-pulse');
  }
  
  // Ensure continuous gentle generation
  if (!flowInterval) {
    flowInterval = setInterval(() => {
      // Alternate balloons and hearts
      if (Math.random() > 0.45) {
        spawnBalloon();
      } else {
        spawnHeart(Math.random() > 0.8);
      }
    }, 450);
  }
}

// Open the Photo Modal
function openPhotoModal() {
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  
  modal.classList.remove('hidden');
  // Trigger transition
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Launch celebration confetti
  launchModalConfetti();
}

// Close the Photo Modal
function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  
  modal.classList.remove('active');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 450);
}

// Celebration Confetti for Modal
function launchModalConfetti() {
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#ffd166', '#06d6a0', '#118ab2', '#ffffff'];
  const count = 50;
  
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const isCircle = Math.random() > 0.5;
    const width = Math.random() * 10 + 6;
    const height = isCircle ? width : (Math.random() * 12 + 6);
    
    p.style.width = `${width}px`;
    p.style.height = `${height}px`;
    p.style.borderRadius = isCircle ? '50%' : '2px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${window.innerWidth / 2}px`;
    p.style.top = `${window.innerHeight / 2}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (Math.min(window.innerWidth, window.innerHeight) * 0.45) + 60;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--time', `${Math.random() * 0.5 + 0.8}s`);
    p.style.setProperty('--rot', `${Math.random() * 1080 - 540}deg`);
    
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1300);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  
  // Set up SVG Heart Gradient Definition
  const svgDef = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDef.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none;');
  svgDef.innerHTML = `
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff6b8b"/>
        <stop offset="50%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#be123c"/>
      </linearGradient>
    </defs>
  `;
  document.body.appendChild(svgDef);
  
  // Click Me Button Event
  const clickBtn = document.getElementById('clickMeBtn');
  if (clickBtn) {
    clickBtn.addEventListener('click', startFlow);
  }
  
  // Center Heart Button Event (Direct modal trigger)
  const centerHeart = document.getElementById('centerHeartBtn');
  if (centerHeart) {
    centerHeart.addEventListener('click', (e) => {
      popElement(centerHeart, e.clientX, e.clientY);
      playHeartChime();
      openPhotoModal();
    });
  }
  
  // Modal Close Events
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
  
  // Keyboard Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoModal();
    }
  });
  
  // Music Button
  const musicBtn = document.getElementById('musicToggleBtn');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }
  
  // Send More Balloons from Modal Button
  const modalFlowBtn = document.getElementById('modalFlowBtn');
  if (modalFlowBtn) {
    modalFlowBtn.addEventListener('click', () => {
      closePhotoModal();
      startFlow();
    });
  }
});
