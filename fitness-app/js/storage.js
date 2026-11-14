// LocalStorage & State Persistence Layer for PulseFit

const STORAGE_KEY = "pulsefit_user_data_v1";

class StorageManager {
  static load() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        const initialState = generateInitialState();
        StorageManager.save(initialState);
        return initialState;
      }
      const parsed = JSON.parse(dataStr);
      // Ensure daily check is performed (day change detection)
      return StorageManager.validateAndSyncDate(parsed);
    } catch (e) {
      console.error("Failed to parse localStorage data, restoring initial state:", e);
      const fresh = generateInitialState();
      StorageManager.save(fresh);
      return fresh;
    }
  }

  static save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }

  static validateAndSyncDate(state) {
    const todayStr = new Date().toISOString().split("T")[0];
    if (!state.today || state.today.date !== todayStr) {
      // Check if lastActiveDate was yesterday to increment or reset streak
      if (state.lastActiveDate) {
        const lastDate = new Date(state.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // Continuous streak!
        } else if (diffDays > 1) {
          state.currentStreak = 1;
        }
      }

      state.today = {
        date: todayStr,
        waterMl: 0,
        steps: 0,
        activeWorkoutMinutes: 0,
        caloriesBurned: 0,
        meals: []
      };
      state.lastActiveDate = todayStr;
      StorageManager.save(state);
    }
    return state;
  }

  static exportJSON(state) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PulseFit_Backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported && imported.profile && imported.today) {
            StorageManager.save(imported);
            resolve(imported);
          } else {
            reject(new Error("Invalid PulseFit backup file format."));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("File read error."));
      reader.readAsText(file);
    });
  }

  static resetToDemoData() {
    const demo = generateInitialState();
    StorageManager.save(demo);
    return demo;
  }

  static clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = generateInitialState();
    // Empty out sample history
    fresh.weightHistory = [fresh.weightHistory[fresh.weightHistory.length - 1]];
    fresh.workoutHistory = [];
    fresh.today.meals = [];
    fresh.today.waterMl = 0;
    fresh.today.steps = 0;
    fresh.today.caloriesBurned = 0;
    fresh.today.activeWorkoutMinutes = 0;
    fresh.currentStreak = 1;
    StorageManager.save(fresh);
    return fresh;
  }
}
