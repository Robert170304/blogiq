"use client";

import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { FaFeather } from 'react-icons/fa'

const Header = () => {
    return (
        <Box as="header">
            <Flex
                pt={4}
                pb={4}
                color="#030303"
                alignItems="center"
            >
                <FaFeather size={20} style={{ marginRight: "8px" }} />
                <Text fontSize="2xl" textStyle="body" fontWeight="bold">BlogIQ</Text>
            </Flex>
        </Box>
    )
}

export default Header