import { AlertRule, HUDNotification } from "@/types";

export class AudioAlertSynthesizer {
  private static audioCtx: AudioContext | null = null;

  private static getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public static playChime(type: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS" = "INFO") {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "SUCCESS") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.08); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "WARNING") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440.0, now); // A4
        osc.frequency.setValueAtTime(415.3, now + 0.1); // G#4
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "CRITICAL") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880.0, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(880.0, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio playback fails gracefully if uninitialized by user gesture
    }
  }
}

export function evaluateAlertRule(
  rule: AlertRule,
  currentValue: number
): HUDNotification | null {
  if (!rule.enabled) return null;

  let triggered = false;

  switch (rule.condition) {
    case "GREATER_THAN":
      triggered = currentValue > rule.threshold;
      break;
    case "LESS_THAN":
      triggered = currentValue < rule.threshold;
      break;
    case "CROSS_ABOVE":
      triggered = currentValue >= rule.threshold;
      break;
    case "CROSS_BELOW":
      triggered = currentValue <= rule.threshold;
      break;
    default:
      triggered = false;
  }

  if (triggered) {
    if (rule.soundEnabled) {
      AudioAlertSynthesizer.playChime(rule.category === "VIX_REGIME" ? "CRITICAL" : "WARNING");
    }

    return {
      id: `alert-${Date.now()}`,
      title: `Rule Triggered: ${rule.name}`,
      message: `${rule.category} condition met (Current Value: ${currentValue}, Threshold: ${rule.threshold}).`,
      severity: rule.category === "VIX_REGIME" ? "CRITICAL" : "WARNING",
      category: rule.category,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
    };
  }

  return null;
}
