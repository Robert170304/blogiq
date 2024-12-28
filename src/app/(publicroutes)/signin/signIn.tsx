"use client"
import { Button } from '@blogiq/components/ui/button'
import { handleEmailSignIn } from '@blogiq/lib/auth/emailSignInServerAction'
import { handleGoogleSignIn } from '@blogiq/lib/auth/googleSignInServerAction'
import { Box, Flex, Input } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

const SignInPage = () => {
    async function signInWithEmail(event) {
        event.preventDefault()
        console.log("🚀 ~ signInWithEmail ~ payload:", event, event.target.email.value)
        await handleEmailSignIn(event.target.email.value)
    }

    return (
        <Flex as="form" justify="center" width="100%" onSubmit={(e) => { signInWithEmail(e) }}>
            <Box position="relative" >
                <Input
                    placeContent="Enter your email"
                    placeholder='Enter your email'
                    size="lg"
                    variant="outline"
                    width={{ base: "100%", md: "80%" }}
                    border="2px solid #e5e7eb"
                    padding="0 40px 0 10px"
                    name='email'
                />
                <Button
                    type="submit"
                    textStyle="body"
                    bg="#030303"
                    color="white"
                    pr={7}
                    pl={7}
                    colorScheme="black"
                    size="lg"
                    fontWeight="bold"
                >
                    Sign In
                </Button>
            </Box>
            <Box position="relative" >
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
                        handleGoogleSignIn()
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
            </Box>
        </Flex>
    )
}

export default SignInPage