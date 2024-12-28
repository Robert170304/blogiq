"use server"

import { signIn } from "./authConfig";


export const handleGoogleSignIn = async () => {
    try {
        await signIn("google", { redirectTo: "/" })
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw new Error("Google sign-in failed. Please try again.");
    }
}