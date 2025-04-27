"use client"

import { useRef } from "react"
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTitle,
} from "../ui/dialog"
import { Stack } from "@chakra-ui/react"
import useWindowSize from "@blogiq/hooks/useWindowSizes";
import ReactMarkdown from "react-markdown";

interface DraftReadModalProps {
    draftData: SavedDraft;
    isOpen: boolean;
    closeModal: () => void;
}


export const DraftReadModal: React.FC<DraftReadModalProps> = ({ draftData, isOpen, closeModal }) => {
    const ref = useRef<HTMLInputElement>(null)
    const { width } = useWindowSize()
    return (
        <DialogRoot
            scrollBehavior="inside"
            size={width !== undefined && width <= 500 ? "full" : "md"}
            motionPreset="slide-in-bottom"
            closeOnInteractOutside={isOpen}
            closeOnEscape
            onInteractOutside={closeModal}
            onEscapeKeyDown={closeModal}
            open={isOpen}
            initialFocusEl={() => ref.current}
        >
            <DialogContent colorPalette="white">
                <DialogHeader>
                    <DialogTitle fontSize="md" fontWeight="600" color="#fff">{draftData.title}</DialogTitle>
                </DialogHeader>
                <DialogCloseTrigger color="#85878c" onClick={closeModal} />
                <DialogBody pb="4">
                    <Stack gap="4">
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
                            {draftData.content}
                        </ReactMarkdown>
                    </Stack>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    )
}
