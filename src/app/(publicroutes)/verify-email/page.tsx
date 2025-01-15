"use client";
import { notify } from '@blogiq/app/utils/commonFunctions';
import { useScreenLoader } from '@blogiq/context/ScreenLoaderContext'
import { apiHelper } from '@blogiq/helpers/apiHelper'
import appActions from '@blogiq/store/app/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';


const { setUserData } = appActions;
const VerifyEmailPage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const query = useSearchParams()
    const { showLoader, hideLoader } = useScreenLoader()
    const isVerifiedEmailAPIFetched = useRef(false);

    const verifyEmail = async (data) => {
        showLoader("Verifying your email...")
        try {

            const result = await apiHelper('/api/verifyEmail', 'POST', data, false) as SignUpResponse;

            if (result.token && result.user) {
                const userdt = result.user
                // Store token in localStorage or cookies
                localStorage.setItem('sessionToken', result.token);

                // set user data in redux store
                dispatch(setUserData({
                    id: userdt.id,
                    email: userdt.email,
                    isEmailVerified: userdt.verifiedEmail,
                    fullName: userdt.name,
                    firstName: userdt.firstName,
                    lastName: userdt.lastName,
                    image: userdt.image,
                    signInType: 'email'
                }))

                // Redirect to home or dashboard
                router.replace('/')

                notify("Successfully signed in.", { type: "success" });
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

    useEffect(() => {
        if (!isVerifiedEmailAPIFetched.current) {
            isVerifiedEmailAPIFetched.current = true;
            verifyEmail({ token: query.get("token"), identifier: query.get("identifier") })
        }
    }, [query])



    return (
        <div>Verifying your email, do not do any action</div>
    )
}

export default VerifyEmailPage