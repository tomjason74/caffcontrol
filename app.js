/* ===================================================
   CAFFCONTROL - APPLICATION LOGIC & STATE MANAGEMENT
   =================================================== */

(() => {
  'use strict';

  // --- DEFAULT INITIAL STATE (Matches Student Mockup) ---
  const DEFAULT_STATE = {
    studentName: 'ALEX',
    dailyMaxMg: 215, // Student Daily Target (215mg Daily Max)
    safeCeilingMg: 400, // Maximum safe health ceiling (400mg)
    soundEnabled: true, // Audio warnings and alarm sound FX
    currentCaffeineMg: 75, // Sample intake (matches 75mg in mockup)
    lastDrinkTime: Date.now() - (35 * 60 * 1000), // ~35 minutes ago
    drinks: [
      {
        id: 'drink-init-1',
        name: 'Kopiko 3-in-1 (Sachet)',
        mg: 75,
        category: 'Instant Sachet',
        timestamp: Date.now() - (35 * 60 * 1000)
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: '3ls Quiz',
        due: 'Tomorrow',
        category: 'Quiz',
        notes: 'Review chapters 1-3',
        completed: false
      },
      {
        id: 'task-2',
        title: 'Pardev Activity',
        due: 'Tomorrow',
        category: 'Activity',
        notes: 'Submit via LMS',
        completed: true
      },
      {
        id: 'task-3',
        title: 'Chemistry - Experiment',
        due: 'Today',
        category: 'Experiment',
        notes: 'Lab coat and safety goggles required',
        completed: false
      }
    ],
    lastResetDate: new Date().toDateString()
  };

  const STORAGE_KEY = 'caffcontrol_student_app_state_v1';

  // --- STATE LOAD & SAVE ---
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(saved);

      // Check if date rolled over for auto daily reset
      const today = new Date().toDateString();
      if (parsed.lastResetDate !== today) {
        parsed.currentCaffeineMg = 0;
        parsed.drinks = [];
        parsed.lastResetDate = today;
      }

      return { ...DEFAULT_STATE, ...parsed };
    } catch (e) {
      console.warn('Error loading CaffControl state, using defaults', e);
      return { ...DEFAULT_STATE };
    }
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving CaffControl state', e);
    }
  }

  // --- DOM ELEMENT REFERENCES ---
  const el = {
    // Clock & View Switcher
    statusClock: document.getElementById('statusClock'),
    appShell: document.getElementById('appShell'),
    viewMobileBtn: document.getElementById('viewMobileBtn'),
    viewFullBtn: document.getElementById('viewFullBtn'),

    // Hero Quick-Stats
    greetingName: document.getElementById('greetingName'),
    heroIntakeFraction: document.getElementById('heroIntakeFraction'),
    heroSafeCeiling: document.getElementById('heroSafeCeiling'),
    heroPercentPill: document.getElementById('heroPercentPill'),
    heroMiniBarFill: document.getElementById('heroMiniBarFill'),
    heroBoostDuration: document.getElementById('heroBoostDuration'),
    heroBoostSubtext: document.getElementById('heroBoostSubtext'),
    heroDailyMax: document.getElementById('heroDailyMax'),

    // Safety Banner
    safetyAlertBanner: document.getElementById('safetyAlertBanner'),
    alertTitle: document.getElementById('alertTitle'),
    alertDescription: document.getElementById('alertDescription'),
    dismissAlertBtn: document.getElementById('dismissAlertBtn'),

    // Workload
    workloadSummaryText: document.getElementById('workloadSummaryText'),
    workloadProgressBadge: document.getElementById('workloadProgressBadge'),
    workloadBarFill: document.getElementById('workloadBarFill'),
    taskList: document.getElementById('taskList'),
    openAddTaskBtn: document.getElementById('openAddTaskBtn'),

    // Meter Radial Gauge
    meterContainer: document.getElementById('meterContainer'),
    gaugeProgressCircle: document.getElementById('gaugeProgressCircle'),
    meterPercent: document.getElementById('meterPercent'),
    meterMg: document.getElementById('meterMg'),
    meterTargetBadge: document.getElementById('meterTargetBadge'),
    intakeAdvicePill: document.getElementById('intakeAdvicePill'),
    adviceDot: document.getElementById('adviceDot'),
    adviceText: document.getElementById('adviceText'),

    // Main Floating Action
    openAddCoffeeBtn: document.getElementById('openAddCoffeeBtn'),

    // Modals
    addCoffeeModal: document.getElementById('addCoffeeModal'),
    closeAddCoffeeBtn: document.getElementById('closeAddCoffeeBtn'),
    presetsGrid: document.getElementById('presetsGrid'),
    customDrinkForm: document.getElementById('customDrinkForm'),
    customDrinkName: document.getElementById('customDrinkName'),
    customDrinkMg: document.getElementById('customDrinkMg'),

    addTaskModal: document.getElementById('addTaskModal'),
    closeAddTaskBtn: document.getElementById('closeAddTaskBtn'),
    cancelAddTaskBtn: document.getElementById('cancelAddTaskBtn'),
    taskForm: document.getElementById('taskForm'),
    taskTitleInput: document.getElementById('taskTitleInput'),
    taskDueInput: document.getElementById('taskDueInput'),
    taskCategoryInput: document.getElementById('taskCategoryInput'),
    taskNotesInput: document.getElementById('taskNotesInput'),

    profileModal: document.getElementById('profileModal'),
    openProfileBtn: document.getElementById('openProfileBtn'),
    closeProfileBtn: document.getElementById('closeProfileBtn'),
    cancelProfileBtn: document.getElementById('cancelProfileBtn'),
    profileForm: document.getElementById('profileForm'),
    studentNameInput: document.getElementById('studentNameInput'),
    dailyMaxInput: document.getElementById('dailyMaxInput'),
    safeCeilingInput: document.getElementById('safeCeilingInput'),
    resetTodayBtn: document.getElementById('resetTodayBtn'),
    restoreDefaultsBtn: document.getElementById('restoreDefaultsBtn'),

    menuModal: document.getElementById('menuModal'),
    openMenuBtn: document.getElementById('openMenuBtn'),
    closeMenuBtn: document.getElementById('closeMenuBtn'),
    coffeeHistoryList: document.getElementById('coffeeHistoryList'),
    historyTotalMg: document.getElementById('historyTotalMg'),
    historyCount: document.getElementById('historyCount'),

    emergencyOverlay: document.getElementById('emergencyOverlay'),
    emergencyMgDisplay: document.getElementById('emergencyMgDisplay'),
    acknowledgeEmergencyBtn: document.getElementById('acknowledgeEmergencyBtn'),

    // Toast Container & Task Reminder
    toastContainer: document.getElementById('toastContainer'),
    taskReminderCheck: document.getElementById('taskReminderCheck'),

    // Audio & Sound Controls
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),
    soundEnabledInput: document.getElementById('soundEnabledInput'),

    // Security Verification Modal
    menuResetTodayBtn: document.getElementById('menuResetTodayBtn'),
    securityResetModal: document.getElementById('securityResetModal'),
    closeSecurityResetBtn: document.getElementById('closeSecurityResetBtn'),
    cancelSecurityResetBtn: document.getElementById('cancelSecurityResetBtn'),
    confirmSecurityResetBtn: document.getElementById('confirmSecurityResetBtn'),
    securityConfirmInput: document.getElementById('securityConfirmInput'),
    securityHintText: document.getElementById('securityHintText'),
    securityResetMgText: document.getElementById('securityResetMgText')
  };

  // Alert Banner dismissal state
  let alertBannerDismissed = false;
  let lastAlertLevel = 'safe';

  // --- REAL-TIME STATUS BAR CLOCK ---
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    if (el.statusClock) {
      el.statusClock.textContent = `${hours}:${minutes}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- DESKTOP VIEW TOGGLES ---
  el.viewMobileBtn?.addEventListener('click', () => {
    el.appShell.classList.remove('full-width');
    el.viewMobileBtn.classList.add('active');
    el.viewFullBtn.classList.remove('active');
  });

  el.viewFullBtn?.addEventListener('click', () => {
    el.appShell.classList.add('full-width');
    el.viewFullBtn.classList.add('active');
    el.viewMobileBtn.classList.remove('active');
  });

  // --- BOOST DURATION ESTIMATION FORMULA ---
  // Calculates active boost hours remaining based on last drink and total intake
  function calculateBoostRemaining() {
    if (state.currentCaffeineMg <= 0 || !state.lastDrinkTime) {
      return { hours: 0, text: '0.0 hrs', status: 'Inactive' };
    }

    // Baseline boost duration: ~3.5 hours for standard 75-100mg cup, scales up to 6 hours max
    const maxBoostHours = Math.min(6.0, 2.5 + (state.currentCaffeineMg / 100) * 1.3);
    const elapsedHours = (Date.now() - state.lastDrinkTime) / (1000 * 60 * 60);
    const remainingHours = Math.max(0, maxBoostHours - elapsedHours);

    if (remainingHours <= 0) {
      return { hours: 0, text: '0.0 hrs', status: 'Worn Off' };
    }

    const formatted = remainingHours >= 1 
      ? `${remainingHours.toFixed(1)} hrs` 
      : `${Math.round(remainingHours * 60)} mins`;

    return { hours: remainingHours, text: formatted, status: 'Active Alertness' };
  }

  // --- AUDIO SYNTHESIS CHIMES & ALERTS (Zero External Dependencies) ---
  function playNotificationChime(type) {
    if (state.soundEnabled === false) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      if (type === 'caution') {
        // Warning Alert: Two pulsing cautionary tones at 540Hz & 460Hz (Approaching Limit 70%-99%)
        [0, 0.22].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(540, now + offset);
          osc.frequency.exponentialRampToValueAtTime(460, now + offset + 0.15);
          gain.gain.setValueAtTime(0.08, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.18);
        });
      } else if (type === 'danger') {
        // Urgent 100% Safety Alarm: 3 rapid high-urgency siren pulses (100% Limit Reached)
        [0, 0.2, 0.4].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(820, now + offset);
          osc.frequency.linearRampToValueAtTime(620, now + offset + 0.14);
          gain.gain.setValueAtTime(0.12, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.16);
        });
      } else if (type === 'coffee') {
        // Cozy coffee brewing drop / pour blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'reminder') {
        // Soft ascending two-tone reminder chime: D5 (587Hz) -> A5 (880Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'completed') {
        // Uplifting celebration triad: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
          gain.gain.setValueAtTime(0.07, now + (idx * 0.08));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (idx * 0.08));
          osc.stop(now + (idx * 0.08) + 0.3);
        });
      }
    } catch (e) {
      // Audio playback fails silently if blocked by user policy
    }
  }

  // --- BROWSER NATIVE NOTIFICATIONS (HTML5 Notification API) ---
  function sendBrowserNotification(title, body) {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: 'assets/coffee_beans_bg.jpg'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              body,
              icon: 'assets/coffee_beans_bg.jpg'
            });
          }
        }).catch(() => {});
      }
    } catch (e) {
      // Graceful fallback
    }
  }

  // --- IN-APP TOAST NOTIFICATION SYSTEM ---
  function showToastNotification({ type = 'reminder', icon = '🔔', badge = 'REMINDER', title = '', message = '', note = '', duration = 4500 }) {
    if (!el.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon-wrap">
        <span>${icon}</span>
      </div>
      <div class="toast-content">
        <div class="toast-header-row">
          <span class="toast-type-badge">${escapeHtml(badge)}</span>
          <span class="toast-time">Just now</span>
        </div>
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
        ${note ? `<div class="toast-note">${escapeHtml(note)}</div>` : ''}
      </div>
      <button class="toast-dismiss-btn" title="Dismiss notification" aria-label="Dismiss notification">&times;</button>
      <div class="toast-progress-bar">
        <div class="toast-progress-fill" style="animation-duration: ${duration}ms;"></div>
      </div>
    `;

    // Audio Chime
    playNotificationChime(type);

    // Auto dismiss countdown
    let dismissTimeout;
    const removeToast = () => {
      clearTimeout(dismissTimeout);
      toast.classList.add('closing');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 280);
    };

    dismissTimeout = setTimeout(removeToast, duration);

    // Dismiss Button
    toast.querySelector('.toast-dismiss-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      removeToast();
    });

    // Hover pause
    toast.addEventListener('mouseenter', () => {
      clearTimeout(dismissTimeout);
      const fill = toast.querySelector('.toast-progress-fill');
      if (fill) fill.style.animationPlayState = 'paused';
    });

    toast.addEventListener('mouseleave', () => {
      dismissTimeout = setTimeout(removeToast, 2000);
      const fill = toast.querySelector('.toast-progress-fill');
      if (fill) fill.style.animationPlayState = 'running';
    });

    // Keep at most 2 active toasts simultaneously to prevent screen obstruction
    while (el.toastContainer.children.length >= 2) {
      el.toastContainer.removeChild(el.toastContainer.firstChild);
    }
    el.toastContainer.appendChild(toast);
  }

  // Task Added & Reminder Notification
  function triggerTaskAddedNotification(task) {
    showToastNotification({
      type: 'reminder',
      icon: '🔔',
      badge: 'Reminder Scheduled',
      title: task.title,
      message: `Due: ${task.due} • Category: ${task.category || 'Academic'}`,
      note: task.notes ? `Note: "${task.notes}"` : 'Reminder active! Stay focused and monitor your coffee intake.',
      duration: 4800
    });

    sendBrowserNotification(
      `🔔 CaffControl: Task Reminder Scheduled`,
      `"${task.title}" is due ${task.due}. Stay focused with your study goals!`
    );
  }

  // Task Completed Notification
  function triggerTaskCompletedNotification(task, newCompletedCount, totalTasks, newPercent) {
    const isAllDone = totalTasks > 0 && newCompletedCount === totalTasks;

    showToastNotification({
      type: 'completed',
      icon: isAllDone ? '🏆' : '🎉',
      badge: isAllDone ? 'All Tasks Done!' : 'Task Completed',
      title: isAllDone ? 'All Academic Tasks Finished! 🏆' : `Completed: ${task.title}`,
      message: `Workload Progress: ${newCompletedCount} of ${totalTasks} completed (${newPercent}%).`,
      note: isAllDone 
        ? 'Outstanding effort today! Remember to hydrate with water and wind down caffeine.' 
        : 'Great job! Check off your next goal and keep up the momentum.',
      duration: 5000
    });

    sendBrowserNotification(
      isAllDone ? `🏆 All Tasks Completed!` : `🎉 Task Finished: ${task.title}`,
      `Workload progress: ${newCompletedCount} of ${totalTasks} (${newPercent}%). Great work!`
    );
  }

  // --- RENDER APPLICATION ---
  function renderApp() {
    const dailyTarget = state.dailyMaxMg || 215;
    const safeCeiling = state.safeCeilingMg || 400;
    const intake = state.currentCaffeineMg || 0;

    // Calculate percentage relative to the student's daily target limit
    const percentage = Math.round((intake / dailyTarget) * 100);

    // 1. Hero Card Updates
    if (el.greetingName) el.greetingName.textContent = `HI, ${state.studentName.toUpperCase()}!`;
    if (el.heroIntakeFraction) el.heroIntakeFraction.textContent = `${intake}mg`;
    if (el.heroSafeCeiling) el.heroSafeCeiling.textContent = `${safeCeiling}mg`;
    if (el.heroPercentPill) el.heroPercentPill.textContent = `${percentage}%`;
    if (el.heroDailyMax) el.heroDailyMax.textContent = `${dailyTarget}mg`;

    // Hero mini bar
    const miniBarWidth = Math.min(percentage, 100);
    if (el.heroMiniBarFill) {
      el.heroMiniBarFill.style.width = `${miniBarWidth}%`;
    }

    // Boost Duration
    const boost = calculateBoostRemaining();
    if (el.heroBoostDuration) el.heroBoostDuration.textContent = boost.text;
    if (el.heroBoostSubtext) el.heroBoostSubtext.textContent = boost.status;

    // 2. SVG Circular Gauge Arc Calculation
    // Total circumference for r=110 is 2 * PI * 110 ≈ 691.15
    const circumference = 691.15;
    const clampedRatio = Math.min(percentage, 100) / 100;
    const dashOffset = circumference * (1 - clampedRatio);

    if (el.gaugeProgressCircle) {
      el.gaugeProgressCircle.style.strokeDashoffset = dashOffset;
    }

    if (el.meterPercent) el.meterPercent.textContent = `${percentage}%`;
    if (el.meterMg) el.meterMg.textContent = `${intake}mg`;
    if (el.meterTargetBadge) el.meterTargetBadge.textContent = `${dailyTarget}mg Daily Max`;

    // 3. Dynamic Threshold Styling (Green -> Caution Amber -> Glowing 100% Red Alert)
    applySafetyThresholds(percentage, intake, dailyTarget, safeCeiling);

    // 4. Render Today's Workload Tasks
    renderTasks();

    // 5. Render Coffee History Log Modal
    renderCoffeeHistory();

    // 6. Audio / Sound Alert Button state
    if (el.soundIcon && el.soundToggleBtn) {
      if (state.soundEnabled !== false) {
        el.soundIcon.textContent = '🔊';
        el.soundToggleBtn.title = 'Sound alerts: ON (Click to mute)';
        el.soundToggleBtn.classList.remove('muted');
      } else {
        el.soundIcon.textContent = '🔇';
        el.soundToggleBtn.title = 'Sound alerts: MUTED (Click to unmute)';
        el.soundToggleBtn.classList.add('muted');
      }
    }
    if (el.soundEnabledInput) {
      el.soundEnabledInput.checked = state.soundEnabled !== false;
    }
  }

  // --- SAFETY THRESHOLD LOGIC (As requested: 100% turns RED) ---
  function applySafetyThresholds(percentage, intake, dailyTarget, safeCeiling) {
    const isExceeded = percentage >= 100;
    const isCaution = percentage >= 70 && percentage < 100;

    // Mini bar color in hero
    if (el.heroMiniBarFill) {
      if (isExceeded) {
        el.heroMiniBarFill.style.backgroundColor = 'var(--color-danger-red)';
      } else if (isCaution) {
        el.heroMiniBarFill.style.backgroundColor = 'var(--color-caution-orange)';
      } else {
        el.heroMiniBarFill.style.backgroundColor = 'var(--color-caramel-accent)';
      }
    }

    // Gauge Stroke & Container Alert Classes
    if (el.gaugeProgressCircle) {
      if (isExceeded) {
        el.gaugeProgressCircle.style.stroke = 'url(#dangerGradient)';
        el.gaugeProgressCircle.setAttribute('filter', 'url(#glowFilter)');
      } else if (isCaution) {
        el.gaugeProgressCircle.style.stroke = 'url(#cautionGradient)';
        el.gaugeProgressCircle.removeAttribute('filter');
      } else {
        el.gaugeProgressCircle.style.stroke = 'url(#coffeeGradient)';
        el.gaugeProgressCircle.removeAttribute('filter');
      }
    }

    if (el.meterPercent) {
      if (isExceeded) {
        el.meterPercent.style.color = 'var(--color-danger-red)';
      } else if (isCaution) {
        el.meterPercent.style.color = '#c05621';
      } else {
        el.meterPercent.style.color = '#2b180f';
      }
    }

    if (el.meterContainer) {
      if (isExceeded) {
        el.meterContainer.classList.add('danger-alert');
      } else {
        el.meterContainer.classList.remove('danger-alert');
      }
    }

    // Advice Pill below meter
    if (el.intakeAdvicePill && el.adviceDot && el.adviceText) {
      if (isExceeded) {
        el.intakeAdvicePill.style.background = '#fef2f2';
        el.intakeAdvicePill.style.borderColor = '#fca5a5';
        el.intakeAdvicePill.style.color = '#991b1b';
        el.adviceDot.style.background = 'var(--color-danger-red)';
        el.adviceText.textContent = '100% Limit Reached! Switch to Water Now 💧';
      } else if (isCaution) {
        el.intakeAdvicePill.style.background = '#fffbeb';
        el.intakeAdvicePill.style.borderColor = '#fde68a';
        el.intakeAdvicePill.style.color = '#92400e';
        el.adviceDot.style.background = 'var(--color-caution-orange)';
        el.adviceText.textContent = 'Approaching Daily Student Target (Slow Down)';
      } else {
        el.intakeAdvicePill.style.background = '#f7efe6';
        el.intakeAdvicePill.style.borderColor = '#ebd8c8';
        el.intakeAdvicePill.style.color = '#5a3c2b';
        el.adviceDot.style.background = 'var(--color-safe-green)';
        el.adviceText.textContent = 'Safe Intake Level for Study Focus';
      }
    }

    // Safety Alert Banner at top of app
    const currentAlertLevel = isExceeded ? 'danger' : (isCaution ? 'caution' : 'safe');
    if (currentAlertLevel !== lastAlertLevel) {
      alertBannerDismissed = false; // New threshold reached, show banner again
      if (currentAlertLevel === 'danger') {
        playNotificationChime('danger');
      } else if (currentAlertLevel === 'caution' && lastAlertLevel === 'safe') {
        playNotificationChime('caution');
      }
      lastAlertLevel = currentAlertLevel;
    }

    if (el.safetyAlertBanner && el.alertTitle && el.alertDescription) {
      if (currentAlertLevel === 'safe' || alertBannerDismissed) {
        el.safetyAlertBanner.classList.add('hidden');
      } else if (currentAlertLevel === 'danger') {
        el.safetyAlertBanner.classList.remove('hidden', 'caution');
        el.safetyAlertBanner.classList.add('danger');
        el.alertTitle.textContent = '🚨 100% Safe Intake Reached!';
        el.alertDescription.textContent = `You consumed ${intake}mg (${percentage}%). Stop caffeine intake and drink water to avoid jitters or sleep crash.`;
      } else if (currentAlertLevel === 'caution') {
        el.safetyAlertBanner.classList.remove('hidden', 'danger');
        el.safetyAlertBanner.classList.add('caution');
        el.alertTitle.textContent = '⚠️ Approaching Daily Max Limit';
        el.alertDescription.textContent = `You are at ${percentage}% (${intake}mg/${dailyTarget}mg). Consider water or a light break instead of another cup.`;
      }
    }
  }

  // --- WORKLOAD TASK LIST RENDERING ---
  function renderTasks() {
    if (!el.taskList) return;

    el.taskList.innerHTML = '';
    const total = state.tasks.length;
    const completedCount = state.tasks.filter(t => t.completed).length;

    // Workload summary text (matches "Assignments: 1 of 3 Completed")
    if (el.workloadSummaryText) {
      el.workloadSummaryText.textContent = `Assignments: ${completedCount} of ${total} Completed`;
    }

    // Workload progress bar percentage
    const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    if (el.workloadProgressBadge) {
      el.workloadProgressBadge.textContent = `${progressPercent}%`;
    }
    if (el.workloadBarFill) {
      el.workloadBarFill.style.width = `${progressPercent}%`;
    }

    if (total === 0) {
      el.taskList.innerHTML = `
        <li style="text-align: center; padding: 14px; color: #8c7365; font-size: 0.82rem;">
          No academic tasks yet. Click "Add New Task +" below!
        </li>
      `;
      return;
    }

    state.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      const isToday = (task.due || '').toLowerCase().includes('today');

      li.innerHTML = `
        <div class="task-left">
          <label class="task-checkbox-wrap" aria-label="Mark task complete">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="custom-checkbox"></span>
          </label>
          <div class="task-text-group">
            <div class="task-title-line">
              <span class="task-title">${escapeHtml(task.title)}</span>
              <span class="task-due-tag ${isToday ? 'today' : ''}">${escapeHtml(task.due || 'Upcoming')}</span>
            </div>
            ${task.category ? `<span class="task-category-chip">${escapeHtml(task.category)}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="task-delete-btn" title="Delete Task" aria-label="Delete Task">&times;</button>
        </div>
      `;

      // Checkbox listener
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => {
        const wasCompleted = task.completed;
        task.completed = checkbox.checked;
        saveState();
        renderApp();

        // Trigger notification and celebration when marked as done
        if (!wasCompleted && checkbox.checked) {
          const total = state.tasks.length;
          const completedCount = state.tasks.filter(t => t.completed).length;
          const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
          triggerTaskCompletedNotification(task, completedCount, total, progressPercent);
        }
      });

      // Delete listener
      const deleteBtn = li.querySelector('.task-delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.tasks = state.tasks.filter(t => t.id !== task.id);
        saveState();
        renderApp();
      });

      el.taskList.appendChild(li);
    });
  }

  // --- COFFEE HISTORY MODAL RENDERING ---
  function renderCoffeeHistory() {
    if (!el.coffeeHistoryList) return;
    el.coffeeHistoryList.innerHTML = '';

    const drinks = state.drinks || [];
    if (el.historyTotalMg) el.historyTotalMg.textContent = `${state.currentCaffeineMg}mg`;
    if (el.historyCount) el.historyCount.textContent = `${drinks.length} ${drinks.length === 1 ? 'drink' : 'drinks'}`;

    if (drinks.length === 0) {
      el.coffeeHistoryList.innerHTML = `
        <li style="text-align: center; padding: 12px; color: #8c7365; font-size: 0.82rem;">
          No drinks logged today yet. Click "+ Add Coffee" to track your intake!
        </li>
      `;
      return;
    }

    drinks.slice().reverse().forEach(drink => {
      const timeStr = drink.timestamp ? new Date(drink.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Earlier';
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `
        <div>
          <div class="history-name">${escapeHtml(drink.name)}</div>
          <div class="history-time">${timeStr} • ${escapeHtml(drink.category || 'Coffee')}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="history-mg-badge">+${drink.mg}mg</span>
          <button class="history-delete-btn" title="Undo this drink" aria-label="Delete this drink entry">&times;</button>
        </div>
      `;

      li.querySelector('.history-delete-btn').addEventListener('click', () => {
        state.currentCaffeineMg = Math.max(0, state.currentCaffeineMg - drink.mg);
        state.drinks = state.drinks.filter(d => d.id !== drink.id);
        saveState();
        renderApp();
      });

      el.coffeeHistoryList.appendChild(li);
    });
  }

  // --- LOGGING COFFEE INTAKE ---
  function logCoffee(name, mg, category) {
    const parsedMg = parseInt(mg, 10);
    if (isNaN(parsedMg) || parsedMg <= 0) return;

    const newDrink = {
      id: 'drink-' + Date.now(),
      name: name || 'Custom Coffee',
      mg: parsedMg,
      category: category || 'Custom',
      timestamp: Date.now()
    };

    state.drinks.push(newDrink);
    state.currentCaffeineMg += parsedMg;
    state.lastDrinkTime = Date.now();
    saveState();

    // Check if 100% threshold reached
    const percentage = Math.round((state.currentCaffeineMg / state.dailyMaxMg) * 100);
    renderApp();
    closeAllModals();

    if (percentage >= 100) {
      showEmergencyAlert();
    } else if (percentage >= 70) {
      playNotificationChime('caution');
      showToastNotification({
        type: 'reminder',
        icon: '⚠️',
        badge: 'Caution: 70%+ Limit',
        title: 'Approaching Daily Coffee Target',
        message: `Intake reached ${percentage}% (${state.currentCaffeineMg}mg / ${state.dailyMaxMg}mg). Time to slow down!`,
        note: 'Drink a glass of water to balance your hydration.',
        duration: 4500
      });
    } else {
      playNotificationChime('coffee');
    }
  }

  function showEmergencyAlert() {
    playNotificationChime('danger');
    if (el.emergencyMgDisplay) el.emergencyMgDisplay.textContent = `${state.currentCaffeineMg}mg`;
    el.emergencyOverlay.classList.remove('hidden');
  }

  // --- MODAL CONTROLS ---
  function closeAllModals() {
    el.addCoffeeModal?.classList.add('hidden');
    el.addTaskModal?.classList.add('hidden');
    el.profileModal?.classList.add('hidden');
    el.menuModal?.classList.add('hidden');
    el.emergencyOverlay?.classList.add('hidden');
    el.securityResetModal?.classList.add('hidden');
  }

  // Add Coffee Modal
  el.openAddCoffeeBtn?.addEventListener('click', () => {
    el.addCoffeeModal.classList.remove('hidden');
  });

  el.closeAddCoffeeBtn?.addEventListener('click', closeAllModals);

  // Preset Drink Cards Click
  el.presetsGrid?.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const mg = card.dataset.mg;
      const category = card.dataset.category;
      logCoffee(name, mg, category);
    });
  });

  // Custom Drink Form Submit
  el.customDrinkForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = el.customDrinkName.value.trim();
    const mg = el.customDrinkMg.value.trim();
    if (!name || !mg) return;
    logCoffee(name, mg, 'Custom Coffee');
    el.customDrinkForm.reset();
  });

  // Add Task Modal
  el.openAddTaskBtn?.addEventListener('click', () => {
    el.addTaskModal.classList.remove('hidden');
    el.taskTitleInput.focus();
  });

  el.closeAddTaskBtn?.addEventListener('click', closeAllModals);
  el.cancelAddTaskBtn?.addEventListener('click', closeAllModals);

  el.taskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = el.taskTitleInput.value.trim();
    const due = el.taskDueInput.value;
    const category = el.taskCategoryInput.value;
    const notes = el.taskNotesInput.value.trim();
    const isReminderEnabled = el.taskReminderCheck ? el.taskReminderCheck.checked : true;

    if (!title) return;

    const newTask = {
      id: 'task-' + Date.now(),
      title,
      due,
      category,
      notes,
      reminder: isReminderEnabled,
      createdAt: Date.now(),
      completed: false
    };

    state.tasks.push(newTask);
    saveState();
    renderApp();
    el.taskForm.reset();
    if (el.taskReminderCheck) el.taskReminderCheck.checked = true;
    closeAllModals();

    // Trigger Notification & Reminder
    if (isReminderEnabled) {
      triggerTaskAddedNotification(newTask);
    }
  });

  // Profile Modal
  el.openProfileBtn?.addEventListener('click', () => {
    el.studentNameInput.value = state.studentName;
    el.dailyMaxInput.value = state.dailyMaxMg;
    el.safeCeilingInput.value = state.safeCeilingMg;
    if (el.soundEnabledInput) el.soundEnabledInput.checked = state.soundEnabled !== false;
    el.profileModal.classList.remove('hidden');
  });

  el.closeProfileBtn?.addEventListener('click', closeAllModals);
  el.cancelProfileBtn?.addEventListener('click', closeAllModals);

  el.profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = el.studentNameInput.value.trim() || 'ALEX';
    const dailyMax = parseInt(el.dailyMaxInput.value, 10) || 215;
    const safeCeiling = parseInt(el.safeCeilingInput.value, 10) || 400;

    state.studentName = name;
    state.dailyMaxMg = dailyMax;
    state.safeCeilingMg = safeCeiling;
    if (el.soundEnabledInput) state.soundEnabled = el.soundEnabledInput.checked;
    saveState();
    renderApp();
    closeAllModals();
  });

  // Sound Toggle Button in Header Navigation
  el.soundToggleBtn?.addEventListener('click', () => {
    state.soundEnabled = !(state.soundEnabled !== false);
    saveState();
    renderApp();

    if (state.soundEnabled) {
      playNotificationChime('caution');
      showToastNotification({
        type: 'reminder',
        icon: '🔊',
        badge: 'SOUND ALERTS ON',
        title: 'Audio Alerts Enabled',
        message: 'Warning beeps will sound when nearing limits (70%) or hitting 100%.',
        duration: 3000
      });
    } else {
      showToastNotification({
        type: 'reminder',
        icon: '🔇',
        badge: 'SOUND MUTED',
        title: 'Sound Alerts Muted',
        message: 'Audio warnings silenced for quiet study sessions and libraries.',
        duration: 3000
      });
    }
  });

  // --- SECURITY RESET VERIFICATION LOGIC ---
  function openSecurityResetModal() {
    closeAllModals();
    if (el.securityResetMgText) el.securityResetMgText.textContent = `${state.currentCaffeineMg}mg`;
    if (el.securityConfirmInput) el.securityConfirmInput.value = '';
    if (el.confirmSecurityResetBtn) el.confirmSecurityResetBtn.disabled = true;
    if (el.securityHintText) {
      el.securityHintText.textContent = 'Type RESET to activate the authorization button.';
      el.securityHintText.style.color = '#8c7365';
    }
    el.securityResetModal?.classList.remove('hidden');
    setTimeout(() => el.securityConfirmInput?.focus(), 80);
  }

  // Open security modal from Profile or Menu
  el.resetTodayBtn?.addEventListener('click', openSecurityResetModal);
  el.menuResetTodayBtn?.addEventListener('click', openSecurityResetModal);

  // Close security modal
  el.closeSecurityResetBtn?.addEventListener('click', closeAllModals);
  el.cancelSecurityResetBtn?.addEventListener('click', closeAllModals);

  // Real-time keyword verification
  el.securityConfirmInput?.addEventListener('input', () => {
    const val = (el.securityConfirmInput.value || '').trim().toUpperCase();
    if (val === 'RESET') {
      el.confirmSecurityResetBtn.disabled = false;
      el.securityHintText.textContent = '✅ Verified. Click Authorize Reset to execute.';
      el.securityHintText.style.color = '#16a34a';
    } else {
      el.confirmSecurityResetBtn.disabled = true;
      el.securityHintText.textContent = 'Type RESET in all caps to activate.';
      el.securityHintText.style.color = '#8c7365';
    }
  });

  // Authorize Reset Execution
  el.confirmSecurityResetBtn?.addEventListener('click', () => {
    const val = (el.securityConfirmInput.value || '').trim().toUpperCase();
    if (val !== 'RESET') return;

    state.currentCaffeineMg = 0;
    state.drinks = [];
    state.lastDrinkTime = null;
    alertBannerDismissed = false;
    lastAlertLevel = 'safe';
    saveState();
    renderApp();
    closeAllModals();
  });

  // Restore Defaults Button (with confirmation)
  el.restoreDefaultsBtn?.addEventListener('click', () => {
    if (confirm('Reset everything (name, limits, tasks, and coffee history) to original defaults?')) {
      state = { ...DEFAULT_STATE, lastResetDate: new Date().toDateString() };
      alertBannerDismissed = false;
      lastAlertLevel = 'safe';
      saveState();
      renderApp();
      closeAllModals();
    }
  });

  // Menu / History Modal
  el.openMenuBtn?.addEventListener('click', () => {
    renderCoffeeHistory();
    el.menuModal.classList.remove('hidden');
  });

  el.closeMenuBtn?.addEventListener('click', closeAllModals);

  // Emergency Overlay Dismiss
  el.acknowledgeEmergencyBtn?.addEventListener('click', () => {
    el.emergencyOverlay.classList.add('hidden');
  });

  // Dismiss Safety Alert Banner Button (x)
  el.dismissAlertBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    alertBannerDismissed = true;
    el.safetyAlertBanner?.classList.add('hidden');
  });

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Helper function to sanitize user HTML input
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Recurring boost countdown ticker every 30 seconds
  setInterval(() => {
    const boost = calculateBoostRemaining();
    if (el.heroBoostDuration) el.heroBoostDuration.textContent = boost.text;
    if (el.heroBoostSubtext) el.heroBoostSubtext.textContent = boost.status;
  }, 30000);

  // Periodic Reminder Ticker for Pending Tasks Due Today (every 15 mins)
  let lastStudyReminderTime = Date.now();
  setInterval(() => {
    const now = Date.now();
    if (now - lastStudyReminderTime < 15 * 60 * 1000) return;

    const pendingTodayTasks = (state.tasks || []).filter(t => !t.completed && (t.due || '').toLowerCase().includes('today'));
    if (pendingTodayTasks.length > 0) {
      lastStudyReminderTime = now;
      const firstTask = pendingTodayTasks[0];
      showToastNotification({
        type: 'reminder',
        icon: '⏰',
        badge: 'Study Reminder',
        title: `Task Due Today: ${firstTask.title}`,
        message: pendingTodayTasks.length > 1
          ? `You have ${pendingTodayTasks.length} pending academic tasks due today. Remember to stay focused and pace your coffee!`
          : `Don't forget to complete "${firstTask.title}" today!`,
        note: 'Keep your study sessions focused and stay within safe caffeine limits.',
        duration: 5000
      });
      sendBrowserNotification(
        `⏰ CaffControl: Task Due Today`,
        `Don't forget: "${firstTask.title}" is due today!`
      );
    }
  }, 60000);

  // Initialize App on DOM Ready
  renderApp();

})();
