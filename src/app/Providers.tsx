"use client"; // This is a Client Component

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider as ReduxProvider } from 'react-redux'
import { persistor, store } from "@blogiq/store/store";
import { Provider as ChakraUIProvider } from "@blogiq/components/ui/provider";
import { PersistGate } from "redux-persist/integration/react";
import { Flex, Text } from "@chakra-ui/react";

interface ProvidersProps {
    children: React.ReactNode;
    session: Session | null; // Replace with the correct session type if available
}

export default function Providers({ children, session }: Readonly<ProvidersProps>) {
    return (
        <SessionProvider session={session}>
            <ChakraUIProvider>
                <ReduxProvider store={store}>
                    <PersistGate
                        loading={
                            <Flex as="div" width="100%" height="100%" justifyContent="center" alignItems="center" >
                                <Text>Loading...</Text>
                            </Flex>
                        }
                        persistor={persistor}
                    >
                        {children}
                    </PersistGate>
                </ReduxProvider>
            </ChakraUIProvider>
        </SessionProvider>
    );
}
