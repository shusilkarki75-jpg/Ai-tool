/**
 * Free Text-to-Speech (TTS) Voice Recitation Service using browser SpeechSynthesis API.
 * 100% Free of Cost - runs client-side with no external paid APIs or subscription required.
 */

class SpeechRecitationEngine {
    private utterance: SpeechSynthesisUtterance | null = null;
    private isReading: boolean = false;
    private onEndCallback: (() => void) | null = null;
    private onProgressCallback: ((charIndex: number, currentWord: string) => void) | null = null;

    // Clean lyrics tags like [Verse 1], [Chorus], [अन्तरा १] for smoother recitation
    public cleanLyricsForSpeech(text: string): string {
        return text
            .replace(/\[.*?\]/g, '') // remove bracket tags
            .replace(/\(.*?\)/g, '') // remove parenthetical tags
            .replace(/[#*_-]/g, '')  // remove markdown symbols
            .trim();
    }

    public speak(
        text: string, 
        options?: { 
            lang?: string; 
            rate?: number; 
            pitch?: number; 
            onEnd?: () => void;
            onProgress?: (charIndex: number, currentWord: string) => void;
        }
    ) {
        if (!('speechSynthesis' in window)) {
            console.warn("Speech Synthesis not supported in this browser");
            return;
        }

        this.stop();

        const cleaned = this.cleanLyricsForSpeech(text);
        if (!cleaned) return;

        const utterance = new SpeechSynthesisUtterance(cleaned);
        this.utterance = utterance;
        this.onEndCallback = options?.onEnd || null;
        this.onProgressCallback = options?.onProgress || null;
        this.isReading = true;

        // Auto detect language
        const isDevanagari = /[\u0900-\u097F]/.test(cleaned);
        const preferredLang = options?.lang || (isDevanagari ? 'ne-NP' : 'en-US');
        utterance.lang = preferredLang;
        utterance.rate = options?.rate || 0.95; // Slightly measured recitation pace
        utterance.pitch = options?.pitch || 1.0;

        // Try to find a matching voice (Nepali or Hindi or English)
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const voice = voices.find(v => v.lang === preferredLang) ||
                          voices.find(v => v.lang.startsWith(isDevanagari ? 'hi' : 'en')) ||
                          voices[0];
            if (voice) {
                utterance.voice = voice;
            }
        }

        utterance.onend = () => {
            this.isReading = false;
            if (this.onEndCallback) this.onEndCallback();
        };

        utterance.onerror = (e) => {
            console.warn("Speech recitation error or interrupted:", e);
            this.isReading = false;
            if (this.onEndCallback) this.onEndCallback();
        };

        utterance.onboundary = (e) => {
            if (e.name === 'word' && this.onProgressCallback) {
                const word = cleaned.substring(e.charIndex, e.charIndex + (e.charLength || 10));
                this.onProgressCallback(e.charIndex, word);
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    public pause() {
        if ('speechSynthesis' in window && this.isReading) {
            window.speechSynthesis.pause();
        }
    }

    public resume() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.resume();
        }
    }

    public stop() {
        this.isReading = false;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (this.onEndCallback) {
            this.onEndCallback();
        }
    }

    public isActive(): boolean {
        return this.isReading;
    }
}

export const speechService = new SpeechRecitationEngine();
