import { Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import TypingTextWrapper from './TypingText.Style';

const TypingText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isCursorVisible, setIsCursorVisible] = useState(true);

    useEffect(() => {
        let index = 0;

        const typeLetter = () => {
            if (index < text.length) {
                // Only update state if text[index] is valid
                setDisplayedText((prev) => prev + (text[index] || ''));
                index += 1;
                setTimeout(typeLetter, speed); // Recursive typing effect
            } else {
                setIsCursorVisible(false); // Hide cursor after finishing
            }
        };

        typeLetter();

        return () => {
            index = text.length; // Cleanup on unmount
        };
    }, [text, speed]);

    return (
        <TypingTextWrapper>
            <Text
                as="pre"
                fontSize="md"
                textStyle="body"
                color="white"
                width="100%"
                fontWeight={400}
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                overflowX="auto"
            >
                {displayedText}
                <span className={`cursor ${!isCursorVisible ? 'hidden' : ''}`}>&nbsp;</span>
            </Text>
        </TypingTextWrapper>
    );
};

export default TypingText;
