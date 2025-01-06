"use client";

import { Box, Flex, Text, Button, } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaFeather, FaSignOutAlt } from 'react-icons/fa';
import HeaderWrapper from './header.style'
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { usePathname, useRouter } from 'next/navigation';
import { HiDocumentDuplicate } from 'react-icons/hi2';
import { TbHomeFilled } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import type { RootState } from '@blogiq/store/store';
import { isEmpty } from 'lodash';
import { useAuthHelper } from '@blogiq/hooks/useAuthHelper';

const Header = () => {
    const router = useRouter()
    const pathname = usePathname();
    const isSigninPage = pathname === '/signin';
    const [openProfileTooltip, setOpenProfileTooltip] = useState(false)
    const userData = useSelector((state: RootState) => state.app.userData);
    console.log("🚀 ~ Header ~ userData:", userData)
    const isUserLoggedIn = isEmpty(userData);
    const { handleLogout } = useAuthHelper();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const onMenuItemClick = (path: string) => {
        router.push(path);
        setOpenProfileTooltip(false);
    }

    return (
        <HeaderWrapper isScrolled={isScrolled}>
            <Box
                as="header"
                bg="white"
                maxWidth={{ base: "100%", sm: "90%", md: "90%", lg: "90%" }}
                width="100%"
            >
                <Flex
                    color="#030303"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    {/* Left Section */}
                    <Flex alignItems="center">
                        <FaFeather size={20} style={{ marginRight: "8px" }} />
                        <Link href="/" passHref>
                            <Text
                                fontSize="20px"
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
                                fontSize="15px"
                                bg="#030303"
                                color="white"
                                pr={7}
                                pl={7}
                                colorScheme="black"
                                size="sm"
                                borderRadius="30px"
                                onClick={() => {
                                    router.push(isSigninPage ? '/' : '/signin');
                                }}
                                className='hover-color-primary'
                            >
                                {isSigninPage ? 'Go to Home' : 'Sign In'}
                            </Button>
                        ) : (
                            <PopoverRoot
                                size="xs"
                                positioning={{ placement: "bottom" }}
                                open={openProfileTooltip}
                                onOpenChange={(e) => setOpenProfileTooltip(e.open)}>
                                <PopoverTrigger>
                                    <Flex alignItems="center" gap="7px" >
                                        <Text fontSize="15px" fontWeight={500}>{userData?.fullName}</Text>
                                        <div className='profile-img-container'>
                                            <Image
                                                src={userData?.image ?? `https://robohash.org/${userData.firstName}`}
                                                alt={userData?.fullName ?? 'User Image'}
                                                width={30}
                                                height={30}
                                                blurDataURL={`https://robohash.org/${userData.firstName}`}
                                            />
                                        </div>
                                    </Flex>
                                </PopoverTrigger>
                                <PopoverContent css={{ "--popover-bg": "#202123", maxWidth: "200px" }}>
                                    <PopoverBody>
                                        <Flex alignItems="center" flexDirection="column" justifyContent="flex-start" gap="10px" >
                                            <Button
                                                padding="0 15px"
                                                width="100%"
                                                color="#fff"
                                                display="flex"
                                                justifyContent="flex-start"
                                                size="sm"
                                                onClick={() => onMenuItemClick('/')}
                                                _hover={{ bg: "#111111" }}
                                            >
                                                <TbHomeFilled />
                                                Home
                                            </Button>
                                            <Button
                                                padding="0 15px"
                                                width="100%"
                                                color="#fff"
                                                display="flex"
                                                justifyContent="flex-start"
                                                size="sm"
                                                onClick={() => onMenuItemClick('/drafts')}
                                                _hover={{ bg: "#111111" }}
                                            >
                                                <HiDocumentDuplicate />
                                                Drafts
                                            </Button>
                                            <Button
                                                padding="0 15px"
                                                width="100%"
                                                color="#fff"
                                                size="sm"
                                                display="flex"
                                                justifyContent="flex-start"
                                                onClick={async () => {
                                                    setOpenProfileTooltip(false)
                                                    await handleLogout()
                                                }}
                                                _hover={{ bg: "#111111" }}
                                            >
                                                <FaSignOutAlt />
                                                Sign out
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
