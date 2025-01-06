"use client"
import { Button } from '@blogiq/components/ui/button'
import { Box, Fieldset, Flex, Input, Separator } from '@chakra-ui/react'
import Image from 'next/image'
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field } from '@blogiq/components/ui/field'
import { PasswordInput } from '@blogiq/components/ui/password-input'

import { useForm } from 'react-hook-form'
import { emailRegex, signUpLoaderTexts } from '@blogiq/app/utils/utility'
import { notify } from '@blogiq/app/utils/commonFunctions'
import { useScreenLoader } from '@blogiq/context/ScreenLoaderContext'
import { apiHelper } from '@blogiq/helpers/apiHelper'
import { useGoogleLogin } from '@react-oauth/google';
import appActions from '@blogiq/store/app/actions';
import { useDispatch } from 'react-redux';

const { setUserData } = appActions
const SignUpPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { showLoader, hideLoader, isLoading } = useScreenLoader();
    const [randomLoadingText, setRandomLoadingText] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * signUpLoaderTexts.length);
        setRandomLoadingText(signUpLoaderTexts[randomIndex]);
    }, []);

    async function signUpUser(data) {
        showLoader(randomLoadingText)
        try {

            const result = await apiHelper('/api/signup', 'POST', data, false) as SignUpResponse;

            console.log("🚀 ~ signUpUser ~ result:", result)

            if (result?.success) {
                notify(result.message ?? "Successfully signed in.", { type: "success" });
                hideLoader()
            } else {
                notify(result.message, { type: "error" });
                hideLoader()
            }
        } catch (error) {
            console.log("🚀 ~ signUpUser ~ error:", error)
            notify("Signing up failed!", { type: "error" });
            hideLoader()
        }
    }

    const handleGoogleSignUp = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("🚀 ~ handleLogin ~ credentialResponse.credential:", tokenResponse)
            fetchUserGoogleProfile(tokenResponse?.access_token)
        },
    });

    const fetchUserGoogleProfile = async (accessToken: string) => {
        showLoader(randomLoadingText);
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                notify("Failed to fetch user google profile", { type: "error" });
                hideLoader()
                return;
            }

            const userGoogleProfile = await response.json();
            try {
                // Call your API to handle user creation or session generation
                const serverResponse = await apiHelper('/api/googleSignin', 'POST', userGoogleProfile, false) as GoogleSignInResponse;

                if (serverResponse?.token && serverResponse?.user) {
                    const { token, user } = serverResponse;

                    // Save token in local storage
                    localStorage.setItem('sessionToken', token);

                    // Set user data in Redux store
                    dispatch(setUserData({
                        id: user.id,
                        email: user.email,
                        isEmailVerified: user.verified_email,
                        fullName: user.name,
                        image: user.image,
                        firstName: user.given_name,
                        lastName: user.family_name,
                        signInType: 'google',
                    }));

                    notify("Signed in successfully", { type: "success" });
                    router.replace('/');
                } else {
                    notify(serverResponse?.message || "Google Sign-In failed on the server", { type: "error" });
                    hideLoader()
                    return;
                }

            } catch (error) {
                console.error('Google Sign-In Error:', error);
                notify("Google Sign-In failed. Please try again.", { type: "error" });
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            notify("Google Sign-In failed. Please try again.", { type: "error" });
        } finally {
            hideLoader()
        }
    }

    return (
        <Flex
            as="form"
            justify="center"
            width="100%"
            flexDirection="column"
            maxWidth="500px"
            gap="20px"
            onSubmit={handleSubmit(signUpUser)}
        >
            <Fieldset.Root size="lg">
                <Fieldset.Legend color="#030303" >Create an Account</Fieldset.Legend>
                <Fieldset.Content display="flex" alignItems="center" >
                    <Field
                        width={{ base: "100%", md: "80%" }}
                        label="First Name"
                        invalid={!!errors.firstName}
                        errorText={errors.firstName?.message?.toString()}
                    >
                        <Input
                            maxLength={20}
                            placeContent="First Name"
                            size="lg"
                            variant="outline"
                            width="100%"
                            border="2px solid #e5e7eb"
                            padding="0 40px 0 10px"
                            {...register('firstName', {
                                required: 'First Name is required',
                                validate: value => !/^\s/.test(value) || 'First Name cannot start with a space'
                            })}
                        />
                    </Field>
                    <Field
                        width={{ base: "100%", md: "80%" }}
                        label="Last Name"
                        invalid={!!errors.lastName}
                        errorText={errors.lastName?.message?.toString()}
                    >
                        <Input
                            maxLength={20}
                            placeContent="Last Name"
                            size="lg"
                            variant="outline"
                            width="100%"
                            border="2px solid #e5e7eb"
                            padding="0 40px 0 10px"
                            {...register('lastName', {
                                required: 'Last Name is required',
                                validate: value => !/^\s/.test(value) || 'Last Name cannot start with a space'
                            })}
                        />
                    </Field>
                    <Field
                        width={{ base: "100%", md: "80%" }}
                        label="Email"
                        invalid={!!errors.email}
                        errorText={errors.email?.message?.toString()}
                    >
                        <Input
                            maxLength={40}
                            placeContent="Email"
                            size="lg"
                            variant="outline"
                            width="100%"
                            border="2px solid #e5e7eb"
                            padding="0 40px 0 10px"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: emailRegex,
                                    message: 'Invalid email address'
                                },
                            })}
                        />
                    </Field>
                    <Field
                        width={{ base: "100%", md: "80%" }}
                        label="Password"
                        invalid={!!errors.password}
                        errorText={errors.password?.message?.toString()}
                    >
                        <PasswordInput
                            placeContent="Password"
                            size="lg"
                            variant="outline"
                            width="100%"
                            border="2px solid #e5e7eb"
                            padding="0 40px 0 10px"
                            maxLength={20}
                            {...register('password',
                                {
                                    required: 'Password is required',
                                    validate: value => !/^\s/.test(value) || 'Password cannot start with a space',
                                    maxLength: {
                                        value: 20,
                                        message: 'Password cannot exceed 20 characters'
                                    },
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters'
                                    },
                                })
                            }
                        />
                    </Field>
                </Fieldset.Content>
            </Fieldset.Root>
            <Box
                position="relative"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                width="100%"
                gap="10px"
                alignItems="center"
            >
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
                    width={{ base: "100%", md: "80%" }}
                    loading={isLoading}
                    className='hover-color-primary'
                >
                    Sign Up
                </Button>
            </Box>
            <Separator borderColor="#e5e7eb" borderWidth="0.5px" />
            <Box
                position="relative"
                display="flex"
                justifyContent="center"
                width="100%"
                flexDirection="column"
                gap="10px"
                alignItems="center"
            >
                <Button
                    width={{ base: "100%", md: "80%" }}
                    fontSize="13px"
                    bg="#030303"
                    color="white"
                    pr={7}
                    pl={7}
                    colorScheme="black"
                    size="sm"
                    borderRadius="30px"
                    onClick={() => {
                        handleGoogleSignUp()
                    }}
                    className='hover-color-primary'
                >
                    <Image
                        alt='google logo'
                        src="/Logo-google-icon.png"
                        width={20}
                        height={20}
                    />
                    Sign Up With Google
                </Button>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Button
                        variant="outline"
                        fontSize="13px"
                        pr={7}
                        pl={7}
                        colorScheme="black"
                        size="sm"
                        borderRadius="30px"
                        onClick={() => {
                            router.push('/signin')
                        }}
                        textDecoration="underline"
                    >
                        Sign In using email
                    </Button>
                </motion.div>
            </Box>
        </Flex>
    )
}

export default SignUpPage