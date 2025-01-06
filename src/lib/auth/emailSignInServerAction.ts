"use server"

import { signIn } from "./authConfig";


export const handleEmailSignIn = async (email: string) => {
    try {
        await signIn("nodemailer", {
            email,
        });
    } catch (error) {
        console.log("🚀 ~ handleEmailSignIn ~ error:", error)
        // throw error;
    }
}