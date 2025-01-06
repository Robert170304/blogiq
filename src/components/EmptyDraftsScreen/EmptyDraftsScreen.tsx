import React from 'react';
import { motion } from 'framer-motion';
import { Button, VStack, Text, Image, Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const EmptyDraftsScreen = () => {

    const router = useRouter();

    const handleRedirect = async () => {
        router.push('/?focusInput=true');
    };


    return (
        <VStack
            align="center"
            justify="center"
            bgGradient="linear(to-b, orange.100, pink.50)"
            p={8}
            borderRadius="lg"
        >
            {/* Animated SVG */}
            <Box
                as="div"
                width="50%"
            >
                <Image
                    src="/Nodata-pana.svg"
                    alt="Empty drafts illustration"
                />
            </Box>

            {/* Playful Headline */}
            <Text fontSize="2xl" fontWeight="bold" color="#030303">
                Uh-oh, no drafts here! 🚀
            </Text>

            <Text fontSize="md" color="gray.600" textAlign="center">
                Looks like your drafts took the day off. Let’s create something awesome
                and bring them back!
            </Text>

            {/* Button with confetti */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Button
                    bg="#030303"
                    color="white"
                    _hover={{ bg: "#3f3d56" }}
                    size="lg"
                    borderRadius="full"
                    padding="0 20px"
                    onClick={handleRedirect}
                >
                    Create your first draft ✨
                </Button>
            </motion.div>
        </VStack>
    );
};

export default EmptyDraftsScreen;
