import { BiomeId } from './types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private muted = false;

  private bgmAudio: HTMLAudioElement | null = null;
  private deathAudio: HTMLAudioElement | null = null;
  private bgmDesired = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -16;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.005;
      this.compressor.release.value = 0.12;
      this.compressor.connect(this.ctx.destination);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.85;
      this.masterGain.connect(this.compressor);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private ensureAudioElements(): void {
    if (typeof window === 'undefined') return;
    if (!this.bgmAudio) {
      const bgm = new Audio('/assets/audio/bgm_overworld.mp3');
      bgm.loop = true;
      bgm.preload = 'auto';
      bgm.volume = 0.65;
      bgm.muted = this.muted;
      this.bgmAudio = bgm;
    }
    if (!this.deathAudio) {
      const death = new Audio('/assets/audio/mario_death.mp3');
      death.loop = false;
      death.preload = 'auto';
      death.volume = 0.92;
      death.muted = this.muted;
      this.deathAudio = death;
    }
  }

  public unlock(): void {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    this.ensureAudioElements();
    if (this.bgmDesired && this.bgmAudio && this.bgmAudio.paused && !this.muted) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 0.85, this.ctx.currentTime, 0.02);
    }
    if (this.bgmAudio) {
      this.bgmAudio.muted = mute;
    }
    if (this.deathAudio) {
      this.deathAudio.muted = mute;
    }
  }

  public toggleMute(): boolean {
    this.unlock();
    this.setMuted(!this.muted);
    return this.muted;
  }

  private playTone(
    freqStart: number,
    freqEnd: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freqStart), now);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.025);
  }

  private playNoise(duration: number, volume: number, highpassHz = 1200): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = highpassHz;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  public playUiClick(): void {
    this.unlock();
    this.playTone(620, 880, 0.06, 'square', 0.16);
  }

  public playSelect(): void {
    this.unlock();
    this.playTone(523.25, 783.99, 0.08, 'triangle', 0.22);
  }

  public playJump(): void {
    this.playTone(250, 580, 0.13, 'square', 0.2);
    this.playTone(320, 700, 0.11, 'triangle', 0.16, 0.01);
  }

  public playDoubleJump(): void {
    this.playTone(440, 920, 0.12, 'square', 0.18);
    this.playTone(640, 1080, 0.1, 'sine', 0.16, 0.02);
  }

  public playWallJump(): void {
    this.playNoise(0.04, 0.14, 1800);
    this.playTone(340, 760, 0.12, 'square', 0.18);
  }

  public playCoin(): void {
    this.playTone(987.77, 987.77, 0.06, 'square', 0.22, 0);
    this.playTone(1318.51, 1318.51, 0.16, 'square', 0.22, 0.055);
  }

  public playCoinBounce(): void {
    this.playTone(1180, 880, 0.045, 'triangle', 0.15);
  }

  public playCoinDrop(): void {
    this.playTone(760, 320, 0.11, 'triangle', 0.18);
  }

  public playKey(): void {
    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((n, idx) => {
      this.playTone(n, n, 0.09, 'square', 0.2, idx * 0.055);
    });
  }

  public playHeart(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, n * 1.02, 0.1, 'triangle', 0.26, idx * 0.06);
    });
  }

  public playStomp(): void {
    this.playNoise(0.06, 0.2, 600);
    this.playTone(260, 110, 0.12, 'sawtooth', 0.22);
    this.playTone(360, 520, 0.1, 'square', 0.16, 0.04);
  }

  public playSpring(): void {
    this.playTone(200, 920, 0.22, 'triangle', 0.28);
    this.playTone(260, 1080, 0.18, 'square', 0.14, 0.02);
  }

  public playBlockHit(): void {
    this.playTone(320, 180, 0.08, 'square', 0.2);
    this.playTone(680, 960, 0.09, 'triangle', 0.16, 0.03);
  }

  public playHurt(): void {
    this.playNoise(0.12, 0.22, 350);
    this.playTone(280, 95, 0.2, 'sawtooth', 0.26);
    this.playTone(190, 75, 0.22, 'square', 0.18, 0.03);
  }

  public playSplash(): void {
    this.playNoise(0.16, 0.2, 900);
    this.playTone(440, 180, 0.14, 'sine', 0.18);
  }

  public playCheckpoint(): void {
    this.playTone(587.33, 587.33, 0.08, 'triangle', 0.24, 0);
    this.playTone(880, 880, 0.16, 'triangle', 0.24, 0.07);
  }

  public playDash(): void {
    this.playNoise(0.08, 0.18, 1600);
    this.playTone(460, 210, 0.11, 'triangle', 0.2);
  }

  public playPowerUp(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((n, idx) => {
      this.playTone(n, n * 1.03, 0.09, 'square', 0.2, idx * 0.05);
    });
  }

  public playBossHit(): void {
    this.playNoise(0.1, 0.26, 400);
    this.playTone(220, 90, 0.18, 'sawtooth', 0.28);
    this.playTone(480, 720, 0.1, 'square', 0.18, 0.04);
  }

  public playBonusFanfare(): void {
    const notes = [783.99, 987.77, 1174.66, 1567.98];
    notes.forEach((n, idx) => {
      this.playTone(n, n, 0.12, 'square', 0.22, idx * 0.06);
    });
  }

  public playLevelClear(): void {
    const melody = [
      { f: 523.25, d: 0.11, t: 0 },
      { f: 659.25, d: 0.11, t: 0.1 },
      { f: 783.99, d: 0.11, t: 0.2 },
      { f: 1046.5, d: 0.28, t: 0.3 },
      { f: 783.99, d: 0.11, t: 0.52 },
      { f: 1046.5, d: 0.42, t: 0.63 },
    ];
    for (const m of melody) {
      this.playTone(m.f, m.f, m.d, 'square', 0.24, m.t);
      this.playTone(m.f * 0.5, m.f * 0.5, m.d, 'triangle', 0.22, m.t);
    }
  }

  public playGameOver(): void {
    this.unlock();
    this.ensureAudioElements();
    if (this.deathAudio && !this.muted) {
      try {
        this.deathAudio.currentTime = 0;
        this.deathAudio.play().catch(() => {});
        return;
      } catch {
        // Fallback below
      }
    }
    const lead = [
      { f: 523.25, d: 0.18, t: 0.04 },
      { f: 392.0, d: 0.18, t: 0.24 },
      { f: 329.63, d: 0.26, t: 0.44 },
      { f: 440.0, d: 0.12, t: 0.74 },
      { f: 493.88, d: 0.12, t: 0.87 },
      { f: 440.0, d: 0.14, t: 1.0 },
      { f: 415.3, d: 0.15, t: 1.16 },
      { f: 466.16, d: 0.15, t: 1.32 },
      { f: 415.3, d: 0.16, t: 1.48 },
      { f: 392.0, d: 0.62, t: 1.66 },
    ];
    for (const n of lead) {
      this.playTone(n.f, n.f * 0.99, n.d, 'square', 0.26, n.t);
    }
  }

  public startBgm(_biome?: BiomeId): void {
    this.bgmDesired = true;
    this.ensureAudioElements();
    if (this.bgmAudio && !this.muted) {
      if (this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    }
  }

  public setBgmBiome(_biome: BiomeId): void {
    // Full Overworld BGM plays continuously across all menus and levels
  }

  public stopBgm(): void {
    this.bgmDesired = false;
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
  }

  public restartBgm(): void {
    this.bgmDesired = true;
    this.ensureAudioElements();
    if (this.bgmAudio) {
      this.bgmAudio.currentTime = 0;
      if (!this.muted) {
        this.bgmAudio.play().catch(() => {});
      }
    }
  }
}

export const soundEngine = new SoundEngine();
