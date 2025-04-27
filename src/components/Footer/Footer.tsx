import { Flex } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
    return (
        <Flex
            bg="#030303"
            color="#fff"
            textStyle="body"
            height="50px"
            display="flex"
            alignItems="center"
            padding="0 20px"
        >
            <div>&copy; BlogIQ. All rights reserved.</div>
        </Flex>

    )
}

export default Footer