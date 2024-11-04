import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import React from 'react'

const HeroSection = () => {
    return (
        <Flex
            as="section"
            align="center"
            justify="space-between"
            direction={{ base: "column", md: "row" }}
            height={300}
        >
            <Box textAlign={{ base: "center", md: "left" }} mb={{ base: "4", md: "0" }} width="50%" >
                <Text textStyle="body" fontSize="6xl" fontWeight="bold" mb="4">Blog Plate</Text>
                <Flex as="form" justify={{ base: "center", md: "start" }}>
                    <Box position="relative">
                        <Input
                            textStyle="body"
                            placeContent="Enter your email"
                            placeholder='Enter your email'
                            size="lg"
                            variant="outline"
                            width="300px"
                            borderRadius={120}
                            border="2px solid #e5e7eb"
                            padding="0 40px 0 10px"
                        />
                        <Button
                            textStyle="body"
                            bg="#030303"
                            color="white"
                            pr={7}
                            pl={7}
                            borderRadius={120}
                            colorScheme="black"
                            size="lg"
                            fontWeight="bold"
                            position="absolute"
                            right="-96px"
                        >
                            Subscribe
                        </Button>
                    </Box>
                </Flex>
            </Box>
            <Box textAlign={{ base: "center", md: "right" }} width="50%">
                <Flex as="div" justifyContent="center">
                    <Text fontSize="lg" textStyle="body" color="#85878c" width="310px" fontWeight={600}>
                        New product features, the latest in technology, solutions, and updates.
                    </Text>
                </Flex>
            </Box>
        </Flex>
    )
}

export default HeroSection