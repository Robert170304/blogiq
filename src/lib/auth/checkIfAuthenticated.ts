
"use server"

import { auth } from "@blogiq/lib/auth/authConfig"

export const checkIfAuthenticated = async () => {
    const session = await auth();
    console.log("🚀 ~ checkIfAuthenticated ~ session:", session)
    if (session) {
        return true;
    }
    return false;
}