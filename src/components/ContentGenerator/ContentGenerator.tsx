"use client";

import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import GeneratedContentToolbar from "../GeneratedContentToolbar/GeneratedContentToolbar";
import { notify } from "@blogiq/app/utils/commonFunctions";
import ContentGeneratorWrapper from "./ContentGenerator.Style";
import { useSearchParams } from "next/navigation";
import { FiZap } from "react-icons/fi";
import AnimatedFiZap from "./AnimatedFiZap";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const ContentGenerator = () => {
    const searchParams = useSearchParams();
    const [prompt, setPrompt] = useState("");
    const [generatedText, setGeneratedText] = useState(``);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const generateContent = async () => {
        if (!prompt.trim()) return; // Avoid generating for empty prompts.
        setIsGeneratingText(true);
        const res = await fetch("/api/generateContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (res.ok) {
            setTimeout(() => {
                setGeneratedText(
                    data.text
                        .replace(/([^\n])\n([^\n])/g, "$1\n\n$2")
                        .replace(/^\s*---\s*$/gm, "")
                );
            }, 1000);
            setIsGeneratingText(false);
        } else {
            setIsGeneratingText(false);
            console.log("🚀 ~ generateContent ~ data.error:", data.error);
            notify("Failed to generate", { type: "error" });
        }
    };

    useEffect(() => {
        const focusInput = searchParams.get("focusInput"); // Check if focusInput=true
        if (focusInput === "true") {
            const contentInput = document.getElementById("content-generator-input");
            if (contentInput) {
                contentInput.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
                contentInput.focus(); // Focus on the input
            }
            window.history.replaceState(null, "", "/");
        }
    }, [searchParams]); // Re-run the effect if searchParams change

    return (
        <ContentGeneratorWrapper>
            <motion.div
                initial={isFullScreen ? { scale: 0.8, opacity: 0 } : false}
                animate={isFullScreen ? { scale: 1, opacity: 1 } : false}
                exit={isFullScreen ? { scale: 0.8, opacity: 0 } : undefined}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                    position: isFullScreen ? "fixed" : "static",
                    top: isFullScreen ? 0 : "auto",
                    left: isFullScreen ? 0 : "auto",
                    right: isFullScreen ? 0 : "auto",
                    bottom: isFullScreen ? 0 : "auto",
                    background: isFullScreen ? "#181818" : "transparent",
                    zIndex: isFullScreen ? 1111 : "auto",
                }}
            >
                <Flex
                    as="section"
                    justify={!isFullScreen ? "space-between" : "start"}
                    direction="column"
                    h={isFullScreen ? "100vh" : "auto"}
                    padding={{ base: isFullScreen ? "10px 10px 0 10px" : "0", lg: isFullScreen ? "20px 20px 0 20px" : "0" }}
                    overflow="hidden"
                >
                    <Flex as="form" justify="center" width="100%">
                        <Box
                            position="relative"
                            width={{ base: "100%", md: "80%", lg: "60%" }}
                            display="flex"
                            justifyContent="center"
                        >
                            <Textarea
                                id="content-generator-input"
                                className="content-generator-input"
                                textStyle="body"
                                placeholder="Start typing... the AI magic happens next!"
                                size="lg"
                                variant="flushed"
                                borderRadius="20px"
                                background="#fff"
                                border="1px solid #d2d4d8"
                                padding="10px"
                                fontSize="14px"
                                maxH="200px"
                                minH="100px"
                                w={{ base: "100%", lg: "100%" }}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                onKeyUp={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (e.key == "Enter") {
                                        generateContent();
                                    }
                                }}
                                value={prompt}
                            />
                            <Button
                                onClick={() => {
                                    if (!isGeneratingText) {
                                        generateContent();
                                    }
                                }}
                                position="absolute"
                                bottom="10px"             // ← stick 10px from the bottom
                                right="10px"
                                textStyle="body"
                                bg="#030303"
                                color="white"
                                borderRadius="50%"
                                colorScheme="black"
                                size={{ base: "xs", md: "sm" }}
                                fontWeight="bold"
                                className="hover-color-primary"
                                disabled={isGeneratingText}
                            >
                                {(() => {
                                    if (isGeneratingText) {
                                        return <AnimatedFiZap />;
                                    } else {
                                        return <FiZap />;
                                    }
                                })()}
                            </Button>
                        </Box>
                    </Flex>

                    {generatedText ? (
                        <Flex
                            justify="center"
                            width="100%"
                            minHeight="300px"
                            h={isFullScreen ? "100%" : "auto"}
                            maxHeight={isFullScreen ? "auto" : "600px"}
                        >
                            <Box
                                padding="10px 10px"
                                margin="15px 0 0 0"
                                borderRadius="15px 15px 0 0"
                                background="#181818"
                                color="white"
                                width={{ md: "100%", lg: isFullScreen ? "80%" : "100%", base: "100%" }}
                                overflow="auto"
                                className="content-generator-output"
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className={`prose prose-invert max-w-none`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            p: ({ ...props }) => (
                                                <p
                                                    {...props}
                                                    className="prose prose-invert max-w-none"
                                                />
                                            ),
                                        }}
                                    >
                                        {generatedText}
                                    </ReactMarkdown>
                                </motion.div>
                            </Box>
                        </Flex>
                    ) : (
                        <Box
                            padding="10px 10px"
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
                                Generate blog post drafts, summaries, or even recommendations
                                for further reading
                            </Text>
                        </Box>
                    )}
                    {generatedText && (
                        <GeneratedContentToolbar
                            isFullScreen={isFullScreen}
                            setIsFullScreen={setIsFullScreen}
                            generatedContent={generatedText}
                        />
                    )}
                </Flex>
            </motion.div>
        </ContentGeneratorWrapper>
    );
};

export default ContentGenerator;
