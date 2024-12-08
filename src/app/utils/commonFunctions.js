import toast from "react-hot-toast";

export const notify = (text, { type }) => toast(text, { type });

export const copyToClipBoard = async (text) => {
  console.log("🚀 ~ copyToClipBoard ~ text:", text);
  try {
    await navigator.clipboard.writeText(text);
    notify("Copied to clipboard.", { type: "success" });
  } catch (err) {
    console.error("🚀 ~ copyToClipBoard ~ err:", err);
    notify("Failed to copy!", { type: "error" });
  }
};

export const readAloud = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  window.speechSynthesis.speak(utterance);
};

export const startSpeech = (text) => {
  console.log("🚀 ~ startSpeech ~ text:", text);
  if ("speechSynthesis" in window) {
    const synth = window.speechSynthesis;
    // const voices = synth.getVoices();

    console.log("🚀 ~ startSpeech ~ text:", text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.7;
    utterance.pitch = 1;
    // utterance.voice =
    //   voices.find((voice) => voice.lang === "en-US") || voices[0];
    utterance.onerror = (event) => console.error("Speech error:", event.error);
    synth.speak(utterance);
    return { utterance, synth };
  } else {
    alert("Text-to-Speech is not supported in this browser.");
    return undefined;
  }
};

// Pause the speech
export const pauseSpeech = () => {
  if ("speechSynthesis" in window && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  }
};

// Resume the speech
export const resumeSpeech = () => {
  if ("speechSynthesis" in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};

// Stop all speech
export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
