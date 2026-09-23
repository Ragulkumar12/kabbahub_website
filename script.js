/**
 * Romantic Proposal Interaction Scripts for Kruthika
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Create Continuous Floating Hearts
  startFloatingHearts();

  // Proposal Button Handler
  const proposeBtn = document.getElementById('proposeBtn');
  const celebrationModal = document.getElementById('celebrationModal');
  const closeCelebration = document.getElementById('closeCelebration');

  if (proposeBtn) {
    proposeBtn.addEventListener('click', (e) => {
      triggerHeartExplosion(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
      if (celebrationModal) {
        celebrationModal.classList.remove('hidden');
        celebrationModal.classList.add('flex');
      }
    });
  }

  if (closeCelebration && celebrationModal) {
    closeCelebration.addEventListener('click', () => {
      celebrationModal.classList.add('hidden');
      celebrationModal.classList.remove('flex');
    });
  }

  // Click anywhere to spawn mini hearts
  document.addEventListener('click', (e) => {
    // Only spawn if not clicking buttons/links
    if (!e.target.closest('button') && !e.target.closest('a')) {
      spawnMiniHeart(e.clientX, e.clientY);
    }
  });
});

function startFloatingHearts() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;

  const heartIcons = ['❤️', '💖', '💕', '💗', '💓', '✨', '💍', '🌸'];

  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${Math.random() * 24 + 16}px`;
    heart.style.animationDuration = `${Math.random() * 5 + 6}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 11000);
  }

  // Initial burst
  for (let i = 0; i < 25; i++) {
    setTimeout(createHeart, i * 200);
  }

  // Ongoing creation
  setInterval(createHeart, 450);
}

function spawnMiniHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'confetti-heart';
  const hearts = ['❤️', '💖', '💕', '✨', '💍'];
  heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${Math.random() * 20 + 20}px`;
  
  const tx = (Math.random() - 0.5) * 200;
  const ty = (Math.random() - 1) * 200;
  const rot = (Math.random() - 0.5) * 360;
  
  heart.style.setProperty('--tx', `${tx}px`);
  heart.style.setProperty('--ty', `${ty}px`);
  heart.style.setProperty('--rot', `${rot}deg`);
  
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 2000);
}

function triggerHeartExplosion(centerX, centerY) {
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'confetti-heart';
      const emojis = ['❤️', '💖', '💕', '💍', '✨', '🌹', '💐', '🥰'];
      heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = `${centerX}px`;
      heart.style.top = `${centerY}px`;
      heart.style.fontSize = `${Math.random() * 30 + 18}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 400 + 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 80;
      const rot = (Math.random() - 0.5) * 720;

      heart.style.setProperty('--tx', `${tx}px`);
      heart.style.setProperty('--ty', `${ty}px`);
      heart.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2200);
    }, i * 15);
  }
}
