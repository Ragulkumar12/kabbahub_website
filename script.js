/**
 * Kabba Hub - Interactive Kabaddi Live Scoreboard & Portal Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Mobile Navigation Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // --- FAQ Accordion ---
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close other FAQs
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // --- Interactive Kabaddi Scorekeeper Demo ---
  initScorekeeperDemo();

  // --- Interactive Kabaddi Mat Animation Engine ---
  initKabaddiMatAnimation();
});

function initScorekeeperDemo() {
  // Demo State
  const state = {
    teamA: {
      name: 'Thalaivas Warriors',
      score: 18,
      playersOnMat: 6,
      totalPlayers: 7,
      raids: 11,
      tackles: 7,
      color: '#ff5500'
    },
    teamB: {
      name: 'Paltan Strikers',
      score: 16,
      playersOnMat: 4,
      totalPlayers: 7,
      raids: 10,
      tackles: 6,
      color: '#3b82f6'
    },
    currentRaidingTeam: 'teamA', // 'teamA' or 'teamB'
    emptyRaidStreak: 1, // When 2, next raid is Do-Or-Die!
    timerSeconds: 30,
    timerInterval: null,
    isTimerRunning: false,
    history: [
      { text: 'Match in progress: 2nd Half (28:14)', type: 'info' },
      { text: 'R. Kumar tackled! 1 Tackle Point to Paltan Strikers', type: 'tackle' },
      { text: 'V. Sundar executes Running Hand Touch! +1 Point to Thalaivas', type: 'raid' }
    ]
  };

  // DOM Elements
  const elTeamAScore = document.getElementById('teamAScore');
  const elTeamBScore = document.getElementById('teamBScore');
  const elTeamAMat = document.getElementById('teamAMat');
  const elTeamBMat = document.getElementById('teamBMat');
  const elTeamABreakdown = document.getElementById('teamABreakdown');
  const elTeamBBreakdown = document.getElementById('teamBBreakdown');
  const elTimer = document.getElementById('raidTimer');
  const elTimerBar = document.getElementById('raidTimerBar');
  const elCurrentRaider = document.getElementById('currentRaiderBadge');
  const elDodBadge = document.getElementById('dodBadge');
  const elCommentary = document.getElementById('demoCommentary');

  function render() {
    if (elTeamAScore) elTeamAScore.innerText = state.teamA.score;
    if (elTeamBScore) elTeamBScore.innerText = state.teamB.score;

    if (elTeamAMat) {
      elTeamAMat.innerText = `${state.teamA.playersOnMat}/7 on mat`;
      elTeamAMat.className = `text-xs px-2.5 py-1 rounded-full font-semibold ${
        state.teamA.playersOnMat <= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-700/60 text-slate-300'
      }`;
    }

    if (elTeamBMat) {
      elTeamBMat.innerText = `${state.teamB.playersOnMat}/7 on mat`;
      elTeamBMat.className = `text-xs px-2.5 py-1 rounded-full font-semibold ${
        state.teamB.playersOnMat <= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-700/60 text-slate-300'
      }`;
    }

    if (elTeamABreakdown) {
      elTeamABreakdown.innerText = `Raids: ${state.teamA.raids} | Tackles: ${state.teamA.tackles}`;
    }
    if (elTeamBBreakdown) {
      elTeamBBreakdown.innerText = `Raids: ${state.teamB.raids} | Tackles: ${state.teamB.tackles}`;
    }

    // Active Raider
    const raiderTeam = state[state.currentRaidingTeam];
    const defendingTeamKey = state.currentRaidingTeam === 'teamA' ? 'teamB' : 'teamA';
    const defendingTeam = state[defendingTeamKey];

    if (elCurrentRaider) {
      elCurrentRaider.innerText = `${raiderTeam.name} Raiding (${defendingTeam.playersOnMat} Defenders)`;
      elCurrentRaider.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        state.currentRaidingTeam === 'teamA' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`;
    }

    // Do or Die indicator
    if (elDodBadge) {
      if (state.emptyRaidStreak >= 2) {
        elDodBadge.classList.remove('hidden');
      } else {
        elDodBadge.classList.add('hidden');
      }
    }

    // Commentary feed
    if (elCommentary) {
      elCommentary.innerHTML = state.history.slice(0, 5).map(item => {
        let badgeColor = 'bg-slate-700 text-slate-300';
        let icon = 'activity';
        if (item.type === 'raid') {
          badgeColor = 'bg-brand-500/20 text-brand-400 border border-brand-500/30';
          icon = 'zap';
        } else if (item.type === 'tackle') {
          badgeColor = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
          icon = 'shield';
        } else if (item.type === 'allout') {
          badgeColor = 'bg-red-500/20 text-red-400 border border-red-500/30';
          icon = 'flame';
        }

        return `
          <div class="flex items-start gap-3 text-xs sm:text-sm py-2 border-b border-slate-800/80 last:border-0 animate-fadeIn">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ${badgeColor}">${item.type}</span>
            <span class="text-slate-300 font-medium">${item.text}</span>
          </div>
        `;
      }).join('');
    }
  }

  function addLog(text, type = 'info') {
    state.history.unshift({ text, type });
    render();
  }

  function resetRaidTimer() {
    clearInterval(state.timerInterval);
    state.timerSeconds = 30;
    if (elTimer) elTimer.innerText = '30s';
    if (elTimerBar) elTimerBar.style.width = '100%';
    state.isTimerRunning = false;
  }

  function startRaidTimer() {
    resetRaidTimer();
    state.isTimerRunning = true;
    state.timerInterval = setInterval(() => {
      state.timerSeconds--;
      if (elTimer) elTimer.innerText = `${state.timerSeconds}s`;
      if (elTimerBar) {
        const pct = (state.timerSeconds / 30) * 100;
        elTimerBar.style.width = `${pct}%`;
        if (pct < 25) {
          elTimerBar.className = 'raid-progress h-full bg-red-500';
        } else {
          elTimerBar.className = 'raid-progress h-full bg-brand-500';
        }
      }

      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        // Time out raid = raider out
        handleTackle(false, true);
      }
    }, 1000);
  }

  function toggleRaiderTurn() {
    state.currentRaidingTeam = state.currentRaidingTeam === 'teamA' ? 'teamB' : 'teamA';
    startRaidTimer();
    render();
  }

  // --- Scoring Action Handlers ---

  function handleTouchPoint(points = 1) {
    const raidingTeam = state[state.currentRaidingTeam];
    const defendingKey = state.currentRaidingTeam === 'teamA' ? 'teamB' : 'teamA';
    const defendingTeam = state[defendingKey];

    raidingTeam.score += points;
    raidingTeam.raids += points;

    // Out defender
    defendingTeam.playersOnMat = Math.max(0, defendingTeam.playersOnMat - points);

    // Revive raiding player if any are out
    if (raidingTeam.playersOnMat < raidingTeam.totalPlayers) {
      raidingTeam.playersOnMat = Math.min(raidingTeam.totalPlayers, raidingTeam.playersOnMat + 1);
    }

    state.emptyRaidStreak = 0;
    addLog(`⚡ Touch Point! ${raidingTeam.name} tags ${points} defender(s). +${points} Point!`, 'raid');

    checkAllOut(defendingKey, state.currentRaidingTeam);
    toggleRaiderTurn();
  }

  function handleBonusPoint() {
    const raidingTeam = state[state.currentRaidingTeam];
    const defendingKey = state.currentRaidingTeam === 'teamA' ? 'teamB' : 'teamA';
    const defendingTeam = state[defendingKey];

    if (defendingTeam.playersOnMat < 6) {
      addLog(`⚠️ Bonus line deactivated! Only ${defendingTeam.playersOnMat} defenders on mat (requires 6+)`, 'info');
      return;
    }

    raidingTeam.score += 1;
    raidingTeam.raids += 1;
    state.emptyRaidStreak = 0;
    addLog(`🎯 Clean Bonus Point claimed by ${raidingTeam.name}! +1 Point.`, 'raid');
    toggleRaiderTurn();
  }

  function handleSuperRaid() {
    const raidingTeam = state[state.currentRaidingTeam];
    const defendingKey = state.currentRaidingTeam === 'teamA' ? 'teamB' : 'teamA';
    const defendingTeam = state[defendingKey];

    const points = 3;
    raidingTeam.score += points;
    raidingTeam.raids += points;

    defendingTeam.playersOnMat = Math.max(0, defendingTeam.playersOnMat - points);
    raidingTeam.playersOnMat = Math.min(raidingTeam.totalPlayers, raidingTeam.playersOnMat + 2);

    state.emptyRaidStreak = 0;
    addLog(`🔥 SUPER RAID! 3 Defenders eliminated in sensational turn! +3 Points for ${raidingTeam.name}!`, 'raid');

    checkAllOut(defendingKey, state.currentRaidingTeam);
    toggleRaiderTurn();
  }

  function handleEmptyRaid() {
    state.emptyRaidStreak++;
    const raidingTeam = state[state.currentRaidingTeam];

    if (state.emptyRaidStreak >= 3) {
      // Failed Do or die raid! Raider is out
      addLog(`🚨 DO-OR-DIE FAILED! Raider is caught without scoring. 1 Point to opposition!`, 'tackle');
      state.emptyRaidStreak = 0;
      handleTackle(false);
      return;
    }

    if (state.emptyRaidStreak === 2) {
      addLog(`⏳ Empty raid by ${raidingTeam.name}. WARNING: Next raid is DO-OR-DIE!`, 'info');
    } else {
      addLog(`⏱️ Safe empty raid by ${raidingTeam.name}. Mat resets.`, 'info');
    }

    toggleRaiderTurn();
  }

  function handleTackle(isSuperTackle = false, isTimeOut = false) {
    const raidingTeam = state[state.currentRaidingTeam];
    const defendingKey = state.currentRaidingTeam === 'teamA' ? 'teamB' : 'teamA';
    const defendingTeam = state[defendingKey];

    const points = isSuperTackle ? 2 : 1;
    defendingTeam.score += points;
    defendingTeam.tackles += points;

    // Raider goes out
    raidingTeam.playersOnMat = Math.max(0, raidingTeam.playersOnMat - 1);

    // Defender revives a player
    if (defendingTeam.playersOnMat < defendingTeam.totalPlayers) {
      defendingTeam.playersOnMat = Math.min(defendingTeam.totalPlayers, defendingTeam.playersOnMat + 1);
    }

    state.emptyRaidStreak = 0;

    if (isTimeOut) {
      addLog(`⏰ 30-Second Raid Timer Expired! Raider is declared OUT. +1 Point to ${defendingTeam.name}`, 'tackle');
    } else if (isSuperTackle) {
      addLog(`🛡️ SUPER TACKLE! ${defendingTeam.name} executes pin with 3 or less defenders! +2 Points!`, 'tackle');
    } else {
      addLog(`💥 Tackle Success! Raider brought down on the midline! +1 Point to ${defendingTeam.name}`, 'tackle');
    }

    checkAllOut(state.currentRaidingTeam, defendingKey);
    toggleRaiderTurn();
  }

  function checkAllOut(teamOutOfPlayersKey, benefitingTeamKey) {
    const teamOut = state[teamOutOfPlayersKey];
    const teamBenefiting = state[benefitingTeamKey];

    if (teamOut.playersOnMat <= 0) {
      // ALL OUT / LONA!
      teamBenefiting.score += 2; // 2 extra Lona points
      addLog(`🏆 ALL OUT (LONA)! ${teamOut.name} wiped out! +2 Extra Points to ${teamBenefiting.name}. All 7 revived!`, 'allout');
      teamOut.playersOnMat = 7;
      teamBenefiting.playersOnMat = 7;
    }
  }

  function resetMatch() {
    state.teamA.score = 18;
    state.teamA.playersOnMat = 6;
    state.teamA.raids = 11;
    state.teamA.tackles = 7;

    state.teamB.score = 16;
    state.teamB.playersOnMat = 4;
    state.teamB.raids = 10;
    state.teamB.tackles = 6;

    state.currentRaidingTeam = 'teamA';
    state.emptyRaidStreak = 1;
    state.history = [
      { text: 'Match reset to 2nd Half starting state.', type: 'info' }
    ];

    resetRaidTimer();
    render();
  }

  // --- Attach Button Listeners ---
  const btnTouch = document.getElementById('btnTouch');
  const btnBonus = document.getElementById('btnBonus');
  const btnSuperRaid = document.getElementById('btnSuperRaid');
  const btnEmpty = document.getElementById('btnEmpty');
  const btnTackle = document.getElementById('btnTackle');
  const btnSuperTackle = document.getElementById('btnSuperTackle');
  const btnReset = document.getElementById('btnResetDemo');

  if (btnTouch) btnTouch.addEventListener('click', () => handleTouchPoint(1));
  if (btnBonus) btnBonus.addEventListener('click', handleBonusPoint);
  if (btnSuperRaid) btnSuperRaid.addEventListener('click', handleSuperRaid);
  if (btnEmpty) btnEmpty.addEventListener('click', handleEmptyRaid);
  if (btnTackle) btnTackle.addEventListener('click', () => handleTackle(false));
  if (btnSuperTackle) btnSuperTackle.addEventListener('click', () => handleTackle(true));
  if (btnReset) btnReset.addEventListener('click', resetMatch);

  // Initial render
  render();
  startRaidTimer();
}

/**
 * Kabaddi Mat Live Animation Engine
 * Animates real Kabaddi maneuvers: Running Hand Touch, Bonus Point, Chain Tackle, and Super Raid
 */
