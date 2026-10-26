/**
 * In-browser Nepali Music Synthesizer powered by Web Audio API.
 * 100% Free of Cost - runs entirely in the browser without requiring external paid audio APIs.
 */

class NepaliAudioEngine {
    private ctx: AudioContext | null = null;
    private isRunning: boolean = false;
    private timerId: number | null = null;
    private currentBeat: number = 0;
    private currentDuration: number = 180;
    private onTickCallback: ((time: number) => void) | null = null;
    private onStopCallback: (() => void) | null = null;
    private elapsedSeconds: number = 0;

    private getContext(): AudioContext {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    // Melodic notes in Pahadi / Nepali Pentatonic scale: Sa, Re, Ga, Pa, Dha (C4, D4, E4, G4, A4, C5, D5, E5)
    private melodyNotes: number[] = [
        261.63, // C4 (Sa)
        293.66, // D4 (Re)
        329.63, // E4 (Ga)
        392.00, // P4 (Pa)
        440.00, // A4 (Dha)
        523.25, // C5 (Sa')
        587.33, // D5 (Re')
        659.25  // E5 (Ga')
    ];

    private melodySequence: number[] = [
        0, 1, 2, 3, 2, 1, 0, 4,
        3, 2, 3, 5, 4, 3, 2, 1,
        0, 2, 3, 4, 5, 4, 3, 2,
        1, 0, 4, 3, 2, 1, 0, 0
    ];

    // Play a gentle flute note (Bansuri style with vibrato)
    private playFluteNote(freq: number, duration: number, time: number) {
        if (!this.ctx) return;
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Vibrato LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, time); // 5.5 Hz vibrato
        lfoGain.gain.setValueAtTime(4.5, time);
        lfo.connect(osc.frequency);
        lfo.start(time);
        lfo.stop(time + duration);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, time);

        // Soft flute envelope (attack and gentle decay)
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.22, time + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, time + duration * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
    }

    // Play acoustic chord arpeggio (Sarangi / Acoustic Drone)
    private playAcousticPluck(freq: number, time: number) {
        if (!this.ctx) return;
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 1.0);
    }

    // Gentle Madal / Tabla percussion rhythm
    private playPercussion(isDeep: boolean, time: number) {
        if (!this.ctx) return;
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isDeep ? 'sine' : 'triangle';
        const startFreq = isDeep ? 110 : 280;
        const endFreq = isDeep ? 45 : 120;

        osc.frequency.setValueAtTime(startFreq, time);
        osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.12);

        gain.gain.setValueAtTime(isDeep ? 0.28 : 0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.16);
    }

    public startPlayback(durationSec: number = 180, onTick?: (sec: number) => void, onStop?: () => void) {
        this.getContext();
        this.stopPlayback();
        this.isRunning = true;
        this.currentDuration = durationSec;
        this.onTickCallback = onTick || null;
        this.onStopCallback = onStop || null;
        this.elapsedSeconds = 0;
        this.currentBeat = 0;

        const beatIntervalMs = 450; // ~133 BPM upbeat Nepali folk tempo
        const scheduleAudio = () => {
            if (!this.isRunning || !this.ctx) return;
            const now = this.ctx.currentTime;

            // 1. Melody Note
            const noteIdx = this.melodySequence[this.currentBeat % this.melodySequence.length];
            const freq = this.melodyNotes[noteIdx];
            this.playFluteNote(freq, 0.42, now);

            // 2. Harmonic chord backing every 2 beats
            if (this.currentBeat % 2 === 0) {
                const rootFreq = (this.currentBeat % 8 < 4) ? 130.81 : 146.83; // C3 or D3
                this.playAcousticPluck(rootFreq, now);
                this.playAcousticPluck(rootFreq * 1.5, now + 0.15); // Fifth
            }

            // 3. Madal / Tabla percussion beat
            const isDownbeat = (this.currentBeat % 4 === 0);
            const isOffbeat = (this.currentBeat % 2 === 1);
            if (isDownbeat) {
                this.playPercussion(true, now); // Deep Bayan thump
            } else if (isOffbeat) {
                this.playPercussion(false, now); // Crisp Dayan slap
            }

            this.currentBeat++;
            this.elapsedSeconds += (beatIntervalMs / 1000);

            if (this.onTickCallback) {
                this.onTickCallback(Math.floor(this.elapsedSeconds));
            }

            if (this.elapsedSeconds >= this.currentDuration) {
                this.stopPlayback();
                if (this.onStopCallback) this.onStopCallback();
                return;
            }

            this.timerId = window.setTimeout(scheduleAudio, beatIntervalMs);
        };

        scheduleAudio();
    }

    public stopPlayback() {
        this.isRunning = false;
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        if (this.onStopCallback) {
            this.onStopCallback();
        }
    }

    public isAudioRunning(): boolean {
        return this.isRunning;
    }
}

export const audioSynth = new NepaliAudioEngine();
