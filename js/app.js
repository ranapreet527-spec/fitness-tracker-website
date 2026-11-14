// PulseFit Core Application Controller

class PulseFitApp {
  constructor() {
    this.state = StorageManager.load();
    this.activeWorkout = null;
    this.workoutTimerInterval = null;
    this.restTimerInterval = null;
    this.restTimerSecondsLeft = 0;
    this.restTimerTotalSeconds = 60;

    // Interval Timer State
    this.hiitState = {
      status: "idle", // "idle", "running", "paused"
      phase: "prepare", // "prepare", "work", "rest"
      currentRound: 1,
      totalRounds: 8,
      prepareSec: 10,
      workSec: 30,
      restSec: 15,
      secondsLeft: 10,
      timerId: null
    };

    // Stopwatch State
    this.stopwatch = {
      running: false,
      startTime: 0,
      elapsedTime: 0,
      timerId: null,
      laps: []
    };

    this.init();
  }

  init() {
    this.applyTheme(this.state.settings.theme || "dark");
    sounds.enabled = this.state.settings.soundEnabled ?? true;

    this.bindNavigation();
    this.bindDashboardEvents();
    this.bindWorkoutEvents();
    this.bindNutritionEvents();
    this.bindTimerEvents();
    this.bindCalculatorEvents();
    this.bindAnalyticsEvents();
    this.bindSettingsEvents();

    this.renderAll();
    this.showRandomQuote();
  }

  // --- THEME & SETTINGS ---
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.state.settings.theme = theme;
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark" 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>` 
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  save() {
    StorageManager.save(this.state);
  }

