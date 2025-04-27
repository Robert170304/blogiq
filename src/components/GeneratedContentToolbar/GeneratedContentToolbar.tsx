"use client"
import { Flex, For, HStack, IconButton, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
// import { HiSpeakerWave } from 'react-icons/hi2'
import { Tooltip } from '../ui/tooltip'
import { IoCopy, } from 'react-icons/io5'
import { BsFillSave2Fill } from 'react-icons/bs'
import { copyToClipBoard } from '../../app/utils/commonFunctions'
// import { FaPause } from 'react-icons/fa'
import { SaveDraftModal } from '../SaveDraftModal/SaveDraftModal'
import { useSelector } from 'react-redux'
import type { RootState } from '@blogiq/store/store'
import { isEmpty } from 'lodash'
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";
// import useTextToSpeech from '@blogiq/hooks/useTextToSpeech'

interface GeneratedContentToolbarProps {
    generatedContent: string;
    setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
    isFullScreen: boolean;
}

const GeneratedContentToolbar: React.FC<GeneratedContentToolbarProps> = ({ generatedContent, setIsFullScreen, isFullScreen }) => {
    const [openDraftModal, setOpenDraftModal] = useState(false);
    const userData = useSelector((state: RootState) => state.app.userData);
    const toolbarOptions = [
        {
            id: 1,
            label: "Expand",
            icon: isFullScreen ? <BiCollapseAlt color='white' /> : <BiExpandAlt color='white' />,
            action: () => setIsFullScreen(!isFullScreen),
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

    return (
        <Flex position="relative" top="-2px" borderRadius="0 0 15px 15px" background="#181818" justifyContent="space-between" alignItems="center">
            <HStack wrap="wrap" gap="5px" background="#202123"
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
            <SaveDraftModal
                generatedContent={generatedContent}
                isOpen={openDraftModal}
                closeModal={() => setOpenDraftModal(false)}
            />
        </Flex>
    )
}

export default GeneratedContentToolbar