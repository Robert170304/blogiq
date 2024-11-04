// theme.ts
import { defineConfig, createSystem, defaultConfig } from '@chakra-ui/react';

import { defineTextStyles } from "@chakra-ui/react"

const textStyles = defineTextStyles({
    body: {
        description: "The body text style - used in paragraphs",
        value: {
            fontFamily: "Inter",
        },
    },
})

const config = defineConfig({
    theme: {
        textStyles
    },
})

const system = createSystem(defaultConfig, config);

export default system;
