"use client"

import { Box, Flex, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { ReactTyped, Typed } from "react-typed";
import GeneratedContentToolbar from '../GeneratedContentToolbar/GeneratedContentToolbar'
import { BsPauseCircle } from 'react-icons/bs'
import { notify } from '@blogiq/app/utils/commonFunctions';
import ContentGeneratorWrapper from './ContentGenerator.Style';
import { useSearchParams } from 'next/navigation';
import { FiZap } from 'react-icons/fi'
import AnimatedFiZap from './AnimatedFiZap';

const ContentGenerator = () => {
    const searchParams = useSearchParams();
    const [prompt, setPrompt] = useState("")
    const [generatedText, setGeneratedText] = useState(``)
    const [isGeneratingText, setIsGeneratingText] = useState(false)
    const [isTypingText, setIsTypingText] = useState(false)
    const [typed, setTyped] = useState<Typed | undefined>()

    const boxRef = useRef<HTMLDivElement | null>(null);

    const generateContent = async () => {
        if (!prompt.trim()) return; // Avoid generating for empty prompts.
        setIsGeneratingText(true)
        const res = await fetch('/api/generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        })
        const data = await res.json()
        if (res.ok) {
            setTimeout(() => {
                setGeneratedText(data.text)
            }, 1000)
            setIsGeneratingText(false)
        } else {
            setIsGeneratingText(false)
            console.log("🚀 ~ generateContent ~ data.error:", data.error)
            notify("Failed to generate", { type: "error" })
        }
    }

    useEffect(() => {
        if (!isGeneratingText && generatedText) {
            typed?.start()
        }
    }, [isGeneratingText, generatedText, typed])


    useEffect(() => {
        const focusInput = searchParams.get('focusInput');  // Check if focusInput=true
        if (focusInput === 'true') {
            const contentInput = document.getElementById('content-generator-input');
            if (contentInput) {
                contentInput.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll
                contentInput.focus();  // Focus on the input
            }
            window.history.replaceState(null, '', '/');
        }
    }, [searchParams]);  // Re-run the effect if searchParams change

    return (
        <ContentGeneratorWrapper>
            <Flex
                as="section"
                justify="space-between"
                direction="column"
            >
                <Flex as="form" justify="center" width="100%">
                    <Box position="relative" width={{ base: "100%", md: "80%" }} display="flex" justifyContent="center">
                        <Input
                            id="content-generator-input"
                            textStyle="body"
                            placeContent="Start typing... the AI magic happens next! 🪄"
                            placeholder='Start typing... the AI magic happens next! 🪄'
                            size="lg"
                            variant="outline"
                            width={{ base: "100%", md: "80%" }}
                            borderRadius="40px 0 0 40px"
                            border="2px solid #e5e7eb"
                            padding="0 10px 0 10px"
                            fontSize="14px"
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key == "Enter") {
                                    e.preventDefault()
                                }
                            }}
                            onKeyUp={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                if (e.key == "Enter") {
                                    generateContent()
                                }
                            }}
                            value={prompt}
                        />
                        <Button
                            onClick={() => {
                                if (!isGeneratingText) {
                                    if (isTypingText) {
                                        typed?.stop();
                                        setIsTypingText(false);
                                    } else {
                                        generateContent();
                                    }
                                }
                            }}
                            textStyle="body"
                            bg="#030303"
                            color="white"
                            pr={7}
                            pl={7}
                            borderRadius="0 40px 40px 0"
                            colorScheme="black"
                            size="lg"
                            fontWeight="bold"
                            className="hover-color-primary"
                        >
                            {(() => {
                                if (isTypingText) {
                                    return <BsPauseCircle />;
                                } else if (isGeneratingText) {
                                    return <AnimatedFiZap />;
                                } else {
                                    return <FiZap />;
                                }
                            })()}
                        </Button>

                    </Box>
                </Flex>

                {generatedText ? <Box
                    ref={boxRef}
                    padding="10px 10px"
                    margin="15px 0 0 0"
                    borderRadius="15px 15px 0 0"
                    background="#181818"
                    color="white"
                    width="100%"
                    minHeight="300px"
                    maxHeight="300px"
                    overflow="scroll"
                >  <ReactTyped
                        typedRef={setTyped}
                        strings={[generatedText]}
                        typeSpeed={15}
                        onComplete={() => setIsTypingText(false)}
                        onStop={() => setIsTypingText(false)}
                        onBegin={() => setIsTypingText(true)}
                        className={isTypingText ? 'cursor-visible' : 'cursor-hidden'}
                    />
                </Box> : <Box padding="10px 10px"
                    margin="15px 0 0 0"
                    borderRadius="15px"
                    background="#181818"
                    color="white"
                    width="100%"
                    minHeight="300px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >

                    <Text
                        as="h3"
                        textStyle="body"
                        color="white"
                        fontWeight={600}
                        overflowX="auto"
                        fontSize="25px"
                    >
                        Generate blog post drafts, summaries, or even recommendations for further reading
                    </Text>
                </Box>}
                {generatedText && <GeneratedContentToolbar generatedContent={generatedText} />}
            </Flex>
        </ContentGeneratorWrapper>
    )
}

export default ContentGenerator