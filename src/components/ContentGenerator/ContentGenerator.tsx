"use client"

import { Box, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import TypingText from '../TypingText/TypingText'

const ContentGenerator = () => {
    const [prompt, setPrompt] = useState("Unknown facts about african wildlife")
    const [generatedText, setGeneratedText] = useState("")
    const [isGeneratingText, setIsGeneratingText] = useState(false)

    const generateContext = async () => {
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
            console.log("🚀 ~ generateContext ~ data:", data)
            setGeneratedText("")
            setTimeout(() => {
                setGeneratedText(data.text)
            }, 1000)
            setIsGeneratingText(false)
        } else {
            setIsGeneratingText(false)
            throw new Error(data.error || 'Failed to generate blog post');
        }
    }

    return (
        <Flex
            as="section"
            align="center"
            justify="space-between"
            direction="column"
        >
            <Flex as="form" justify="center" width="100%">
                <Box position="relative" width={{ base: "100%", md: "80%" }} display="flex" justifyContent="center">
                    <Input
                        textStyle="body"
                        placeContent="Enter your prompt"
                        placeholder='Enter your prompt'
                        size="lg"
                        variant="outline"
                        width={{ base: "100%", md: "80%" }}
                        borderRadius="40px 0 0 40px"
                        border="2px solid #e5e7eb"
                        padding="0 40px 0 10px"
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
                                generateContext()
                            }
                        }}
                        value={prompt}
                    />
                    <Button
                        onClick={generateContext}
                        textStyle="body"
                        bg="#030303"
                        color="white"
                        pr={7}
                        pl={7}
                        borderRadius="0 40px 40px 0"
                        colorScheme="black"
                        size="lg"
                        fontWeight="bold"
                        loading={isGeneratingText}
                        loadingText="Generating..."
                    >
                        Generate
                    </Button>
                </Box>
            </Flex>

            {generatedText ? <Box padding="10px 10px"
                margin="15px 0"
                borderRadius="15px"
                background="#181818"
                color="white"
                width="100%"
                minHeight="300px"
            > <TypingText text={generatedText} />
            </Box> : <Box padding="10px 10px"
                margin="15px 0"
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
        </Flex>
    )
}

export default ContentGenerator