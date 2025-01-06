import React from 'react'
import { Flex } from '@chakra-ui/react';
import SignUpPage from './signup';

const SignUp = async () => {
    return (
        <Flex as="div" justify="center" width="100%">
            <SignUpPage />
        </Flex>
    )
}

export default SignUp