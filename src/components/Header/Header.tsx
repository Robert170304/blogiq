"use client";

import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link';
import React from 'react'
import { FaFeather } from 'react-icons/fa'

const Header = () => {
    return (
        <Box as="header" position="sticky"
            top="0"
            zIndex="1000" bg="white" >
            <Flex
                pt={4}
                pb={4}
                color="#030303"
                alignItems="center"
            >
                <FaFeather size={20} style={{ marginRight: "8px" }} />
                <Link href="/" passHref >
                    <Text
                        fontSize="2xl"
                        textStyle="body"
                        fontWeight="bold"
                        _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >BlogIQ</Text>
                </Link>
            </Flex>
        </Box>
    )
}

export default Header