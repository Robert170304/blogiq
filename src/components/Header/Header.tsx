"use client";

import { Box, Flex, Text, Button, } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaFeather } from 'react-icons/fa';
import HeaderWrapper from './header.style'
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { GoSignOut } from 'react-icons/go';

const Header = () => {
    const { data: session, status } = useSession();
    console.log("🚀 ~ Header ~ session:", session, status)
    const [openProfileTooltip, setOpenProfileTooltip] = useState(false)
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
                        {!session ? (
                            <Button
                                fontSize="13px"
                                bg="#030303"
                                color="white"
                                pr={7}
                                pl={7}
                                colorScheme="black"
                                size="sm"
                                borderRadius="30px"
                                onClick={() => signIn('google')} // Replace with your login handler
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
                                        <Text fontWeight={500}>{session.user?.name}</Text>

                                        <div className='profile-img-container'>
                                            <Image
                                                src={session.user?.image ?? 'https://via.placeholder.com/300x200'}
                                                alt={session.user?.name || 'User Image'}
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
                                        <Button
                                            color="#fff"
                                            size="sm"
                                            onClick={() => signOut()} // Replace with your login handler
                                        >
                                            <GoSignOut />
                                            Sign out
                                        </Button>
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
