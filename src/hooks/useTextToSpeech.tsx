"use client";

export default function useTextToSpeech() {
    interface SpeakOptions {
        voice?: string;
        pitch?: number;
        rate?: number;
        volume?: number;
        onstart?: () => void;
        onend?: () => void;
    }

    const speak = (text: string, options: SpeakOptions = {}) => {
        if (typeof window !== 'undefined' && window.responsiveVoice) {
            console.log("🚀 ~ speak ~ text: string, options:", text, options)
            window.responsiveVoice.speak(text, options.voice ?? "UK English Male", {
                pitch: options.pitch ?? 1,
                rate: options.rate ?? 1,
                volume: options.volume ?? 1,
                onstart: options.onstart ?? (() => console.log("Speaking started")),
                onend: options.onend ?? (() => console.log("Speaking ended")),
            });
        } else {
            console.error("ResponsiveVoice.js not loaded or not available");
        }
    };

    return { speak };
}
