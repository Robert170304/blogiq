import styled from "@emotion/styled";

const BlogPostCardWrapper = styled.div({
  display: "flex",
  width: "100%",
  "& .postContainer": {
    transition: "box-shadow 0.3s ease",
    "&:hover .fold-corner::after": {
      borderWidth: "2rem",
    },
  },

  "& .imageContainer": {
    position: "relative",
    overflow: "hidden",
    marginBottom: "20px",
    transition: "box-shadow 0.3s ease",
  },

  "& .fold-corner": {
    "&::after": {
      content: '""',
      position: "absolute",
      right: 0,
      top: 0,
      borderStyle: "solid",
      borderWidth: "0",
      borderColor: "#fff #fff #030303 #030303",
      transition: "all 0.4s",
    },
  },

  "& .imageContainer:: after": {
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
    transformOrigin: "top right",
    opacity: 0,
    filter: "blur(2px)",
  },

  ".imageContainer: hover:: before, .imageContainer: hover:: after": {
    opacity: 1,
  },

  "& .cardImage": {
    width: "100%",
    transition: "box-shadow 0.3s ease",
    borderRadius: "2px",
  },

  "& .postContainer:hover .cardImage": {
    boxShadow: "0px 100px 0px 0px rgba(0,0,0,0.1)",
  },

  "& .postContainer:hover .title": {
    textDecoration: "underline",
  },

  "& .glassOverlay": {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80px",
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 15px",
    color: "white",
  },

  "& .cardInfo p": {
    margin: 0,
    fontSize: "14px",
    transition: "text-decoration 0.3s ease",
  },
});

export default BlogPostCardWrapper;
