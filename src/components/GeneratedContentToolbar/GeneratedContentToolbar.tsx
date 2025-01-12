"use client"
import { Box, Flex, For, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiSpeakerWave } from 'react-icons/hi2'
import { Tooltip } from '../ui/tooltip'
import { IoCopy, } from 'react-icons/io5'
import { BsFillSave2Fill } from 'react-icons/bs'
import { copyToClipBoard } from '../../app/utils/commonFunctions'
import { FaPause } from 'react-icons/fa'
import { SaveDraftModal } from '../SaveDraftModal/SaveDraftModal'
import { useSelector } from 'react-redux'
import type { RootState } from '@blogiq/store/store'
import { isEmpty } from 'lodash'
import useTextToSpeech from '@blogiq/hooks/useTextToSpeech'

interface GeneratedContentToolbarProps {
    generatedContent: string;
}

const GeneratedContentToolbar: React.FC<GeneratedContentToolbarProps> = ({ generatedContent }) => {
    const [openDraftModal, setOpenDraftModal] = useState(false);
    const [ttsStatus, setTTSStatus] = useState("idle");
    const userData = useSelector((state: RootState) => state.app.userData);
    const { speak } = useTextToSpeech();
    const toolbarOptions = [
        {
            id: 1,
            label: ttsStatus === "playing" ? "Pause" : "Read Aloud",
            icon: ttsStatus === "playing" ? <FaPause color='white' /> : <HiSpeakerWave color='white' />,
            action: handleSpeechAction,
            active: true,
        },
        {
            id: 2,
            label: 'Copy',
            icon: <IoCopy color='white' />,
            action: () => copyToClipBoard(generatedContent),
            active: true,
        },
        {
            id: 3,
            label: 'Save as draft',
            icon: <BsFillSave2Fill color='white' />,
            action: () => setOpenDraftModal(true),
            active: !isEmpty(userData),
        }
    ]

    function handleSpeechAction() {
        if (ttsStatus === "playing") {
            window.responsiveVoice.pause();
            setTTSStatus("paused");
        } else if (ttsStatus === "paused") {
            window.responsiveVoice.resume();
            setTTSStatus("playing");
        } else {
            speak(generatedContent, {
                voice: "UK English Male",
                rate: 1.1,
                onstart: () => setTTSStatus("playing"),
                onend: () => setTTSStatus("idle"),
            });
        }
    };

    return (
        <Flex position="relative" top="-2px" borderRadius="0 0 15px 15px" background="#181818" justifyContent="space-between" alignItems="center">
            <HStack wrap="wrap" gap="0" background="#202123"
                borderRadius="10px"
                margin="10px">
                <For each={toolbarOptions}>
                    {(option) => {
                        if (option.active) {
                            return (
                                <VStack key={option.id}>
                                    <Tooltip
                                        showArrow
                                        key={option.id}
                                        content={option.label}
                                        contentProps={{ css: { "--tooltip-bg": "#030303", "color": "#fff" } }}
                                    >
                                        <IconButton
                                            aria-label={option.label}
                                            key={option.id}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => option.action()}
                                        >
                                            {option.icon}
                                        </IconButton>
                                    </Tooltip>
                                </VStack>
                            )
                        }
                    }}
                </For>

            </HStack>
            <Box textAlign="center" margin="10px">
                <Text fontSize="10px" color="gray.500">
                    Powered by GPT-4o
                </Text>
            </Box>
            <SaveDraftModal
                generatedContent={generatedContent}
                isOpen={openDraftModal}
                closeModal={() => setOpenDraftModal(false)}
            />
        </Flex>
    )
}

export default GeneratedContentToolbar