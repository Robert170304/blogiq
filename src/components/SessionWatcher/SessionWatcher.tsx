"use client"
import { useAuthHelper } from "@blogiq/hooks/useAuthHelper";
import { useEffect } from "react";

export default function SessionWatcher() {
    const { handleLogout } = useAuthHelper();

    useEffect(() => {
        const checkLogout = async () => {
            const cookies = document.cookie.split(";").map((c) => c.trim());
            const loggedOut = cookies.find((cookie) => cookie.startsWith("loggedOut="));

            if (loggedOut) {

                // clear the cookie after detecting it
                document.cookie = "loggedOut=; Max-Age=0; path=/";

                await handleLogout({ successMsg: "Session expired. Please sign in again.", type: "error" });
            }
        };

        const interval = setInterval(checkLogout, 1000); // Check every second
        return () => clearInterval(interval);
    }, [handleLogout]);

    return null; // No UI for this watcher
}
