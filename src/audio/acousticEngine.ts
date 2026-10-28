/**
 * GreenGuard On-Device Acoustic Early Warning Engine
 * Analyzes live microphone input, uploaded audio files, or synthesized test signals
 * using Web Audio API FFT frequency analysis and rule-based heuristics.
 */

export interface AcousticAnalysisFrame {
  volumeDb: number;
  rms: number;
  spectrum: number[]; // 0 to 255 normalized frequency bins
  flagChainsaw: boolean;
  flagAxeImpact: boolean;
  heuristicVerdict: 'normal' | 'chainsaw' | 'axe-impact';
  confidenceScore: number;
  dominantFrequencyHz: number;
}

export class AcousticEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | AudioBufferSourceNode | OscillatorNode | null = null;
  private isRunning = false;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;

  // Heuristic state trackers
  private sustainedChainsawFrames = 0;
  private axeStrikeCount = 0;
  private lastStrikeTime = 0;

  constructor() {
    // Lazy AudioContext initialization on user gesture
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public async startMicrophone(onFrame: (frame: AcousticAnalysisFrame) => void): Promise<boolean> {
    try {
      this.initContext();
      if (!this.audioCtx) return false;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.75;

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      // Start recording buffer for optional Gemini transmission (max 15s)
      try {
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.mediaStream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.recordedChunks.push(e.data);
        };
        this.mediaRecorder.start(1000);
      } catch (e) {
        console.warn('MediaRecorder not available or permitted', e);
      }

      this.isRunning = true;
      this.startAnalysisLoop(onFrame);
      return true;
    } catch (err) {
      console.error('Microphone access failed:', err);
      return false;
    }
  }

  public async loadAudioFile(file: File, onFrame: (frame: AcousticAnalysisFrame) => void): Promise<boolean> {
    try {
      this.initContext();
      if (!this.audioCtx) return false;

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

      this.stop();
      this.initContext();

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.75;

      const bufferSource = this.audioCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = true;
      bufferSource.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      bufferSource.start();

      this.sourceNode = bufferSource;
      this.isRunning = true;
      this.startAnalysisLoop(onFrame);
      return true;
    } catch (err) {
      console.error('Audio file decode failed:', err);
      return false;
    }
  }

  public playSynthesizedSignal(type: 'chainsaw' | 'axe' | 'forest', onFrame: (frame: AcousticAnalysisFrame) => void) {
    this.stop();
    this.initContext();
    if (!this.audioCtx) return;

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.6;

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime); // gentle pleasant volume

    if (type === 'chainsaw') {
      // Sawtooth oscillator + bandpass filter around 1800-2400Hz
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);

      // Modulator for two-stroke vibration
      const mod = this.audioCtx.createOscillator();
      mod.frequency.setValueAtTime(35, this.audioCtx.currentTime);
      const modGain = this.audioCtx.createGain();
      modGain.gain.setValueAtTime(25, this.audioCtx.currentTime);
      mod.connect(modGain);
      modGain.connect(osc.frequency);
      mod.start();

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2100, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(4.0, this.audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      osc.start();
      this.sourceNode = osc;
    } else if (type === 'axe') {
      // Periodic percussive burst generator
      const osc = this.audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);

      const pGain = this.audioCtx.createGain();
      pGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);

      // Repeat strikes every 0.9s
      const strikeInterval = setInterval(() => {
        if (!this.isRunning || !this.audioCtx) {
          clearInterval(strikeInterval);
          return;
        }
        const now = this.audioCtx.currentTime;
        pGain.gain.cancelScheduledValues(now);
        pGain.gain.setValueAtTime(0.2, now);
        pGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      }, 900);

      osc.connect(pGain);
      pGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      osc.start();
      this.sourceNode = osc;
    } else {
      // Forest birds / gentle wind breeze pink noise
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.04;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      noise.connect(gainNode);
      gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      noise.start();
      this.sourceNode = noise;
    }

    this.isRunning = true;
    this.startAnalysisLoop(onFrame);
  }

  private startAnalysisLoop(onFrame: (frame: AcousticAnalysisFrame) => void) {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount; // 128 bins
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Uint8Array(bufferLength);

    const step = () => {
      if (!this.isRunning || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);
      this.analyser.getByteTimeDomainData(timeDomainArray);

      // 1. Calculate RMS and Volume in dB
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const norm = (timeDomainArray[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      const volumeDb = Math.max(-90, Math.round(20 * Math.log10(Math.max(rms, 1e-4))));

      // 2. Dominant frequency calculation
      const sampleRate = this.audioCtx?.sampleRate || 44100;
      const nyquist = sampleRate / 2;
      const binWidth = nyquist / bufferLength;

      let maxVal = 0;
      let maxBin = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i];
          maxBin = i;
        }
      }
      const dominantFrequencyHz = Math.round(maxBin * binWidth);

      // 3. Rule-based Heuristic 1: Chainsaw Detection
      // Chainsaw shows high persistent harmonic energy in 1.4kHz to 3.2kHz
      const binStartChainsaw = Math.floor(1400 / binWidth);
      const binEndChainsaw = Math.floor(3200 / binWidth);
      let chainsawBandEnergy = 0;
      let chainsawBinCount = 0;
      for (let i = binStartChainsaw; i <= binEndChainsaw && i < bufferLength; i++) {
        chainsawBandEnergy += dataArray[i];
        chainsawBinCount++;
      }
      const avgChainsawBand = chainsawBinCount > 0 ? chainsawBandEnergy / chainsawBinCount : 0;

      if (avgChainsawBand > 95 && volumeDb > -45) {
        this.sustainedChainsawFrames++;
      } else {
        this.sustainedChainsawFrames = Math.max(0, this.sustainedChainsawFrames - 1);
      }
      const flagChainsaw = this.sustainedChainsawFrames >= 8;

      // 4. Rule-based Heuristic 2: Axe Impact Detection
      // Axe impact shows transient impulse spikes in low-mid band 200Hz - 700Hz
      const binStartAxe = Math.floor(200 / binWidth);
      const binEndAxe = Math.floor(750 / binWidth);
      let axeEnergy = 0;
      let axeBinCount = 0;
      for (let i = binStartAxe; i <= binEndAxe && i < bufferLength; i++) {
        axeEnergy += dataArray[i];
        axeBinCount++;
      }
      const avgAxeBand = axeBinCount > 0 ? axeEnergy / axeBinCount : 0;
      const now = performance.now();

      if (avgAxeBand > 120 && rms > 0.12) {
        if (now - this.lastStrikeTime > 500 && now - this.lastStrikeTime < 2500) {
          this.axeStrikeCount++;
          this.lastStrikeTime = now;
        } else if (now - this.lastStrikeTime > 2500) {
          this.axeStrikeCount = 1;
          this.lastStrikeTime = now;
        }
      }
      const flagAxeImpact = this.axeStrikeCount >= 3;

      let heuristicVerdict: AcousticAnalysisFrame['heuristicVerdict'] = 'normal';
      let confidenceScore = 0.5;

      if (flagChainsaw) {
        heuristicVerdict = 'chainsaw';
        confidenceScore = Math.min(0.94, 0.75 + (this.sustainedChainsawFrames / 20) * 0.19);
      } else if (flagAxeImpact) {
        heuristicVerdict = 'axe-impact';
        confidenceScore = Math.min(0.92, 0.70 + (this.axeStrikeCount / 6) * 0.22);
      } else {
        confidenceScore = 0.95; // high confidence it's normal forest/ambient
      }

      const spectrumArray = Array.from(dataArray);

      onFrame({
        volumeDb,
        rms,
        spectrum: spectrumArray,
        flagChainsaw,
        flagAxeImpact,
        heuristicVerdict,
        confidenceScore,
        dominantFrequencyHz,
      });

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  public async getRecordedAudioBase64(): Promise<{ base64: string; mimeType: string } | null> {
    if (this.recordedChunks.length === 0) {
      // If no mic recording chunks, generate a representative webm/wav representation
      return null;
    }
    const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          base64: reader.result as string,
          mimeType: 'audio/webm',
        });
      };
      reader.readAsDataURL(blob);
    });
  }

  public stop() {
    this.isRunning = false;
    this.sustainedChainsawFrames = 0;
    this.axeStrikeCount = 0;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }
  }
}
