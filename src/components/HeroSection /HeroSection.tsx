"use client";

import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const HeroSection = () => {
    return (
        <Flex
            as="section"
            align="center"
            justify="center"
            direction="column"
            height="80vh"
            backgroundImage="url('/long-exposure.jpg')"
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="lg"
        >
            <Box
                background="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(7px)"
                borderRadius="lg"
                padding="2rem"
                width={{ base: "90%", md: "60%" }}
                textAlign="center"
            >
                <Text fontSize="4xl" fontWeight="bold" color="#ffffff">
                    Unleash the Power of AI to Create, Curate, and Inspire.
                </Text>
                <Text fontSize="md" fontWeight="medium" color="#eeeeee" mt="4">
                    BlogIQ combines the latest in AI technology to help you generate unique and engaging content effortlessly. Whether you&apos;re looking for a fresh blog idea or need assistance drafting your next post, BlogIQ is here to help.
                </Text>
            </Box>
        </Flex>
    );
}

export default HeroSection;
