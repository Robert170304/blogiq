import React from 'react';
import { motion } from 'framer-motion';

const AnimatedFiZap = () => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="1.5em"
        height="1.5em"
    >
        <motion.path
            d="M13 2 L3 14 H12 L11 22 L21 10 H12 L13 2 Z" // FiZap's path
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
                duration: 1,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
            }}
        />
    </motion.svg>
);

export default AnimatedFiZap;
