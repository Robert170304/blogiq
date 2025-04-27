import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Box, Container, Flex } from "@chakra-ui/react";
import Providers from "./Providers";
import { Session } from "next-auth";
import { Toaster } from 'react-hot-toast';
import Header from "@blogiq/components/Header/Header";
import Footer from "@blogiq/components/Footer/Footer";
import SessionWatcher from "@blogiq/components/SessionWatcher/SessionWatcher";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap", // Optional: improves font loading
});

export const metadata: Metadata = {
  title: "BlogIQ - an AI Powered Blogging Platform",
  description: "Create, curate, and inspire your content creation process.",
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ session: Session | null }>;
}

export default async function RootLayout({ children, params }: Readonly<LayoutProps>) {
  const resolvedParams = await params;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers session={resolvedParams?.session || null}>
          <SessionWatcher />
          <Toaster />
          <Flex direction="column" minHeight="100vh">
            <Box
              flex="1"
              display="flex"
              flexDirection="column"
            >
              <Header />
              <Container
                flex="1"
                display="flex"
                padding="0"
                overflowY="auto"
                pr={{ base: "10px", sm: "10px", md: "10", lg: "20" }}
                pl={{ base: "10px", sm: "10px", md: "10", lg: "20" }}
                pb={{ base: "10px", sm: "10px", md: "10", lg: "20" }}
              >
                {children}
              </Container>
            </Box>
            <Footer />
          </Flex>
        </Providers>
        <Script src="https://code.responsivevoice.org/responsivevoice.js?key=Uvok8Skn" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
