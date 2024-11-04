import BlogListing from "@/components/BlogListing/BlogListing";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection /HeroSection";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";

export default function Home() {
  return (
    <React.Fragment>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1" pr="20" pl="20">
          <Header />
          <HeroSection />
          <BlogListing />
        </Box>
        <Footer />
      </Flex>
    </React.Fragment>
  );
}
