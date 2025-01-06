"use client"; // This is a Client Component

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider as ReduxProvider } from 'react-redux'
import { persistor, store } from "@blogiq/store/store";
import { Provider as ChakraUIProvider } from "@blogiq/components/ui/provider";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ScreenLoaderProvider } from "@blogiq/context/ScreenLoaderContext";
import NavigationAutoLoader from "@blogiq/components/NavigationAutoLoader/NavigationAutoLoader";
import FullScreenLoader from "@blogiq/components/LoaderFullScreen/LoaderFullScreen";

interface ProvidersProps {
    children: React.ReactNode;
    session: Session | null; // Replace with the correct session type if available
}

export default function Providers({ children, session }: Readonly<ProvidersProps>) {

    return (
        <SessionProvider session={session}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <ChakraUIProvider>
                    <ScreenLoaderProvider>
                        <NavigationAutoLoader />
                        <ReduxProvider store={store}>
                            <PersistGate
                                loading={
                                    <FullScreenLoader text="Loading..." />
                                }
                                persistor={persistor}
                            >
                                {children}
                            </PersistGate>
                        </ReduxProvider>
                    </ScreenLoaderProvider>
                </ChakraUIProvider>
            </GoogleOAuthProvider>
        </SessionProvider>
    );
}