function initKabaddiMatAnimation() {
  const raider = document.getElementById('animRaider');
  const actionBanner = document.getElementById('matActionBanner');
  const matContainer = document.getElementById('matArena');

  if (!raider || !matContainer) return;

  const defenders = {
    lc: document.getElementById('defLC'), // Left Corner
    li: document.getElementById('defLI'), // Left In
    lcov: document.getElementById('defLCov'), // Left Cover
    c: document.getElementById('defC'), // Center
    rcov: document.getElementById('defRCov'), // Right Cover
    ri: document.getElementById('defRI'), // Right In
    rc: document.getElementById('defRC')  // Right Corner
  };

  const defaultPositions = {
    raider: { top: '82%', left: '50%' },
    lc: { top: '22%', left: '16%' },
    li: { top: '32%', left: '26%' },
    lcov: { top: '38%', left: '38%' },
    c: { top: '42%', left: '50%' },
    rcov: { top: '38%', left: '62%' },
    ri: { top: '32%', left: '74%' },
    rc: { top: '22%', left: '84%' }
  };

  function resetPositions() {
    setPos(raider, defaultPositions.raider.top, defaultPositions.raider.left);
    Object.keys(defenders).forEach(k => {
      if (defenders[k]) setPos(defenders[k], defaultPositions[k].top, defaultPositions[k].left);
    });
  }

  function setPos(el, top, left) {
    if (el) {
      el.style.top = top;
      el.style.left = left;
    }
  }

  function setBanner(text, type = 'info') {
    if (!actionBanner) return;
    let badgeClass = 'bg-brand-500/20 text-brand-400 border border-brand-500/30';
    if (type === 'bonus') badgeClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    if (type === 'tackle') badgeClass = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    if (type === 'super') badgeClass = 'bg-gradient-to-r from-brand-500 to-red-500 text-white font-black';

    actionBanner.className = `inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all transform scale-105 ${badgeClass}`;
    actionBanner.innerHTML = text;
  }

  function triggerBlast(top, left) {
    const blast = document.createElement('div');
    blast.className = 'impact-blast';
    blast.style.top = top;
    blast.style.left = left;
    matContainer.appendChild(blast);
    setTimeout(() => blast.remove(), 600);
  }

  // Maneuver 1: Running Hand Touch
  function animHandTouch() {
    resetPositions();
    setBanner('⚡ Raider dashing for Running Hand Touch...', 'info');

    setTimeout(() => {
      // Raider sprints toward Right Cover
      setPos(raider, '40%', '60%');
      setPos(defenders.rcov, '36%', '64%');
    }, 200);

    setTimeout(() => {
      // Touch impact!
      triggerBlast('38%', '61%');
      setBanner('🎯 TOUCH! Raider tags Right Cover (+1 Point)', 'info');
      // Raider retreats safely over midline
      setPos(raider, '82%', '50%');
    }, 900);

    setTimeout(() => {
      resetPositions();
      setBanner('✅ Raider safely back across midline', 'info');
    }, 1800);
  }

  // Maneuver 2: Bonus Point Toe-Touch
  function animBonus() {
    resetPositions();
    setBanner('🎯 Raider hunting for Bonus Line crossing...', 'bonus');

    setTimeout(() => {
      // Raider feints left, steps over bonus line
      setPos(raider, '58%', '28%');
    }, 300);

    setTimeout(() => {
      triggerBlast('57%', '28%');
      setBanner('✨ CLEAN BONUS POINT! Trailing foot in air (+1 Bonus)', 'bonus');
    }, 900);

    setTimeout(() => {
      // Quick return to midline
      setPos(raider, '82%', '45%');
    }, 1500);

    setTimeout(() => {
      resetPositions();
      setBanner('✅ Bonus Secured!', 'bonus');
    }, 2200);
  }

  // Maneuver 3: Chain Tackle / Ankle Hold
  function animTackle() {
    resetPositions();
    setBanner('🛡️ Defensive chain closing in on raider...', 'tackle');

    setTimeout(() => {
      // Raider ventures deep
      setPos(raider, '36%', '50%');
    }, 300);

    setTimeout(() => {
      // Defenders collapse in a chain tackle
      setPos(defenders.lc, '36%', '46%');
      setPos(defenders.lcov, '36%', '48%');
      setPos(defenders.rcov, '36%', '52%');
      setPos(defenders.rc, '36%', '54%');
      triggerBlast('35%', '50%');
      setBanner('💥 PINNED! Defense executes sensational Chain Tackle (+1 Pt)', 'tackle');
    }, 900);

    setTimeout(() => {
      setBanner('🛑 Raider is OUT! Revival awarded to defending team', 'tackle');
    }, 1800);

    setTimeout(() => {
      resetPositions();
    }, 2800);
  }

  // Maneuver 4: Super Raid (Multiple touches)
  function animSuperRaid() {
    resetPositions();
    setBanner('🔥 Raider charging into defense...', 'super');

    setTimeout(() => {
      // Tag 1 (Right Corner)
      setPos(raider, '30%', '76%');
      triggerBlast('28%', '78%');
    }, 400);

    setTimeout(() => {
      // Tag 2 (Center)
      setPos(raider, '40%', '50%');
      triggerBlast('39%', '50%');
    }, 900);

    setTimeout(() => {
      // Tag 3 (Left In)
      setPos(raider, '38%', '32%');
      triggerBlast('36%', '30%');
      setBanner('🔥 SUPER RAID! 3 Defenders tagged! Dashing to midline...', 'super');
    }, 1400);

    setTimeout(() => {
      // Escape to midline
      setPos(raider, '82%', '50%');
    }, 1900);

    setTimeout(() => {
      resetPositions();
      setBanner('🏆 SENSATIONAL SUPER RAID! +3 Points!', 'super');
    }, 2600);
  }

  // Auto-play rotation
  let autoTimer = null;
  const maneuvers = [animHandTouch, animBonus, animTackle, animSuperRaid];
  let curIndex = 0;

  function runNextManeuver() {
    maneuvers[curIndex]();
    curIndex = (curIndex + 1) % maneuvers.length;
  }

  function startAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    runNextManeuver();
    autoTimer = setInterval(runNextManeuver, 4000);
  }

  // Bind Buttons
  const btnAnimTouch = document.getElementById('btnAnimTouch');
  const btnAnimBonus = document.getElementById('btnAnimBonus');
  const btnAnimTackle = document.getElementById('btnAnimTackle');
  const btnAnimSuper = document.getElementById('btnAnimSuper');
  const btnAnimAuto = document.getElementById('btnAnimAuto');

  if (btnAnimTouch) btnAnimTouch.addEventListener('click', () => { clearInterval(autoTimer); animHandTouch(); });
  if (btnAnimBonus) btnAnimBonus.addEventListener('click', () => { clearInterval(autoTimer); animBonus(); });
  if (btnAnimTackle) btnAnimTackle.addEventListener('click', () => { clearInterval(autoTimer); animTackle(); });
  if (btnAnimSuper) btnAnimSuper.addEventListener('click', () => { clearInterval(autoTimer); animSuperRaid(); });
  if (btnAnimAuto) btnAnimAuto.addEventListener('click', () => { startAutoPlay(); });

  // Initial setup
  resetPositions();
  startAutoPlay();
}

