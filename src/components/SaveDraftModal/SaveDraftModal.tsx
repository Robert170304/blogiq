"use client"

import { useRef, useState } from "react"
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
} from "../ui/dialog"
import { Input, Stack, Text } from "@chakra-ui/react"
import { Field } from "../ui/field"
import SaveDraftModalWrapper from "./savedraftmodal.style"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@blogiq/store/store"
import { notify } from "@blogiq/app/utils/commonFunctions"
import useWindowSize from "@blogiq/hooks/useWindowSizes"
import { apiHelper } from "@blogiq/helpers/apiHelper"

interface SaveDraftModalProps {
    isOpen: boolean;
    closeModal: () => void;
    generatedContent: string;
}


export const SaveDraftModal: React.FC<SaveDraftModalProps> = ({ generatedContent, isOpen, closeModal }) => {
    const userData = useSelector((state: RootState) => state.app.userData);
    const [draftFields, setDraftFields] = useState({ draftName: "", subtitle: "" })
    const [saveDraftLoader, setSaveDraftLoader] = useState(false)
    const ref = useRef<HTMLInputElement>(null)
    const { width } = useWindowSize()

    const saveDraft = async () => {
        setSaveDraftLoader(true);
        try {
            const response = await apiHelper('/api/saveGeneratedContent', 'POST', {
                userId: userData.id,
                draft: {
                    subtitle: draftFields.subtitle,
                    title: draftFields.draftName,
                    content: generatedContent,
                }
            }, true) as SaveDraftResponse;

            if (!response?.draft) {
                setSaveDraftLoader(false);
                notify(response.message || "Failed to save draft", { type: "error" });
                return;
            }
            setSaveDraftLoader(false);
            closeModal()
            notify("Draft saved successfully", { type: "success" });
        } catch (error) {
            console.log("Error saving draft:", error);
            setSaveDraftLoader(false);
            closeModalAction()
            notify("Failed to save draft", { type: "error" });
        }
    };

    const closeModalAction = saveDraftLoader ? () => { } : closeModal;


    return (
        <SaveDraftModalWrapper>
            <DialogRoot
                scrollBehavior="inside"
                size={width !== undefined && width <= 500 ? "full" : "md"}
                motionPreset="slide-in-bottom"
                closeOnInteractOutside={!saveDraftLoader}
                closeOnEscape={!saveDraftLoader}
                onInteractOutside={closeModalAction}
                onEscapeKeyDown={closeModalAction}
                open={isOpen}
                initialFocusEl={() => ref.current}
            >
                <DialogContent colorPalette="white">
                    <DialogHeader>
                        <DialogTitle color="#fff">Create Draft</DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger color="#85878c" onClick={closeModalAction} />
                    <DialogBody pb="4">
                        <Stack gap="4">
                            <Field color="#fff" label="Draft Title">
                                <Input
                                    onChange={(e) => setDraftFields((prev) => ({
                                        ...prev, draftName: e.target.value
                                    }))}
                                    color="#030303"
                                    backgroundColor="#fff"
                                    padding="0 10px"
                                />
                            </Field>
                            <Field color="#fff" label={
                                <>
                                    <Text as="span">Subtitle</Text>
                                    <Text as="span" style={{ color: "#85878c" }}>(Optional)</Text>
                                </>}
                            >
                                <Input
                                    onChange={(e) => setDraftFields((prev) => ({
                                        ...prev, subtitle: e.target.value
                                    }))}
                                    color="#030303"
                                    backgroundColor="#fff"
                                    padding="0 10px"
                                />
                            </Field>
                        </Stack>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button
                                padding="0 20px"
                                onClick={closeModalAction}
                                color="#fff"
                                variant="outline"
                                border="1px solid #27272a"
                                disabled={saveDraftLoader}
                            >Cancel</Button>
                        </DialogActionTrigger>
                        <Button
                            onClick={async () => {
                                await saveDraft()
                            }}
                            padding="0 20px"
                            backgroundColor="#fff"
                            loading={saveDraftLoader}
                            loadingText="Saving..."
                        >Save</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </SaveDraftModalWrapper>
    )
}