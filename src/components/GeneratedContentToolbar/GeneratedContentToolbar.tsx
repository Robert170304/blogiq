"use client"
import { Flex, For, HStack, IconButton, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiSpeakerWave } from 'react-icons/hi2'
import { Tooltip } from '../ui/tooltip'
import { IoCopy, } from 'react-icons/io5'
import { BsFillSave2Fill } from 'react-icons/bs'
import { copyToClipBoard, stopSpeech, startSpeech } from '../../app/utils/commonFunctions'
import { FaPause } from 'react-icons/fa'
import { SaveDraftModal } from '../SaveDraftModal/SaveDraftModal'
import { useSelector } from 'react-redux'
import type { RootState } from '@blogiq/store/store'
import { isEmpty } from 'lodash'

interface GeneratedContentToolbarProps {
    generatedContent: string;
}

const GeneratedContentToolbar: React.FC<GeneratedContentToolbarProps> = ({ generatedContent }) => {
    const [openDraftModal, setOpenDraftModal] = useState(false);
    const [ttsStatus, setTTSStatus] = useState("idle");
    const userData = useSelector((state: RootState) => state.app.userData);
    const toolbarOptions = [
        {
            id: 1,
            label: ttsStatus === "playing" ? "Pause" : "Read Aloud",
            icon: ttsStatus === "playing" ? <FaPause /> : <HiSpeakerWave />,
            action: () => {
                if (ttsStatus === "playing") {
                    stopSpeech();
                    setTTSStatus("idle");
                } else {
                    startSpeech(generatedContent);
                    const speechResult = startSpeech(generatedContent);
                    if (speechResult) {
                        const { utterance } = speechResult;
                        utterance.onend = () => setTTSStatus("idle")
                        utterance.onerror = () => setTTSStatus("idle")
                        setTTSStatus("playing");
                    }
                }
            },
            active: true,
        },
        {
            id: 2,
            label: 'Copy',
            icon: <IoCopy />,
            action: () => copyToClipBoard(generatedContent),
            active: true,
        },
        {
            id: 3,
            label: 'Save as draft',
            icon: <BsFillSave2Fill />,
            action: () => setOpenDraftModal(true),
            active: !isEmpty(userData),
        }
    ]
    return (
        <Flex>
            <HStack wrap="wrap" gap="0">
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
                                            size="md"
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
            <SaveDraftModal
                generatedContent={generatedContent}
                isOpen={openDraftModal}
                closeModal={() => setOpenDraftModal(false)}
            />
        </Flex>
    )
}

export default GeneratedContentToolbar