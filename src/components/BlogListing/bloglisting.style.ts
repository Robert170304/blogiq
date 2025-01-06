import styled from "@emotion/styled";

const BlogListWrapper = styled.div({
  width: "100%",
  "& .chakra-tabs__trigger[data-selected]": {
    color: "#030303",
    fontWeight: "bold",
    "::after": {
      content: '""',
      position: "absolute",
      bottom: "-2px",
      left: 0,
      width: "100%",
      height: "2px",
      backgroundColor: "black",
    },
  },
  "& .chakra-tabs__trigger": {
    color: "#85878c",
    fontWeight: "bold",
  },
});

export default BlogListWrapper;
