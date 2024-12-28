import ContentGenerator from "@blogiq/components/ContentGenerator/ContentGenerator";
import HeroSection from "@blogiq/components/HeroSection /HeroSection";
import { checkIfAuthenticated } from "@blogiq/lib/auth/checkIfAuthenticated";
import { Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  const isAuthenticated = await checkIfAuthenticated();

  if (!isAuthenticated) {
    redirect("/signin");
  }
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
