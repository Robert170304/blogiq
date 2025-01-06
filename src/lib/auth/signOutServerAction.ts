"use server"

import { signOut } from "./authConfig";

export const handleSignOut = async () => {
    try {
        await signOut()
    } catch (error) {
        console.log("Error during sign out:", error);
        // throw error;
    }
}