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
