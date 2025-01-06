import { apiHelper } from "@blogiq/helpers/apiHelper";
import appActions from "@blogiq/store/app/actions";
import { redirect } from "next/navigation";
import { toast, ToastOptions } from "react-hot-toast";
import { store } from "@blogiq/store/store";
import { prisma } from "@blogiq/lib/prisma";
import crypto from 'crypto';
import { addMinutes } from "date-fns";

const { setUserData } = appActions;

export const notify = (text, extraParams) => {
  toast.dismiss();
  toast(text, { ...extraParams } as ToastOptions);
};

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
  utterance.rate = 0.7;
  utterance.pitch = 1;
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
    // utterance.onerror = (event) => console.error("Speech error:", event.error);
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

// Define the logout function
export const handleLogout = async () => {
  try {

    // Call the API
    const response = await apiHelper('/api/signout', 'POST', {}, true) as SignOutResponse;

    if (response.error) {
      notify(response.error || 'Failed to sign out', { type: 'error' });
    } else {
      // Clear session
      localStorage.removeItem('sessionToken');
      store.dispatch(setUserData({}));

      // Notify success
      notify('Signed out successfully', { type: 'success' });

      // Redirect to sign-in page
      redirect('/signin');
    }
  } catch (error) {
    console.error('Logout error:', error);
    notify('Failed to sign out', { type: 'error' });
  } finally {
    // Hide the loader or handle loading state externally
    console.log('Logout process completed.');
  }
};

export const generateVerificationToken = async (email: string) => {
  console.log("🚀 ~ generateVerificationToken ~ email:", email)
  const token = crypto.randomBytes(32).toString('hex');
  const expires = addMinutes(new Date(), 30);  // Token expires in 30 minutes

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
};