"use client"
import { notify } from '@blogiq/app/utils/commonFunctions'
import { Button } from '@blogiq/components/ui/button'
import { Box, Fieldset, Flex, Input, Separator, } from '@chakra-ui/react'
import Image from 'next/image'
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field } from '@blogiq/components/ui/field'
import { useForm } from 'react-hook-form'
import { emailRegex, signInLoaderTexts } from '@blogiq/app/utils/utility'
import { PasswordInput } from '@blogiq/components/ui/password-input'
import appActions from '@blogiq/store/app/actions'
import { useDispatch } from 'react-redux'
import { useGoogleLogin } from '@react-oauth/google'
import { useScreenLoader } from '@blogiq/context/ScreenLoaderContext'
import { apiHelper } from '@blogiq/helpers/apiHelper'

const { setUserData } = appActions;
const SignInPage = () => {
    const dispatch = useDispatch()
    const { showLoader, hideLoader, isLoading } = useScreenLoader();
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [randomLoadingText, setRandomLoadingText] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * signInLoaderTexts.length);
        setRandomLoadingText(signInLoaderTexts[randomIndex]);
    }, []);


    async function handleEmailSignIn(data) {
        showLoader(randomLoadingText);
        try {
            const result = await apiHelper('/api/signin', 'POST', data, false) as SignInResponse;

            if (result?.token && result?.user) {
                const userdt = result.user;

                // Store token in localStorage or cookies
                localStorage.setItem('sessionToken', result.token);

                // Set user data in redux store
                dispatch(setUserData({
                    id: userdt.id,
                    email: userdt.email,
                    isEmailVerified: userdt.verifiedEmail,
                    fullName: userdt.name,
                    firstName: userdt.firstName,
                    lastName: userdt.lastName,
                    image: userdt.image,
                    signInType: 'email',
                }));

                notify("Signed in successfully", { type: "success" });
                hideLoader();

                // Redirect to a protected page
                router.replace("/");
            } else {
                console.error('Sign-in failed:', result.message);
                notify(result.message || "Sign-in failed", { type: "error" });
                hideLoader();
            }
        } catch (error) {
            console.log("🚀 ~ handleEmailSignIn ~ error:", error);
            notify("Something went wrong, please try again", { type: "error" });
            hideLoader();
        }
    }


    const handleGoogleLogin = useGoogleLogin({
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
            onSubmit={handleSubmit(handleEmailSignIn)}
        >
            <Fieldset.Root size="lg">
                <Fieldset.Legend color="#030303" >Sign In to Continue</Fieldset.Legend>
                <Fieldset.Content display="flex" alignItems="center" >
                    <Field
                        width={{ base: "100%", md: "80%" }}
                        label="Email"
                        invalid={!!errors.email}
                        errorText={errors.email?.message?.toString()}
                    >
                        <Input
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
                                }
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
                                    validate: value => !/\s/.test(value) || 'Invalid password'
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
                    loadingText="Signing In"
                    className='hover-color-primary'
                >
                    Sign In
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
                        handleGoogleLogin()
                    }}
                    className='hover-color-primary'
                >
                    <Image
                        alt='google logo'
                        src="/Logo-google-icon.png"
                        width={20}
                        height={20}
                    />
                    Sign In With Google
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
                            router.push('/signup')
                        }}
                        textDecoration="underline"
                    >
                        Sign Up an account to continue
                    </Button>
                </motion.div>
            </Box>
        </Flex >
    )
}

export default SignInPage