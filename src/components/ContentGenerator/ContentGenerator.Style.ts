import styled from "@emotion/styled";

const ContentGeneratorWrapper = styled.div({
  "& .cursor-visible .typed-cursor": {
    visibility: "visible",
  },
  "& .cursor-hidden .typed-cursor": {
    visibility: "hidden",
  },
});

export default ContentGeneratorWrapper;
