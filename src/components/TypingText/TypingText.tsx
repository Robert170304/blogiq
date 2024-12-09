import { Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import TypingTextWrapper from './TypingText.Style';

const TypingText = ({ text, speed = 50, onTextUpdate }: {
    text: string;
    speed?: number;
    onTextUpdate?: (currentText: string) => void;
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isCursorVisible, setIsCursorVisible] = useState(true);

    useEffect(() => {
        let index = 0;
        let timer: NodeJS.Timeout; // Store the timer reference
        const typeLetter = () => {
            if (index < text.length) {
                // Only update state if text[index] is valid
                setDisplayedText((prev) => prev + (text[index] || ''));
                onTextUpdate?.(text.slice(0, index + 1));
                index += 1;
                timer = setTimeout(typeLetter, speed); // Recursive typing
            } else {
                setIsCursorVisible(false); // Hide cursor after finishing
            }
        };

        setDisplayedText(''); // Reset displayed text when `text` changes
        setIsCursorVisible(true); // Reset cursor visibility
        typeLetter();

        return () => {
            clearTimeout(timer);
        };
    }, [text, speed, onTextUpdate]);

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
