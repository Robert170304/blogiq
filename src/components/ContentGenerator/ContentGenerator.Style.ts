import styled from "@emotion/styled";

const ContentGeneratorWrapper = styled.div({
  "& .cursor-visible .typed-cursor": {
    visibility: "visible",
  },
  "& .cursor-hidden .typed-cursor": {
    visibility: "hidden",
  },

  "& .content-generator-input::-webkit-scrollbar": {
    display: "none",
  },
  // 🆕 Add this to style your output scrollbar nicely
  "& .content-generator-output::-webkit-scrollbar": {
    width: "8px",
  },
  "& .content-generator-output::-webkit-scrollbar-track": {
    borderRadius: "10px",
  },
  "& .content-generator-output::-webkit-scrollbar-thumb": {
    backgroundColor: "#d1d5db", // Indigo-ish blue thumb
    borderRadius: "10px",
    border: "2px solid transparent",
    backgroundClip: "content-box",
  },
  "& .content-generator-output::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#d1d5db", // Lighter blue on hover
  },
});

export default ContentGeneratorWrapper;
