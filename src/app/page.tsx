import ContentGenerator from "@/components/ContentGenerator/ContentGenerator";
import HeroSection from "@/components/HeroSection /HeroSection";
import { Flex } from "@chakra-ui/react";
import React from "react";

export default function Home() {
  return (
    <Flex
      as="div"
      direction="column"
      gap="50px"
    >
      <HeroSection />
      <ContentGenerator />
    </Flex>
  );
}
