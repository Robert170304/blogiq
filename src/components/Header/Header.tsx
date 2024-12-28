"use client";

import { Box, Flex, Text, Button, } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { FaFeather, FaSignOutAlt } from 'react-icons/fa';
import HeaderWrapper from './header.style'
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { redirect } from 'next/navigation';
import { HiDocumentDuplicate } from 'react-icons/hi2';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import appActions from '@blogiq/store/app/actions';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@blogiq/store/store';
import { isEmpty } from 'lodash';
import { notify } from '@blogiq/app/utils/commonFunctions';
import { handleGoogleSignIn } from '@blogiq/lib/auth/googleSignInServerAction';

const { setUserData } = appActions;
const isNextJSGoogleSignin = process.env.NEXT_PUBLIC_IS_NEXTJS_SIGNIN === "true"
const Header = () => {
    const { data: session, status } = useSession();
    console.log("🚀 ~ isNextJSGoogleSignin:", isNextJSGoogleSignin, process.env.NEXT_PUBLIC_IS_NEXTJS_SIGNIN)
    console.log("🚀 ~ Header ~ session:", session, status)
    const dispatch = useDispatch()
    const [openProfileTooltip, setOpenProfileTooltip] = useState(false)
    const userData = useSelector((state: RootState) => state.app.userData);
    console.log("🚀 ~ Header ~ userData:", userData)
    const isUserLoggedIn = isNextJSGoogleSignin ? !session : isEmpty(userData);
    const handleLogin = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log("🚀 ~ handleLogin ~ credentialResponse.credential:", tokenResponse)
            fetchUserProfile(tokenResponse?.access_token)
        },
    });

    const fetchUserProfile = async (accessToken: string) => {
        try {
            const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("🚀 ~ fetchUserProfile ~ response.data:", response.data);
            dispatch(setUserData(response.data))
        } catch (error) {
            if (error instanceof Error) {
                console.error("🚀 ~ fetchUserProfile ~ error:", error.message);
                notify(error.message)
            } else {
                console.error("🚀 ~ fetchUserProfile ~ error:", error);
                notify(error)
            }
        }
    };

    return (
        <HeaderWrapper>
            <Box
                as="header"
                position="sticky"
                top="0"
                zIndex="1000"
                bg="white"
            >
                <Flex
                    pt={4}
                    pb={4}
                    px={{ base: 1, sm: 1, md: 6, lg: 6 }}
                    color="#030303"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    {/* Left Section */}
                    <Flex alignItems="center">
                        <FaFeather size={20} style={{ marginRight: "8px" }} />
                        <Link href="/" passHref>
                            <Text
                                fontSize="2xl"
                                textStyle="body"
                                fontWeight="bold"
                                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                BlogIQ
                            </Text>
                        </Link>
                    </Flex>

                    {/* Right Section */}

                    <Flex alignItems="center">
                        {isUserLoggedIn ? (
                            <Button
                                fontSize="13px"
                                bg="#030303"
                                color="white"
                                pr={7}
                                pl={7}
                                colorScheme="black"
                                size="sm"
                                borderRadius="30px"
                                onClick={() => {
                                    if (isNextJSGoogleSignin) {
                                        handleGoogleSignIn()
                                    } else {
                                        handleLogin()
                                    }
                                }}
                            >
                                <Image
                                    alt='google logo'
                                    src="/Logo-google-icon.png"
                                    width={20}
                                    height={20}
                                />
                                Sign In With Google
                            </Button>
                        ) : (
                            <PopoverRoot
                                size="sm"
                                positioning={{ placement: "bottom" }}
                                open={openProfileTooltip}
                                onOpenChange={(e) => setOpenProfileTooltip(e.open)}>
                                <PopoverTrigger>
                                    <Flex alignItems="center" gap="10px" >
                                        <Text fontWeight={500}>{isNextJSGoogleSignin ? session?.user?.name : userData?.name}</Text>

                                        <div className='profile-img-container'>
                                            <Image
                                                src={isNextJSGoogleSignin ? session?.user?.image ?? 'https://via.placeholder.com/300x200' : userData?.picture ?? 'https://via.placeholder.com/300x200'}
                                                alt={isNextJSGoogleSignin ? session?.user?.name || 'User Image' : userData?.name || 'User Image'}
                                                width={30}
                                                height={30}
                                                blurDataURL='https://via.placeholder.com/300x200'
                                                className="cardImage"
                                            />
                                        </div>
                                    </Flex>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverBody>
                                        <Flex alignItems="center" flexDirection="column" justifyContent="flex-start" gap="10px" >
                                            <Button
                                                width="100%"
                                                color="#fff"
                                                size="sm"
                                                display="flex"
                                                justifyContent="flex-start"
                                                onClick={async () => {
                                                    if (isNextJSGoogleSignin) {
                                                        await signOut()
                                                        console.log("Sign out successful");
                                                    } else {
                                                        dispatch(setUserData({}))
                                                    }
                                                }}
                                            >
                                                <FaSignOutAlt />
                                                Sign out
                                            </Button>
                                            <Button
                                                width="100%"
                                                color="#fff"
                                                display="flex"
                                                justifyContent="flex-start"
                                                size="sm"
                                                onClick={() => redirect(`/drafts`)}
                                            >
                                                <HiDocumentDuplicate />
                                                Drafts
                                            </Button>
                                        </Flex>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                        )}
                    </Flex>

                </Flex>
            </Box>
        </HeaderWrapper>
    );
};

export default Header;
