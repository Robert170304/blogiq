import React from 'react'
import SignInPage from './signIn'
import { checkIfAuthenticated } from '@blogiq/lib/auth/checkIfAuthenticated'
import { redirect } from 'next/navigation';

const SignIn = async () => {
    const isAuthenticated = await checkIfAuthenticated();
    console.log("🚀 ~ SignIn ~ isAuthenticated:", isAuthenticated)

    if (isAuthenticated) {
        redirect("/");
    }
    return (
        <SignInPage />
    )
}

export default SignIn