/**
 * Procedural Web Audio API Ambient Sound Synthesizer
 * Provides zero-dependency, ultra-reliable background audio for:
 * 1. Coffee Shop Ambience (warm room tone, steam hiss, gentle cafe chatter cadence, cup clinks)
 * 2. Lofi Beats (mellow rhodes electric piano chords, subtle vinyl crackle, warm sub bass groove)
 * 3. Rain & Espresso (gentle rainfall white/pink noise, cozy acoustic resonance)
 * 4. Acoustic Lounge (smooth acoustic picking arpeggios with warm room reverberation)
 */

export type AmbientTrackId = 'coffee-shop' | 'lofi-beats' | 'rain-espresso' | 'acoustic-lounge';

export interface AmbientTrack {
  id: AmbientTrackId;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'coffee-shop',
    name: 'Coffee Shop Ambience',
    subtitle: 'Steamer hiss, warm chatter & cafe hum',
    icon: '☕',
    color: 'text-amber-400'
  },
  {
    id: 'lofi-beats',
    name: 'Lofi Chill Beats',
    subtitle: 'Mellow Rhodes chords & vinyl warmth',
    icon: '🎧',
    color: 'text-purple-400'
  },
  {
    id: 'rain-espresso',
    name: 'Rain & Espresso',
    subtitle: 'Gentle raindrops & warm cafe refuge',
    icon: '🌧️',
    color: 'text-cyan-400'
  },
  {
    id: 'acoustic-lounge',
    name: 'Acoustic Lounge',
    subtitle: 'Warm nylon guitar & subtle acoustic reverb',
    icon: '🎸',
    color: 'text-emerald-400'
  }
];

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrack: AmbientTrackId = 'coffee-shop';
  private volume: number = 0.5;
  private loopInterval: number | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): AmbientTrackId {
    return this.currentTrack;
  }

  public async startTrack(trackId: AmbientTrackId) {
    this.initContext();
    this.stopCurrentSounds();
    this.currentTrack = trackId;
    this.isPlaying = true;

    if (!this.ctx || !this.masterGain) return;

    switch (trackId) {
      case 'coffee-shop':
        this.playCoffeeShopAmbience();
        break;
      case 'lofi-beats':
        this.playLofiBeats();
        break;
      case 'rain-espresso':
        this.playRainEspresso();
        break;
      case 'acoustic-lounge':
        this.playAcousticLounge();
        break;
    }
  }

  public stop() {
    this.isPlaying = false;
    this.stopCurrentSounds();
  }

  private stopCurrentSounds() {
    if (this.loopInterval) {
      window.clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.activeNodes.forEach((item) => {
      if (typeof item === 'number') {
        window.clearTimeout(item);
      } else {
        try {
          if ('stop' in item && typeof (item as any).stop === 'function') {
            (item as any).stop();
          }
          item.disconnect();
        } catch (e) {
          // ignore already stopped nodes
        }
      }
    });
    this.activeNodes = [];
  }

  /**
   * Helper: Generate a continuous noise buffer (Brown / Pink / White)
   */
  private createNoiseBuffer(type: 'pink' | 'brown' | 'white' = 'pink'): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * 4; // 4 seconds looping buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        data[i] = white * 0.15;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 0.6;
      }
    }
    return buffer;
  }

  // 1. Track: Coffee Shop Ambience
  private playCoffeeShopAmbience() {
    if (!this.ctx || !this.masterGain) return;

    // A. Warm room rumble / low-pass brown noise
    const roomNoiseBuffer = this.createNoiseBuffer('brown');
    const roomSource = this.ctx.createBufferSource();
    roomSource.buffer = roomNoiseBuffer;
    roomSource.loop = true;

    const roomFilter = this.ctx.createBiquadFilter();
    roomFilter.type = 'lowpass';
    roomFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const roomGain = this.ctx.createGain();
    roomGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    roomSource.connect(roomFilter);
    roomFilter.connect(roomGain);
    roomGain.connect(this.masterGain);
    roomSource.start();
    this.activeNodes.push(roomSource, roomFilter, roomGain);

    // B. Periodic Espresso Steam Wand Hiss & Ceramic Clinks
    const triggerAtmosphere = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const action = Math.random();

      // Steam hiss
      if (action > 0.4) {
        const steamBuffer = this.createNoiseBuffer('pink');
        const steamSrc = this.ctx.createBufferSource();
        steamSrc.buffer = steamBuffer;

        const steamFilter = this.ctx.createBiquadFilter();
        steamFilter.type = 'bandpass';
        steamFilter.frequency.setValueAtTime(1400 + Math.random() * 600, this.ctx.currentTime);
        steamFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

        const steamGain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        const dur = 1.2 + Math.random() * 1.5;
        steamGain.gain.setValueAtTime(0.001, now);
        steamGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        steamGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        steamSrc.connect(steamFilter);
        steamFilter.connect(steamGain);
        steamGain.connect(this.masterGain);
        steamSrc.start(now);
        steamSrc.stop(now + dur);
      }

      // Ceramic cup clink (resonant sine ping)
      if (action < 0.6) {
        const osc = this.ctx.createOscillator();
        const clinkGain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        const freq = 1800 + Math.random() * 1200;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        clinkGain.gain.setValueAtTime(0.03, now);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(clinkGain);
        clinkGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    };

    this.loopInterval = window.setInterval(triggerAtmosphere, 2400);
  }

  // 2. Track: Lofi Chill Beats
  private playLofiBeats() {
    if (!this.ctx || !this.masterGain) return;

    // A. Vinyl Crackle
    const vinylBuffer = this.createNoiseBuffer('pink');
    const vinylSource = this.ctx.createBufferSource();
    vinylSource.buffer = vinylBuffer;
    vinylSource.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'highpass';
    vinylFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(vinylGain);
    vinylGain.connect(this.masterGain);
    vinylSource.start();
    this.activeNodes.push(vinylSource, vinylFilter, vinylGain);

    // B. Warm Rhodes Chord Progression (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
      [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7 (C3, E3, G3, B3)
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const currentNotes = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;
      const duration = 2.8;

      currentNotes.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i === 0 ? 'triangle' : 'sine';
        // Add subtle lofi detune/chorus
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.2, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650 + Math.random() * 100, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });

      // Soft Sub-bass kick & rim tap
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(currentNotes[0] / 2, now);
      subGain.gain.setValueAtTime(0.08, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.9);
    };

    playChord();
    this.loopInterval = window.setInterval(playChord, 3000);
  }

  // 3. Track: Rain & Espresso
  private playRainEspresso() {
    if (!this.ctx || !this.masterGain) return;

    // A. Constant gentle rainfall
    const rainBuffer = this.createNoiseBuffer('pink');
    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.16, this.ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    rainSource.start();
    this.activeNodes.push(rainSource, rainFilter, rainGain);

    // B. Warm distant cafe drone
    const drone = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    drone.type = 'triangle';
    drone.frequency.setValueAtTime(110, this.ctx.currentTime);
    droneGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();
    this.activeNodes.push(drone, droneGain);
  }

  // 4. Track: Acoustic Lounge
  private playAcousticLounge() {
    if (!this.ctx || !this.masterGain) return;

    const notes = [220.00, 261.63, 329.63, 392.00, 440.00, 523.25]; // Am pentatonic notes
    let step = 0;

    const pluckString = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const freq = notes[step % notes.length];
      step = (step + Math.floor(1 + Math.random() * 3)) % notes.length;
      const now = this.ctx.currentTime;
      const dur = 1.6;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + dur);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + dur + 0.1);
    };

    pluckString();
    this.loopInterval = window.setInterval(pluckString, 850);
  }
}

export const ambientAudio = new AmbientAudioEngine();
