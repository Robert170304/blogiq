import React from 'react'
import SignInPage from './signIn'
import { Flex } from '@chakra-ui/react';

const SignIn = () => {
    return (
        <Flex as="div" justify="center" width="100%" minHeight="500px">
            <SignInPage />
        </Flex>
    )
}

export default SignIn