  // --- NAVIGATION ---
  bindNavigation() {
    const navButtons = document.querySelectorAll("[data-nav-target]");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.navTarget;
        this.switchTab(target);
      });
    });
  }

  switchTab(tabId) {
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    document.querySelectorAll("[data-nav-target]").forEach(btn => btn.classList.remove("active"));

    const activePane = document.getElementById(`pane-${tabId}`);
    if (activePane) activePane.classList.add("active");

    const activeBtns = document.querySelectorAll(`[data-nav-target="${tabId}"]`);
    activeBtns.forEach(b => b.classList.add("active"));

    // Render tab-specific dynamic visuals
    if (tabId === "dashboard") {
      this.renderDashboard();
    } else if (tabId === "nutrition") {
      this.renderNutrition();
    } else if (tabId === "analytics") {
      this.renderAnalytics();
    } else if (tabId === "workouts") {
      this.renderRoutines();
    }
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'}</span>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- DASHBOARD ---
  bindDashboardEvents() {
    // Water Quick Add buttons
    document.querySelectorAll("[data-water-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        const amount = parseInt(btn.dataset.waterAdd, 10);
        this.addWater(amount);
      });
    });

    const resetWaterBtn = document.getElementById("reset-water-btn");
    if (resetWaterBtn) {
      resetWaterBtn.addEventListener("click", () => {
        this.state.today.waterMl = 0;
        this.save();
        this.renderDashboard();
        this.showToast("Water intake reset for today", "info");
      });
    }

    // Steps updater
    const updateStepsBtn = document.getElementById("update-steps-btn");
    if (updateStepsBtn) {
      updateStepsBtn.addEventListener("click", () => {
        const input = document.getElementById("steps-input");
        const steps = parseInt(input.value, 10);
        if (!isNaN(steps) && steps >= 0) {
          this.state.today.steps = steps;
          this.save();
          this.renderDashboard();
          this.showToast(`Updated steps to ${steps.toLocaleString()}`, "success");
        }
      });
    }

    // Quote refresh
    const quoteBtn = document.getElementById("refresh-quote-btn");
    if (quoteBtn) {
      quoteBtn.addEventListener("click", () => this.showRandomQuote());
    }

    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const newTheme = this.state.settings.theme === "dark" ? "light" : "dark";
        this.applyTheme(newTheme);
        this.save();
        this.renderDashboard();
        this.renderAnalytics();
      });
    }
  }

  addWater(ml) {
    this.state.today.waterMl = Math.max(0, (this.state.today.waterMl || 0) + ml);
    this.save();
    sounds.waterDrop();
    this.renderDashboard();
    this.showToast(`+${ml}ml water logged! (${this.state.today.waterMl} / ${this.state.profile.goals.dailyWaterMl}ml)`, "success");
  }

  showRandomQuote() {
    const quoteEl = document.getElementById("daily-quote");
    const authorEl = document.getElementById("quote-author");
    if (!quoteEl || !authorEl) return;
    const random = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    quoteEl.textContent = `"${random.text}"`;
    authorEl.textContent = `— ${random.author}`;
  }

  renderDashboard() {
    // Greeting & Date
    const today = new Date();
    const options = { weekday: "long", month: "short", day: "numeric" };
    const dateStr = today.toLocaleDateString("en-US", options);
    const dateEl = document.getElementById("dashboard-date");
    if (dateEl) dateEl.textContent = dateStr;

    const streakEl = document.getElementById("streak-counter");
    if (streakEl) streakEl.textContent = `${this.state.currentStreak || 1} Days`;

    // Calories Burned & Consumed
    const totalConsumed = (this.state.today.meals || []).reduce((acc, m) => acc + (m.calories || 0), 0);
    const burned = this.state.today.caloriesBurned || 0;
    const targetCalories = this.state.profile.goals.dailyCalories || 2400;
    const remaining = Math.max(0, targetCalories - totalConsumed);

    const consumedEl = document.getElementById("dash-cal-consumed");
    const remainingEl = document.getElementById("dash-cal-remaining");
    const burnedEl = document.getElementById("dash-cal-burned");
    const targetEl = document.getElementById("dash-cal-target");

    if (consumedEl) consumedEl.textContent = totalConsumed;
    if (remainingEl) remainingEl.textContent = remaining;
    if (burnedEl) burnedEl.textContent = burned;
    if (targetEl) targetEl.textContent = targetCalories;

    const calPercent = Math.min(100, Math.round((totalConsumed / targetCalories) * 100));
    const calProgress = document.getElementById("dash-cal-progress");
    if (calProgress) calProgress.style.width = `${calPercent}%`;

    // Water
    const currentWater = this.state.today.waterMl || 0;
    const waterGoal = this.state.profile.goals.dailyWaterMl || 3000;
    const waterPercent = Math.min(100, Math.round((currentWater / waterGoal) * 100));
    
    const waterCurrEl = document.getElementById("dash-water-current");
    const waterGoalEl = document.getElementById("dash-water-goal");
    const waterProgress = document.getElementById("dash-water-progress");
    if (waterCurrEl) waterCurrEl.textContent = `${currentWater} ml`;
    if (waterGoalEl) waterGoalEl.textContent = `/ ${waterGoal} ml`;
    if (waterProgress) waterProgress.style.width = `${waterPercent}%`;

    // Steps
    const currentSteps = this.state.today.steps || 0;
    const stepsGoal = this.state.profile.goals.dailySteps || 10000;
    const stepsPercent = Math.min(100, Math.round((currentSteps / stepsGoal) * 100));

    const stepsCurrEl = document.getElementById("dash-steps-current");
    const stepsGoalEl = document.getElementById("dash-steps-goal");
    const stepsProgress = document.getElementById("dash-steps-progress");
    const stepsInput = document.getElementById("steps-input");
    if (stepsCurrEl) stepsCurrEl.textContent = currentSteps.toLocaleString();
    if (stepsGoalEl) stepsGoalEl.textContent = `/ ${stepsGoal.toLocaleString()}`;
    if (stepsProgress) stepsProgress.style.width = `${stepsPercent}%`;
    if (stepsInput) stepsInput.value = currentSteps;

    // Active minutes
    const activeMinsEl = document.getElementById("dash-active-minutes");
    if (activeMinsEl) activeMinsEl.textContent = `${this.state.today.activeWorkoutMinutes || 0} min`;

    // Render Weekly Activity Bar Chart
    FitnessCharts.renderWeeklyActivityChart("dash-weekly-chart", this.state.workoutHistory || []);
  }

  // --- WORKOUT TRACKER & ACTIVE WORKOUT ---
  bindWorkoutEvents() {
    // Start empty workout button
    const startEmptyBtn = document.getElementById("btn-start-empty-workout");
    if (startEmptyBtn) {
      startEmptyBtn.addEventListener("click", () => {
        this.startWorkoutSession({
          name: "Custom Workout",
          exercises: []
        });
      });
    }

    // Finish Workout Button
    const finishBtn = document.getElementById("btn-finish-workout");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => this.finishWorkoutSession());
    }

    // Cancel Workout Button
    const cancelBtn = document.getElementById("btn-cancel-workout");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to discard this active workout session?")) {
          this.cancelWorkoutSession();
        }
      });
    }

    // Add Exercise to Active Workout
    const addExBtn = document.getElementById("btn-add-exercise-to-workout");
    if (addExBtn) {
      addExBtn.addEventListener("click", () => this.openExercisePickerModal());
    }

    // Exercise Library Search & Filters
    const exSearchInput = document.getElementById("exercise-search-input");
    if (exSearchInput) {
      exSearchInput.addEventListener("input", (e) => {
        this.renderExerciseLibrary(e.target.value, this.currentExCategory);
      });
    }

    const exCategorySelect = document.getElementById("exercise-category-filter");
    if (exCategorySelect) {
      exCategorySelect.addEventListener("change", (e) => {
        this.currentExCategory = e.target.value;
        this.renderExerciseLibrary(document.getElementById("exercise-search-input")?.value || "", this.currentExCategory);
      });
    }

    // Rest Timer Controls
    const restSkipBtn = document.getElementById("rest-timer-skip");
    if (restSkipBtn) {
      restSkipBtn.addEventListener("click", () => this.stopRestTimer());
    }
    const restAdd15Btn = document.getElementById("rest-timer-add15");
    if (restAdd15Btn) {
      restAdd15Btn.addEventListener("click", () => {
        this.restTimerSecondsLeft += 15;
        this.restTimerTotalSeconds += 15;
        this.updateRestTimerDisplay();
      });
    }
    const restSub15Btn = document.getElementById("rest-timer-sub15");
    if (restSub15Btn) {
      restSub15Btn.addEventListener("click", () => {
        this.restTimerSecondsLeft = Math.max(5, this.restTimerSecondsLeft - 15);
        this.updateRestTimerDisplay();
      });
    }
  }

  startWorkoutSession(routine) {
    if (this.activeWorkout) {
      if (!confirm("A workout session is already in progress. Do you want to start a new one and replace it?")) {
        return;
      }
      this.cancelWorkoutSession();
    }

    const exercises = (routine.exercises || []).map(item => {
      const dbEx = EXERCISE_DATABASE.find(e => e.id === item.exerciseId) || { name: item.name || "Exercise", id: item.exerciseId };
      const sets = [];
      const numSets = item.targetSets || 3;
      for (let s = 1; s <= numSets; s++) {
        sets.push({
          setNumber: s,
          weight: 0,
          reps: item.targetReps || 10,
          completed: false
        });
      }
      return {
        exerciseId: dbEx.id,
        name: dbEx.name,
        restSeconds: item.restSeconds || 60,
        sets: sets
      };
    });

    this.activeWorkout = {
      name: routine.name || "Workout Session",
      startTime: Date.now(),
      elapsedSeconds: 0,
      exercises: exercises
    };

    // Show workout view
    document.getElementById("active-workout-view").classList.remove("hidden");
    document.getElementById("routines-view").classList.add("hidden");

    // Start workout clock
    clearInterval(this.workoutTimerInterval);
    this.workoutTimerInterval = setInterval(() => {
      this.activeWorkout.elapsedSeconds++;
      this.updateWorkoutTimerDisplay();
    }, 1000);

    this.renderActiveWorkout();
    this.showToast(`Workout started: ${this.activeWorkout.name}! Let's crush it! 💪`, "success");
  }

  updateWorkoutTimerDisplay() {
    const el = document.getElementById("workout-session-timer");
    if (!el || !this.activeWorkout) return;
    const mins = Math.floor(this.activeWorkout.elapsedSeconds / 60);
    const secs = this.activeWorkout.elapsedSeconds % 60;
    el.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  renderActiveWorkout() {
    if (!this.activeWorkout) return;
    const container = document.getElementById("active-workout-exercises");
    if (!container) return;

    document.getElementById("active-workout-title").textContent = this.activeWorkout.name;

    if (this.activeWorkout.exercises.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No exercises added to this workout yet.</p>
          <button class="btn btn-primary" onclick="window.app.openExercisePickerModal()">+ Add Your First Exercise</button>
        </div>
      `;
      return;
    }

    container.innerHTML = this.activeWorkout.exercises.map((ex, exIdx) => {
      return `
        <div class="exercise-card card" data-ex-index="${exIdx}">
          <div class="exercise-card-header">
            <div>
              <h3 class="exercise-card-title">${ex.name}</h3>
              <span class="text-muted text-sm">Rest: ${ex.restSeconds || 60}s</span>
            </div>
            <button class="btn-icon text-danger" title="Remove Exercise" onclick="window.app.removeExerciseFromWorkout(${exIdx})">
              ✕
            </button>
          </div>

          <div class="sets-table-wrapper">
            <table class="sets-table">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Weight (${this.state.settings.units === 'imperial' ? 'lbs' : 'kg'})</th>
                  <th>Reps</th>
                  <th>Done</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${ex.sets.map((set, setIdx) => {
                  return `
                    <tr class="${set.completed ? 'set-completed' : ''}">
                      <td class="set-num-cell">${set.setNumber}</td>
                      <td>
                        <input type="number" min="0" step="0.5" class="set-input set-weight-input" 
                          value="${set.weight || ''}" placeholder="0"
                          onchange="window.app.updateSetValue(${exIdx}, ${setIdx}, 'weight', this.value)">
                      </td>
                      <td>
                        <input type="number" min="1" step="1" class="set-input set-reps-input" 
                          value="${set.reps || ''}" placeholder="10"
                          onchange="window.app.updateSetValue(${exIdx}, ${setIdx}, 'reps', this.value)">
                      </td>
                      <td>
                        <button class="btn-set-check ${set.completed ? 'checked' : ''}" 
                          onclick="window.app.toggleSetComplete(${exIdx}, ${setIdx})">
                          ${set.completed ? '✓' : ''}
                        </button>
                      </td>
                      <td>
                        <button class="btn-icon text-muted text-xs" title="Remove set" onclick="window.app.removeSet(${exIdx}, ${setIdx})">✕</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="exercise-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="window.app.addSet(${exIdx})">+ Add Set</button>
          </div>
        </div>
      `;
    }).join('');
  }

  updateSetValue(exIdx, setIdx, field, val) {
    if (!this.activeWorkout) return;
    const num = parseFloat(val) || 0;
    this.activeWorkout.exercises[exIdx].sets[setIdx][field] = num;
  }

  addSet(exIdx) {
    if (!this.activeWorkout) return;
    const sets = this.activeWorkout.exercises[exIdx].sets;
    const lastSet = sets[sets.length - 1];
    sets.push({
      setNumber: sets.length + 1,
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 10,
      completed: false
    });
    this.renderActiveWorkout();
  }

  removeSet(exIdx, setIdx) {
    if (!this.activeWorkout) return;
    const sets = this.activeWorkout.exercises[exIdx].sets;
    if (sets.length <= 1) {
      this.showToast("At least 1 set is required", "warning");
      return;
    }
    sets.splice(setIdx, 1);
    // Renumber
    sets.forEach((s, i) => s.setNumber = i + 1);
    this.renderActiveWorkout();
  }

  toggleSetComplete(exIdx, setIdx) {
    if (!this.activeWorkout) return;
    const set = this.activeWorkout.exercises[exIdx].sets[setIdx];
    set.completed = !set.completed;

    if (set.completed) {
      sounds.tick();
      // Start rest timer
      const restTime = this.activeWorkout.exercises[exIdx].restSeconds || 60;
      this.startRestTimer(restTime);
      this.showToast(`Set ${set.setNumber} finished! Rest timer started (${restTime}s)`, "success");
    }

    this.renderActiveWorkout();
  }

  removeExerciseFromWorkout(exIdx) {
    if (!this.activeWorkout) return;
    this.activeWorkout.exercises.splice(exIdx, 1);
    this.renderActiveWorkout();
  }

  startRestTimer(seconds) {
    this.stopRestTimer();
    this.restTimerSecondsLeft = seconds;
    this.restTimerTotalSeconds = seconds;

    const banner = document.getElementById("floating-rest-timer");
    if (banner) banner.classList.remove("hidden");

    this.updateRestTimerDisplay();

    this.restTimerInterval = setInterval(() => {
      this.restTimerSecondsLeft--;
      if (this.restTimerSecondsLeft <= 3 && this.restTimerSecondsLeft > 0) {
        sounds.tick();
      }
      if (this.restTimerSecondsLeft <= 0) {
        this.stopRestTimer();
        sounds.restComplete();
        this.showToast("Rest time is up! Ready for your next set! ⚡", "success");
      } else {
        this.updateRestTimerDisplay();
      }
    }, 1000);
  }

  updateRestTimerDisplay() {
    const timeEl = document.getElementById("rest-timer-time");
    const progressEl = document.getElementById("rest-timer-progress-bar");
    if (!timeEl) return;

    const mins = Math.floor(this.restTimerSecondsLeft / 60);
    const secs = this.restTimerSecondsLeft % 60;
    timeEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    if (progressEl) {
      const pct = Math.max(0, Math.min(100, (this.restTimerSecondsLeft / this.restTimerTotalSeconds) * 100));
      progressEl.style.width = `${pct}%`;
    }
  }

  stopRestTimer() {
    clearInterval(this.restTimerInterval);
    this.restTimerInterval = null;
    const banner = document.getElementById("floating-rest-timer");
    if (banner) banner.classList.add("hidden");
  }

  finishWorkoutSession() {
    if (!this.activeWorkout) return;

    // Calculate metrics
    let totalVolume = 0;
    let completedSetsCount = 0;

    this.activeWorkout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          completedSetsCount++;
          totalVolume += (s.weight * s.reps);
        }
      });
    });

    if (completedSetsCount === 0) {
      if (!confirm("You haven't checked off any completed sets. Do you still want to finish and save?")) {
        return;
      }
    }

    const durationMins = Math.max(1, Math.round(this.activeWorkout.elapsedSeconds / 60));
    // Estimate burned calories (~7-9 cal / min of lifting)
    const estBurnedCalories = Math.round(durationMins * 7.5);

    const record = {
      id: "wo_" + Date.now(),
      name: this.activeWorkout.name,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: durationMins,
      totalVolumeKg: totalVolume,
      caloriesBurned: estBurnedCalories,
      completedSetsCount: completedSetsCount,
      exercises: this.activeWorkout.exercises
    };

    this.state.workoutHistory.unshift(record);
    this.state.today.activeWorkoutMinutes = (this.state.today.activeWorkoutMinutes || 0) + durationMins;
    this.state.today.caloriesBurned = (this.state.today.caloriesBurned || 0) + estBurnedCalories;

    this.save();
    sounds.success();

    this.cancelWorkoutSession();
    this.renderDashboard();
    this.renderAnalytics();

    // Show celebratory modal
    this.showWorkoutSummaryModal(record);
  }

  showWorkoutSummaryModal(record) {
    const modal = document.getElementById("modal-workout-summary");
    if (!modal) return;

    document.getElementById("summary-workout-name").textContent = record.name;
    document.getElementById("summary-duration").textContent = `${record.durationMinutes} min`;
    document.getElementById("summary-volume").textContent = `${record.totalVolumeKg.toLocaleString()} ${this.state.settings.units === 'imperial' ? 'lbs' : 'kg'}`;
    document.getElementById("summary-calories").textContent = `${record.caloriesBurned} kcal`;
    document.getElementById("summary-sets").textContent = `${record.completedSetsCount} sets`;

    modal.classList.remove("hidden");
  }

  cancelWorkoutSession() {
    clearInterval(this.workoutTimerInterval);
    this.workoutTimerInterval = null;
    this.stopRestTimer();
    this.activeWorkout = null;

    document.getElementById("active-workout-view").classList.add("hidden");
    document.getElementById("routines-view").classList.remove("hidden");
  }

  // --- ROUTINES VIEW ---
  renderRoutines() {
    const container = document.getElementById("routines-list");
    if (!container) return;

    const routines = this.state.customRoutines || PRESET_ROUTINES;

    container.innerHTML = routines.map((r, idx) => {
      const exCount = (r.exercises || []).length;
      return `
        <div class="card routine-card">
          <div class="routine-card-body">
            <span class="badge badge-accent">${r.category || 'Workout'}</span>
            <h3 class="routine-title">${r.name}</h3>
            <p class="routine-desc text-muted">${r.description || ''}</p>
            <div class="routine-meta">
              <span><strong>${exCount}</strong> Exercises</span>
              <span>•</span>
              <span>~<strong>45</strong> mins</span>
            </div>
          </div>
          <div class="routine-card-footer">
            <button class="btn btn-primary btn-block" onclick="window.app.startWorkoutFromRoutineIndex(${idx})">
              Start This Workout 🚀
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  startWorkoutFromRoutineIndex(idx) {
    const routines = this.state.customRoutines || PRESET_ROUTINES;
    if (routines[idx]) {
      this.startWorkoutSession(routines[idx]);
    }
  }

  // --- EXERCISE PICKER MODAL ---
  openExercisePickerModal() {
    const modal = document.getElementById("modal-exercise-picker");
    if (!modal) return;
    this.renderExerciseLibrary();
    modal.classList.remove("hidden");
  }

  renderExerciseLibrary(query = "", category = "all") {
    const list = document.getElementById("exercise-library-list");
    if (!list) return;

    let filtered = EXERCISE_DATABASE;
    if (category && category !== "all") {
      filtered = filtered.filter(e => e.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(e => e.name.toLowerCase().includes(q) || e.primaryMuscle.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>No exercises found matching your search.</p></div>`;
      return;
    }

    list.innerHTML = filtered.map(ex => {
      return `
        <div class="exercise-picker-item">
          <div class="exercise-picker-info">
            <h4>${ex.name}</h4>
            <span class="text-xs text-muted">${ex.primaryMuscle} • ${ex.equipment}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.app.addExerciseToActiveWorkout('${ex.id}')">
            + Add
          </button>
        </div>
      `;
    }).join('');
  }

  addExerciseToActiveWorkout(exId) {
    if (!this.activeWorkout) return;
    const ex = EXERCISE_DATABASE.find(e => e.id === exId);
    if (!ex) return;

    this.activeWorkout.exercises.push({
      exerciseId: ex.id,
      name: ex.name,
      restSeconds: 60,
      sets: [
        { setNumber: 1, weight: 0, reps: 10, completed: false },
        { setNumber: 2, weight: 0, reps: 10, completed: false },
        { setNumber: 3, weight: 0, reps: 10, completed: false }
      ]
    });

    document.getElementById("modal-exercise-picker")?.classList.add("hidden");
    this.renderActiveWorkout();
    this.showToast(`Added ${ex.name} to workout!`, "success");
  }

  // --- NUTRITION TRACKER ---
  bindNutritionEvents() {
    // Add food button
    document.querySelectorAll("[data-open-food-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mealType = btn.dataset.openFoodModal || "breakfast";
        this.openAddFoodModal(mealType);
      });
    });

    // Custom food submit
    const customFoodForm = document.getElementById("custom-food-form");
    if (customFoodForm) {
      customFoodForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCustomFoodSubmit();
      });
    }

    // Food search
    const foodSearch = document.getElementById("food-search-input");
    if (foodSearch) {
      foodSearch.addEventListener("input", (e) => {
        this.renderFoodQuickList(e.target.value);
      });
    }
  }

  openAddFoodModal(mealType) {
    this.currentFoodMealType = mealType;
    const modal = document.getElementById("modal-add-food");
    if (!modal) return;
    document.getElementById("food-modal-meal-name").textContent = mealType.toUpperCase();
    this.renderFoodQuickList();
    modal.classList.remove("hidden");
  }

  renderFoodQuickList(query = "") {
    const container = document.getElementById("food-quick-list");
    if (!container) return;

    let items = FOOD_DATABASE;
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(f => f.name.toLowerCase().includes(q));
    }

    container.innerHTML = items.map(f => {
      return `
        <div class="food-picker-item">
          <div>
            <strong>${f.name}</strong>
            <div class="text-xs text-muted">
              ${f.calories} kcal | P: ${f.protein}g | C: ${f.carbs}g | F: ${f.fat}g
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.app.addPresetFood('${f.id}')">
            + Add
          </button>
        </div>
      `;
    }).join('');
  }

  addPresetFood(foodId) {
    const food = FOOD_DATABASE.find(f => f.id === foodId);
    if (!food) return;

    const meal = {
      id: "ml_" + Date.now(),
      type: this.currentFoodMealType || "snack",
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.today.meals.push(meal);
    this.save();
    document.getElementById("modal-add-food")?.classList.add("hidden");
    this.renderNutrition();
    this.renderDashboard();
    this.showToast(`Added ${food.name} to ${this.currentFoodMealType}!`, "success");
  }

  handleCustomFoodSubmit() {
    const nameInput = document.getElementById("cf-name");
    const calInput = document.getElementById("cf-calories");
    const pInput = document.getElementById("cf-protein");
    const cInput = document.getElementById("cf-carbs");
    const fInput = document.getElementById("cf-fat");

    const name = nameInput.value.trim();
    const calories = parseInt(calInput.value, 10);
    const protein = parseFloat(pInput.value) || 0;
    const carbs = parseFloat(cInput.value) || 0;
    const fat = parseFloat(fInput.value) || 0;

    if (!name || isNaN(calories)) {
      this.showToast("Please provide at least a food name and calories", "warning");
      return;
    }

    const meal = {
      id: "ml_" + Date.now(),
      type: this.currentFoodMealType || "snack",
      name: name,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.today.meals.push(meal);
    this.save();

    nameInput.value = "";
    calInput.value = "";
    pInput.value = "";
    cInput.value = "";
    fInput.value = "";

    document.getElementById("modal-add-food")?.classList.add("hidden");
    this.renderNutrition();
    this.renderDashboard();
    this.showToast(`Added ${name} (${calories} kcal)`, "success");
  }

  removeMealItem(mealId) {
    this.state.today.meals = (this.state.today.meals || []).filter(m => m.id !== mealId);
    this.save();
    this.renderNutrition();
    this.renderDashboard();
    this.showToast("Food item removed", "info");
  }

  renderNutrition() {
    const meals = this.state.today.meals || [];

    // Macro sums
    let totalCal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    meals.forEach(m => {
      totalCal += m.calories || 0;
      totalP += m.protein || 0;
      totalC += m.carbs || 0;
      totalF += m.fat || 0;
    });

    const goals = this.state.profile.goals;
    const targetCal = goals.dailyCalories || 2400;

    // Render Macro Donut
    FitnessCharts.renderMacroRing("nutrition-macro-donut", totalC, totalP, totalF, totalCal, targetCal);

    // Update numbers
    document.getElementById("nutri-consumed-cal").textContent = `${totalCal} / ${targetCal} kcal`;
    document.getElementById("nutri-protein-sum").textContent = `${totalP.toFixed(0)}g / ${goals.dailyProteinG}g`;
    document.getElementById("nutri-carbs-sum").textContent = `${totalC.toFixed(0)}g / ${goals.dailyCarbsG}g`;
    document.getElementById("nutri-fat-sum").textContent = `${totalF.toFixed(0)}g / ${goals.dailyFatG}g`;

    // Progress bars
    document.getElementById("bar-protein").style.width = `${Math.min(100, (totalP / goals.dailyProteinG) * 100)}%`;
    document.getElementById("bar-carbs").style.width = `${Math.min(100, (totalC / goals.dailyCarbsG) * 100)}%`;
    document.getElementById("bar-fat").style.width = `${Math.min(100, (totalF / goals.dailyFatG) * 100)}%`;

    // Render 4 meal sections
    ["breakfast", "lunch", "dinner", "snack"].forEach(category => {
      const catMeals = meals.filter(m => m.type === category);
      const container = document.getElementById(`meal-list-${category}`);
      if (!container) return;

      if (catMeals.length === 0) {
        container.innerHTML = `<p class="text-muted text-xs italic">No foods logged for ${category}.</p>`;
        return;
      }

      container.innerHTML = catMeals.map(m => {
        return `
          <div class="meal-entry-row">
            <div>
              <span class="meal-entry-name">${m.name}</span>
              <div class="meal-entry-macros text-xs text-muted">
                ${m.calories} kcal | P: ${m.protein}g C: ${m.carbs}g F: ${m.fat}g • ${m.time || ''}
              </div>
            </div>
            <button class="btn-icon text-muted text-xs" onclick="window.app.removeMealItem('${m.id}')">✕</button>
          </div>
        `;
      }).join('');
    });
  }

  // --- INTERVAL & HIIT TIMER ---
  bindTimerEvents() {
    // HIIT Buttons
    const hiitStartBtn = document.getElementById("btn-hiit-start");
    const hiitPauseBtn = document.getElementById("btn-hiit-pause");
    const hiitResetBtn = document.getElementById("btn-hiit-reset");

    if (hiitStartBtn) hiitStartBtn.addEventListener("click", () => this.startHiitTimer());
    if (hiitPauseBtn) hiitPauseBtn.addEventListener("click", () => this.pauseHiitTimer());
    if (hiitResetBtn) hiitResetBtn.addEventListener("click", () => this.resetHiitTimer());

    // HIIT inputs
    ["hiit-prepare", "hiit-work", "hiit-rest", "hiit-rounds"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => {
          if (this.hiitState.status === "idle") {
            this.syncHiitInputs();
          }
        });
      }
    });

    // Stopwatch Buttons
    const swStartBtn = document.getElementById("btn-sw-start");
    const swStopBtn = document.getElementById("btn-sw-stop");
    const swLapBtn = document.getElementById("btn-sw-lap");
    const swResetBtn = document.getElementById("btn-sw-reset");

    if (swStartBtn) swStartBtn.addEventListener("click", () => this.startStopwatch());
    if (swStopBtn) swStopBtn.addEventListener("click", () => this.stopStopwatch());
    if (swLapBtn) swLapBtn.addEventListener("click", () => this.lapStopwatch());
    if (swResetBtn) swResetBtn.addEventListener("click", () => this.resetStopwatch());
  }

  syncHiitInputs() {
    this.hiitState.prepareSec = parseInt(document.getElementById("hiit-prepare")?.value, 10) || 10;
    this.hiitState.workSec = parseInt(document.getElementById("hiit-work")?.value, 10) || 30;
    this.hiitState.restSec = parseInt(document.getElementById("hiit-rest")?.value, 10) || 15;
    this.hiitState.totalRounds = parseInt(document.getElementById("hiit-rounds")?.value, 10) || 8;
    this.hiitState.secondsLeft = this.hiitState.prepareSec;
    this.updateHiitDisplay();
  }

  startHiitTimer() {
    if (this.hiitState.status === "running") return;

    if (this.hiitState.status === "idle") {
      this.syncHiitInputs();
      this.hiitState.phase = "prepare";
      this.hiitState.currentRound = 1;
      this.hiitState.secondsLeft = this.hiitState.prepareSec;
    }

    this.hiitState.status = "running";
    document.getElementById("btn-hiit-start").classList.add("hidden");
    document.getElementById("btn-hiit-pause").classList.remove("hidden");

    clearInterval(this.hiitState.timerId);
    this.hiitState.timerId = setInterval(() => {
      this.hiitTick();
    }, 1000);

    this.updateHiitDisplay();
  }

  hiitTick() {
    this.hiitState.secondsLeft--;

    if (this.hiitState.secondsLeft <= 3 && this.hiitState.secondsLeft > 0) {
      sounds.tick();
    }

    if (this.hiitState.secondsLeft <= 0) {
      // Transition phase
      if (this.hiitState.phase === "prepare") {
        this.hiitState.phase = "work";
        this.hiitState.secondsLeft = this.hiitState.workSec;
        sounds.go();
      } else if (this.hiitState.phase === "work") {
        if (this.hiitState.currentRound >= this.hiitState.totalRounds) {
          // Finished workout!
          this.completeHiitTimer();
          return;
        } else {
          this.hiitState.phase = "rest";
          this.hiitState.secondsLeft = this.hiitState.restSec;
          sounds.restChime();
        }
      } else if (this.hiitState.phase === "rest") {
        this.hiitState.currentRound++;
        this.hiitState.phase = "work";
        this.hiitState.secondsLeft = this.hiitState.workSec;
        sounds.go();
      }
    }

    this.updateHiitDisplay();
  }

  completeHiitTimer() {
    clearInterval(this.hiitState.timerId);
    this.hiitState.status = "idle";
    sounds.success();
    this.showToast("Interval HIIT session complete! Fantastic effort! 🔥", "success");
    this.resetHiitTimer();
  }

  pauseHiitTimer() {
    clearInterval(this.hiitState.timerId);
    this.hiitState.status = "paused";
    document.getElementById("btn-hiit-start").classList.remove("hidden");
    document.getElementById("btn-hiit-pause").classList.add("hidden");
  }

  resetHiitTimer() {
    clearInterval(this.hiitState.timerId);
    this.hiitState.status = "idle";
    this.hiitState.phase = "prepare";
    this.hiitState.currentRound = 1;
    this.syncHiitInputs();
    document.getElementById("btn-hiit-start").classList.remove("hidden");
    document.getElementById("btn-hiit-pause").classList.add("hidden");
    this.updateHiitDisplay();
  }

  updateHiitDisplay() {
    const timeEl = document.getElementById("hiit-time-display");
    const phaseEl = document.getElementById("hiit-phase-badge");
    const roundEl = document.getElementById("hiit-round-counter");
    const container = document.getElementById("hiit-display-card");
    if (!timeEl) return;

    timeEl.textContent = this.hiitState.secondsLeft;

    let phaseText = "PREPARE";
    let phaseClass = "phase-prepare";
    if (this.hiitState.phase === "work") {
      phaseText = "WORK!";
      phaseClass = "phase-work";
    } else if (this.hiitState.phase === "rest") {
      phaseText = "REST";
      phaseClass = "phase-rest";
    }

    if (phaseEl) phaseEl.textContent = phaseText;
    if (roundEl) roundEl.textContent = `Round ${this.hiitState.currentRound} / ${this.hiitState.totalRounds}`;

    if (container) {
      container.className = `hiit-card ${phaseClass}`;
    }
  }

  // --- STOPWATCH ---
  startStopwatch() {
    if (this.stopwatch.running) return;
    this.stopwatch.running = true;
    this.stopwatch.startTime = performance.now() - this.stopwatch.elapsedTime;

    document.getElementById("btn-sw-start").classList.add("hidden");
    document.getElementById("btn-sw-stop").classList.remove("hidden");

    this.stopwatch.timerId = requestAnimationFrame(this.stopwatchLoop.bind(this));
  }

  stopwatchLoop() {
    if (!this.stopwatch.running) return;
    this.stopwatch.elapsedTime = performance.now() - this.stopwatch.startTime;
    this.renderStopwatchTime();
    this.stopwatch.timerId = requestAnimationFrame(this.stopwatchLoop.bind(this));
  }

  formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  }

  renderStopwatchTime() {
    const el = document.getElementById("stopwatch-display");
    if (el) el.textContent = this.formatTime(this.stopwatch.elapsedTime);
  }

  stopStopwatch() {
    this.stopwatch.running = false;
    cancelAnimationFrame(this.stopwatch.timerId);
    document.getElementById("btn-sw-start").classList.remove("hidden");
    document.getElementById("btn-sw-stop").classList.add("hidden");
  }

  lapStopwatch() {
    if (this.stopwatch.elapsedTime === 0) return;
    const lapNum = this.stopwatch.laps.length + 1;
    const currentLapTime = this.stopwatch.elapsedTime;
    const prevLapTime = this.stopwatch.laps.length > 0 ? this.stopwatch.laps[0].totalMs : 0;
    const splitMs = currentLapTime - prevLapTime;

    this.stopwatch.laps.unshift({
      lapNumber: lapNum,
      split: this.formatTime(splitMs),
      total: this.formatTime(currentLapTime),
      totalMs: currentLapTime
    });

    this.renderStopwatchLaps();
  }

  resetStopwatch() {
    this.stopStopwatch();
    this.stopwatch.elapsedTime = 0;
    this.stopwatch.laps = [];
    this.renderStopwatchTime();
    this.renderStopwatchLaps();
  }

  renderStopwatchLaps() {
    const container = document.getElementById("stopwatch-laps");
    if (!container) return;

    if (this.stopwatch.laps.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <table class="laps-table">
        <thead>
          <tr>
            <th>Lap</th>
            <th>Split</th>
            <th>Overall</th>
          </tr>
        </thead>
        <tbody>
          ${this.stopwatch.laps.map(l => `
            <tr>
              <td>Lap ${l.lapNumber}</td>
              <td class="font-mono text-accent">${l.split}</td>
              <td class="font-mono text-muted">${l.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // --- FITNESS CALCULATORS ---
  bindCalculatorEvents() {
    // BMI
    const calcBmiBtn = document.getElementById("btn-calc-bmi");
    if (calcBmiBtn) {
      calcBmiBtn.addEventListener("click", () => this.calculateBMI());
    }

    // BMR
    const calcBmrBtn = document.getElementById("btn-calc-bmr");
    if (calcBmrBtn) {
      calcBmrBtn.addEventListener("click", () => this.calculateBMR());
    }

    // 1RM
    const calc1rmBtn = document.getElementById("btn-calc-1rm");
    if (calc1rmBtn) {
      calc1rmBtn.addEventListener("click", () => this.calculate1RM());
    }
  }

  calculateBMI() {
    const weight = parseFloat(document.getElementById("bmi-weight")?.value);
    const height = parseFloat(document.getElementById("bmi-height")?.value);
    const resultBox = document.getElementById("bmi-result-box");
    if (!weight || !height || !resultBox) return;

    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let category = "Normal weight";
    let badgeClass = "badge-accent";
    if (bmi < 18.5) {
      category = "Underweight";
      badgeClass = "badge-blue";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
      badgeClass = "badge-orange";
    } else if (bmi >= 30) {
      category = "Obesity";
      badgeClass = "badge-red";
    }

    // Ideal range (18.5 - 24.9)
    const minIdeal = (18.5 * heightM * heightM).toFixed(1);
    const maxIdeal = (24.9 * heightM * heightM).toFixed(1);

    resultBox.innerHTML = `
      <div class="calc-metric-value">${bmi}</div>
      <span class="badge ${badgeClass}">${category}</span>
      <p class="text-xs text-muted mt-2">Healthy weight range for ${height}cm: <strong>${minIdeal} - ${maxIdeal} kg</strong></p>
    `;
    resultBox.classList.remove("hidden");
  }

  calculateBMR() {
    const age = parseInt(document.getElementById("bmr-age")?.value, 10);
    const gender = document.getElementById("bmr-gender")?.value || "male";
    const weight = parseFloat(document.getElementById("bmr-weight")?.value);
    const height = parseFloat(document.getElementById("bmr-height")?.value);
    const activity = parseFloat(document.getElementById("bmr-activity")?.value) || 1.375;
    const resultBox = document.getElementById("bmr-result-box");
    if (!age || !weight || !height || !resultBox) return;

    // Mifflin-St Jeor Formula
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === "male" ? 5 : -161);
    const tdee = Math.round(bmr * activity);

    resultBox.innerHTML = `
      <div class="calc-metric-value">${Math.round(bmr)} <span class="text-sm font-normal text-muted">kcal/day</span></div>
      <p class="text-xs text-muted">Basal Metabolic Rate (BMR) at rest</p>
      <div class="mt-3 pt-2 border-t border-border">
        <span class="text-sm font-semibold">TDEE (Daily Maintenance):</span>
        <div class="text-xl font-bold text-accent">${tdee} kcal</div>
        <p class="text-xs text-muted">Weight Loss Target: <strong>${tdee - 400} kcal</strong> | Muscle Gain: <strong>${tdee + 300} kcal</strong></p>
      </div>
    `;
    resultBox.classList.remove("hidden");
  }

  calculate1RM() {
    const weight = parseFloat(document.getElementById("onerm-weight")?.value);
    const reps = parseInt(document.getElementById("onerm-reps")?.value, 10);
    const resultBox = document.getElementById("onerm-result-box");
    if (!weight || !reps || !resultBox) return;

    // Epley Formula: 1RM = Weight * (1 + Reps/30)
    // Brzycki Formula: 1RM = Weight * (36 / (37 - Reps))
    const epley = weight * (1 + reps / 30);
    const brzycki = weight * (36 / (37 - reps));
    const avgOneRM = Math.round((epley + brzycki) / 2);

    const percentages = [95, 90, 85, 80, 75, 70, 60, 50];
    const pctHtml = percentages.map(pct => {
      const load = Math.round(avgOneRM * (pct / 100));
      return `
        <div class="onerm-pct-item">
          <span>${pct}%</span>
          <strong>${load} kg</strong>
        </div>
      `;
    }).join('');

    resultBox.innerHTML = `
      <div class="calc-metric-value">${avgOneRM} <span class="text-sm font-normal text-muted">kg</span></div>
      <p class="text-xs text-muted">Estimated One Rep Max (1RM)</p>
      <div class="onerm-pct-grid mt-3">
        ${pctHtml}
      </div>
    `;
    resultBox.classList.remove("hidden");
  }

  // --- ANALYTICS & LOGS ---
  bindAnalyticsEvents() {
    const addWeightBtn = document.getElementById("btn-add-weight-entry");
    if (addWeightBtn) {
      addWeightBtn.addEventListener("click", () => {
        document.getElementById("modal-add-weight")?.classList.remove("hidden");
        const dateInput = document.getElementById("wt-input-date");
        if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
      });
    }

    const weightForm = document.getElementById("weight-entry-form");
    if (weightForm) {
      weightForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleWeightSubmit();
      });
    }
  }

  handleWeightSubmit() {
    const weightVal = parseFloat(document.getElementById("wt-input-val")?.value);
    const dateVal = document.getElementById("wt-input-date")?.value;
    const bfVal = parseFloat(document.getElementById("wt-input-bf")?.value);
    const notesVal = document.getElementById("wt-input-notes")?.value || "";

    if (!weightVal || !dateVal) {
      this.showToast("Weight and date are required", "warning");
      return;
    }

    // Add or replace entry for same date
    const existingIdx = this.state.weightHistory.findIndex(w => w.date === dateVal);
    const newEntry = {
      id: "wt_" + Date.now(),
      date: dateVal,
      weight: weightVal,
      bodyFat: isNaN(bfVal) ? null : bfVal,
      notes: notesVal
    };

    if (existingIdx >= 0) {
      this.state.weightHistory[existingIdx] = newEntry;
    } else {
      this.state.weightHistory.push(newEntry);
    }

    // Update profile current weight if date is today or latest
    this.state.profile.currentWeightKg = weightVal;
    this.save();

    document.getElementById("modal-add-weight")?.classList.add("hidden");
    this.renderAnalytics();
    this.renderDashboard();
    this.showToast(`Logged weigh-in: ${weightVal} kg!`, "success");
  }

  renderAnalytics() {
    const unit = this.state.settings.units === "imperial" ? "lbs" : "kg";

    // Weight Chart
    FitnessCharts.renderWeightChart("analytics-weight-chart", this.state.weightHistory || [], unit);

    // Stats
    const logs = [...(this.state.weightHistory || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (logs.length > 0) {
      const latest = logs[logs.length - 1].weight;
      const start = logs[0].weight;
      const diff = (latest - start).toFixed(1);
      const sign = diff > 0 ? "+" : "";

      document.getElementById("analytics-latest-wt").textContent = `${latest} ${unit}`;
      document.getElementById("analytics-wt-change").textContent = `${sign}${diff} ${unit}`;
      document.getElementById("analytics-target-wt").textContent = `${this.state.profile.targetWeightKg} ${unit}`;
    }

    // Workout history log
    const woList = document.getElementById("analytics-workout-history-list");
    if (!woList) return;

    if (this.state.workoutHistory.length === 0) {
      woList.innerHTML = `<p class="text-muted text-sm italic">No past workouts recorded yet.</p>`;
      return;
    }

    woList.innerHTML = this.state.workoutHistory.map((wo, idx) => {
      return `
        <div class="card workout-history-card">
          <div class="workout-history-header">
            <div>
              <h4 class="font-bold">${wo.name}</h4>
              <span class="text-xs text-muted">${wo.date} • ${wo.durationMinutes} mins • ${wo.caloriesBurned} kcal burned</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.app.toggleHistoryDetails(${idx})">
              Details
            </button>
          </div>
          <div id="wo-detail-${idx}" class="workout-history-details hidden">
            <p class="text-xs text-muted mb-2">Total Volume: <strong>${wo.totalVolumeKg.toLocaleString()} ${unit}</strong> across <strong>${wo.completedSetsCount}</strong> sets.</p>
            <ul class="text-xs space-y-1">
              ${(wo.exercises || []).map(e => `
                <li><strong>${e.name}</strong>: ${e.sets.filter(s => s.completed).length} sets</li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleHistoryDetails(idx) {
    const el = document.getElementById(`wo-detail-${idx}`);
    if (el) el.classList.toggle("hidden");
  }

  // --- SETTINGS & PROFILE ---
  bindSettingsEvents() {
    // Export Data
    const exportBtn = document.getElementById("btn-export-data");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        StorageManager.exportJSON(this.state);
        this.showToast("Backup file downloaded successfully!", "success");
      });
    }

    // Import Data
    const importInput = document.getElementById("import-file-input");
    if (importInput) {
      importInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const imported = await StorageManager.importJSON(file);
          this.state = imported;
          this.init();
          this.showToast("Data backup successfully restored!", "success");
        } catch (err) {
          this.showToast(`Import error: ${err.message}`, "warning");
        }
      });
    }

    // Reset Demo Data
    const resetDemoBtn = document.getElementById("btn-reset-demo-data");
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        if (confirm("Reset application to rich sample demo data? Any unsaved edits will be refreshed.")) {
          this.state = StorageManager.resetToDemoData();
          this.init();
          this.showToast("Restored demo sample data!", "info");
        }
      });
    }

    // Clear all
    const clearAllBtn = document.getElementById("btn-clear-all-data");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure? This will clear all logged workouts, foods, and weight records!")) {
          this.state = StorageManager.clearAll();
          this.init();
          this.showToast("All user history cleared.", "info");
        }
      });
    }

    // Profile form
    const profileForm = document.getElementById("profile-settings-form");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleProfileSave();
      });
    }
  }

  handleProfileSave() {
    const name = document.getElementById("set-prof-name")?.value || "Athlete";
    const calGoal = parseInt(document.getElementById("set-goal-calories")?.value, 10) || 2400;
    const waterGoal = parseInt(document.getElementById("set-goal-water")?.value, 10) || 3000;
    const stepsGoal = parseInt(document.getElementById("set-goal-steps")?.value, 10) || 10000;
    const targetWt = parseFloat(document.getElementById("set-goal-target-wt")?.value) || 72;

    this.state.profile.name = name;
    this.state.profile.goals.dailyCalories = calGoal;
    this.state.profile.goals.dailyWaterMl = waterGoal;
    this.state.profile.goals.dailySteps = stepsGoal;
    this.state.profile.targetWeightKg = targetWt;

    this.save();
    this.renderAll();
    this.showToast("Profile settings saved!", "success");
  }

  renderSettings() {
    const p = this.state.profile;
    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setEl("set-prof-name", p.name || "");
    setEl("set-goal-calories", p.goals.dailyCalories || 2400);
    setEl("set-goal-water", p.goals.dailyWaterMl || 3000);
    setEl("set-goal-steps", p.goals.dailySteps || 10000);
    setEl("set-goal-target-wt", p.targetWeightKg || 70);
  }

  renderAll() {
    this.renderDashboard();
    this.renderRoutines();
    this.renderNutrition();
    this.renderAnalytics();
    this.renderSettings();
  }
}

// Global modal close utility
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new PulseFitApp();
});
