/**
 * Web Audio API synthesizer for button touches, transit chimes, and alerts.
 * Works natively in all modern browsers without external audio files.
 */

let isAudioMuted = false;
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  return isAudioMuted;
}

export function toggleSound(): boolean {
  isAudioMuted = !isAudioMuted;
  if (!isAudioMuted) {
    playChimeSound();
  }
  return isAudioMuted;
}

export function setSoundMuted(muted: boolean): void {
  isAudioMuted = muted;
}

/**
 * Modern soft tactile click sound for buttons and touches
 */
export function playClickSound(freq = 640): void {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // AudioContext silenced or disabled
  }
}

/**
 * Harmonious transit announcement chime (E5 -> B5 -> G#5)
 */
export function playChimeSound(): void {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [659.25, 830.61, 987.77]; // E5, G#5, B5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.36);
    });
  } catch {
    // Silently ignore
  }
}

/**
 * Success fanfare for ticket payment & pass generation
 */
export function playSuccessSound(): void {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
    });
  } catch {
    // Ignore
  }
}

/**
 * Subtle caution alert tone for breakdown or surge warning
 */
export function playAlertSound(): void {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    [440, 392].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.11);
    });
  } catch {
    // Ignore
  }
}
