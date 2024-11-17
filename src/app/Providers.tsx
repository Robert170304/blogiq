"use client"; // This is a Client Component

import { SessionProvider } from "next-auth/react";
import { Provider } from "@/components/ui/provider";

interface ProvidersProps {
    children: React.ReactNode;
    session: null; // Replace with the correct session type if available
}

export default function Providers({ children, session }: Readonly<ProvidersProps>) {
    return (
        <SessionProvider session={session}>
            <Provider>{children}</Provider>
        </SessionProvider>
    );
}
