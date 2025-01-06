"use client"
import ContentGenerator from "@blogiq/components/ContentGenerator/ContentGenerator";
import HeroSection from "@blogiq/components/HeroSection /HeroSection";
import { apiHelper } from "@blogiq/helpers/apiHelper";
import { useAuthHelper } from "@blogiq/hooks/useAuthHelper";
import type { RootState } from "@blogiq/store/store";
import { Flex } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";


export default function Home() {
  const { handleLogout } = useAuthHelper();
  const userData = useSelector((state: RootState) => state.app.userData);
  const isVerifyUserFetched = useRef(false);

  const verifyCurrentUser = async () => {
    try {
      const res = await apiHelper('/api/verifyUser', 'GET', {}, true) as VerifyUserResponse;

      if (!res?.isVerified) {
        await handleLogout({ successMsg: res.tokenExpired ? "Session expired. Please sign in again." : res.message, type: "error" })
      }
    } catch (error) {
      console.error("🚀 ~ verifyCurrentUser ~ error:", error)
    }

  };

  useEffect(() => {
    if (!isVerifyUserFetched.current && !isEmpty(userData) && userData.id) {
      isVerifyUserFetched.current = true
      verifyCurrentUser()
    }
  }, [userData])

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
