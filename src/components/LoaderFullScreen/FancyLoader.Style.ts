import styled from "@emotion/styled";

const FancyLoaderWrapper = styled.div({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 1000,
});

export default FancyLoaderWrapper;
