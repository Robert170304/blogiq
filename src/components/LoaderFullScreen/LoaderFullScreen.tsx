// components/ui/FullScreenLoader.tsx
import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const FullScreenLoader = ({ text = '', textColor = 'white' }: { text?: string; textColor?: string }) => {
    return (
        <Flex
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            bg="rgba(0, 0, 0, 0.8)"
            zIndex="1000"
            flexDirection="column"
            textAlign="center"
            padding="40px"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '4px solid white',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                }}
            />

            {text && (
                <Text mt={4} color={textColor} fontSize="lg" fontWeight="bold">
                    {text}
                </Text>
            )}
        </Flex>
    );
};

export default FullScreenLoader;
