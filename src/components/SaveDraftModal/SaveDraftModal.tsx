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
import { Input, Stack } from "@chakra-ui/react"
import { Field } from "../ui/field"
import SaveDraftModalWrapper from "./savedraftmodal.style"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@blogiq/store/store"
import actions from "@blogiq/store/app/actions"
import moment from "moment"
import { notify } from "@blogiq/app/utils/commonFunctions"
import useWindowSize from "@blogiq/hooks/useWindowSizes"

interface SaveDraftModalProps {
    isOpen: boolean;
    closeModal: () => void;
    generatedContent: string;
}

const { setSavedDrafts } = actions;


export const SaveDraftModal: React.FC<SaveDraftModalProps> = ({ generatedContent, isOpen, closeModal }) => {
    const [draftFields, setDraftFields] = useState({ draftName: "", subtitle: "" })
    const ref = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch();
    const savedDrafts = useSelector((state: RootState) => state.app.savedDrafts);
    console.log("🚀 ~ savedDrafts:", savedDrafts)
    const { width } = useWindowSize()
    return (
        <SaveDraftModalWrapper>
            <DialogRoot
                scrollBehavior="inside"
                size={width !== undefined && width <= 500 ? "full" : "md"}
                motionPreset="slide-in-bottom"
                closeOnInteractOutside
                closeOnEscape
                onInteractOutside={closeModal}
                onEscapeKeyDown={closeModal}
                open={isOpen}
                initialFocusEl={() => ref.current}
            >
                <DialogContent colorPalette="white">
                    <DialogHeader>
                        <DialogTitle color="#fff">Create Draft</DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger color="#85878c" onClick={closeModal} />
                    <DialogBody pb="4">
                        <Stack gap="4">
                            <Field color="#fff" label="Draft Title">
                                <Input
                                    onChange={(e) => setDraftFields((prev) => ({
                                        ...prev, draftName: e.target.value
                                    }))}
                                    color="#030303"
                                    backgroundColor="#fff" />
                            </Field>
                            <Field color="#fff" label="Draft Subtitle">
                                <Input
                                    onChange={(e) => setDraftFields((prev) => ({
                                        ...prev, subtitle: e.target.value
                                    }))}
                                    color="#030303"
                                    backgroundColor="#fff" />
                            </Field>
                        </Stack>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button
                                padding="0 20px"
                                onClick={closeModal}
                                color="#fff"
                                variant="outline"
                                border="1px solid #27272a"
                            >Cancel</Button>
                        </DialogActionTrigger>
                        <Button
                            onClick={() => {
                                dispatch(setSavedDrafts([
                                    ...savedDrafts,
                                    {
                                        id: savedDrafts.length,
                                        subtitle: draftFields.subtitle,
                                        title: draftFields.draftName,
                                        content: generatedContent,
                                        createdOn: moment().format("DD MMM YYYY"),
                                    }
                                ]))
                                notify("Draft Saved.", { type: "success" });
                                closeModal()
                            }}
                            padding="0 20px"
                            backgroundColor="#fff"
                        >Save</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </SaveDraftModalWrapper>
    )
}
