import { Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
// import Typing from 'react-typing-animation';
import TypingTextWrapper from './TypingText.Style';

// const TypingText = ({ text }: { text: string }) => (

//     <Typing speed={200} >
//         <Text
//             as="pre"
//             fontSize="md"
//             textStyle="body"
//             color="white"
//             width="100%"
//             fontWeight={400}
//             whiteSpace="pre-wrap"
//             wordBreak="break-word"
//             overflowX="auto"
//         >{text}</Text>
//     </Typing>

// );

// export default TypingText;


const TypingText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isCursorVisible, setIsCursorVisible] = useState(true);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            setDisplayedText((prev) => prev + text[index]);
            index += 1;
            if (index === text.length) {
                clearInterval(timer);
                setTimeout(() => setIsCursorVisible(false), 500);
            }
        }, speed);

        return () => clearInterval(timer);
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
            >{displayedText}
                <span className={`cursor ${!isCursorVisible ? 'hidden' : ''}`}>&nbsp;</span>
            </Text>
        </TypingTextWrapper>);
};

export default TypingText;
