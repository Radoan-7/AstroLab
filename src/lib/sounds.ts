import { Howl } from 'howler';

// Retro "Among Us"-inspired sound effects using Web Audio API synthesis
class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initializeSounds();
    }
  }

  private createRetroSound(frequency: number, duration: number, type: OscillatorType = 'square'): Blob {
    if (!this.audioContext) return new Blob();

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3);
      channel[i] = value * 0.3;
    }

    // Convert to WAV-like blob (simplified)
    const blob = new Blob([channel], { type: 'audio/wav' });
    return blob;
  }

  private initializeSounds() {
    this.sounds.set('buttonHover', new Howl({
      src: ['/sounds/buttonHover.mp3'],
      volume: 0.3,
    }));

    this.sounds.set('buttonClick', new Howl({
      src: ['/sounds/buttonClick.mp3'],
      volume: 0.4,
    }));

    this.sounds.set('choiceSelect', new Howl({
      src: ['/sounds/choiceSelect.mp3'],
      volume: 0.5,
    }));

    this.sounds.set('newAct', new Howl({
      src: ['/sounds/newAct.mp3'],
      volume: 0.6,
    }));

    this.sounds.set('impactWarning', new Howl({
      src: ['/sounds/impactWarning.mp3'],
      volume: 0.5,
    }));

    this.sounds.set('badgeUnlock', new Howl({
      src: ['/sounds/badgeUnlock.mp3'],
      volume: 0.6,
    }));
  }

  play(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  // Placeholder for voice-over narration
  playNarration(actId: string) {
    const narration = new Howl({
      src: [`/narration/${actId}.mp3`],
      volume: 0.8,
    });
    narration.play();
  }

  stopNarration() {
    // Stop any currently playing narration
    console.log('[NARRATION PLACEHOLDER] Stopping narration');
  }
}

export const soundManager = new SoundManager();

// Instructions for adding real sound files:
// 1. Create /public/sounds/ directory
// 2. Add your retro sound effects as .mp3 or .wav files:
//    - buttonHover.mp3
//    - buttonClick.mp3
//    - choiceSelect.mp3
//    - newAct.mp3
//    - impactWarning.mp3
//    - badgeUnlock.mp3
// 3. Update the initializeSounds() method to use real file paths:
//    Example: src: ['/sounds/buttonHover.mp3']
//
// For narration:
// 1. Create /public/narration/ directory
// 2. Add voice-over files named: act1.mp3, act2.mp3, etc.
// 3. Update playNarration() to load the actual files
