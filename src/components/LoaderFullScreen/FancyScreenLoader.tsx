import { motion } from "framer-motion";
import FancyLoaderWrapper from "./FancyLoader.Style";
import styled from "@emotion/styled";

const Dot = styled(motion.div)`
  width: 3em;
  height: 3em;
  border-radius: 50%;
  position: absolute;
  background-color: ${(props) => props.color};
  box-shadow: -0.5em -0.5em 1em ${(props) => props.color}33 inset,
    0.125em 0.125em 0.25em ${(props) => props.color} inset,
    -0.25em -0.25em 0.75em ${(props) => props.color}AA inset,
    0.75em 0.75em 0.75em rgba(0, 0, 0, 0.7);
`;

// Animation Variants
const animationVariants = {
  a: {
    animate: { rotate: [0, 360], x: [-100, -100] },
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
  b: {
    animate: { rotate: [0, -360], x: [100, 100] },
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
  c: {
    animate: { rotate: [0, 360], y: [-100, -100] },
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
  d: {
    animate: { rotate: [0, -360], y: [100, 100] },
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
};

const FancyLoader = () => {
  return (
    <FancyLoaderWrapper>
      <Dot color="hsl(313, 90%, 60%)" {...animationVariants.a} />
      <Dot color="hsl(253, 90%, 60%)" {...animationVariants.b} />
      <Dot color="hsl(223, 90%, 60%)" {...animationVariants.c} />
      <Dot color="hsl(283, 90%, 60%)" {...animationVariants.d} />
    </FancyLoaderWrapper>
  );
};

export default FancyLoader;
