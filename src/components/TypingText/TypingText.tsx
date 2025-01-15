import { Text } from '@chakra-ui/react';
import React, { memo, useEffect, useRef, useState } from 'react';
import TypingTextWrapper from './TypingText.Style';

const TypingText = memo(({ text, speed = 15, onTextUpdate, shouldType, setShouldType }: {
    text: string;
    speed?: number;
    shouldType: boolean;
    onTextUpdate?: (currentText: string) => void;
    setShouldType: (val: boolean) => void;
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isCursorVisible, setIsCursorVisible] = useState(true);
    const shouldTypeRef = useRef(shouldType); // Ref to track shouldType

    useEffect(() => {
        shouldTypeRef.current = shouldType; // Update ref on state change
    }, [shouldType]);

    useEffect(() => {
        let index = 0;
        setDisplayedText(text[0] || ''); // Set the first character
        setIsCursorVisible(true); // Reset cursor visibility

        const typeLetter = () => {
            if (index < text.length && shouldTypeRef.current) {
                setDisplayedText((prev) => prev + (text[index] || ""));
                onTextUpdate?.(text.slice(0, index + 1));
                index += 1;
                setTimeout(typeLetter, speed);
            } else {
                setIsCursorVisible(false); // Hide cursor after finishing
                setShouldType(false);
            }
        };

        const timer = setTimeout(typeLetter, speed);
        return () => clearTimeout(timer);
    }, [text, speed, onTextUpdate, setShouldType, shouldType]);


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
});

TypingText.displayName = 'TypingText';

export default TypingText;