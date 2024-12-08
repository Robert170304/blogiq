"use client"

import { createListCollection, SelectRoot } from "@chakra-ui/react"
import { SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValueText } from "../ui/select"

const frameworks = createListCollection({
    items: [
        { label: "React.js", value: "react" },
        { label: "Vue.js", value: "vue" },
        { label: "Angular", value: "angular" },
        { label: "Svelte", value: "svelte" },
    ],
})

const SelectDropDown = () => {
    return (
        <SelectRoot collection={frameworks} size="sm" width="320px">
            <SelectLabel>Select framework</SelectLabel>
            <SelectTrigger>
                <SelectValueText placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent zIndex="1050" position="absolute">
                {frameworks.items.map((movie) => (
                    <SelectItem item={movie} key={movie.value}>
                        {movie.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}

export default SelectDropDown;


