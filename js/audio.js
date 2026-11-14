// Web Audio API Synthesizer for PulseFit
// 100% Offline, Zero external media files needed

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  // Short warning beep (for 3, 2, 1 countdowns)
  tick() {
    this.playTone(880, "sine", 0.12, 0, 0.12); // A5 note
  }

  // High action tone (GO! or Work interval starts)
  go() {
    this.playTone(1760, "sine", 0.35, 0, 0.22); // A6 note
  }

  // Rest interval chime
  restChime() {
    this.playTone(523.25, "triangle", 0.18, 0, 0.15); // C5
    this.playTone(659.25, "triangle", 0.3, 0.1, 0.15); // E5
  }

  // Rest completed alert (double beep)
  restComplete() {
    this.playTone(1046.5, "sine", 0.15, 0, 0.2); // C6
    this.playTone(1318.5, "sine", 0.25, 0.12, 0.25); // E6
  }

  // Celebratory fanfare for workout complete or goal reached
  success() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, "triangle", 0.3, idx * 0.1, 0.18);
    });
  }

  // Water drop synthetic sound
  waterDrop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      // Quick pitch slide upwards mimicking a water bubble
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Water audio error:", e);
    }
  }
}

// Global Sound instance
const sounds = new SoundEffects();
