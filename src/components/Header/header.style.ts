import styled from "@emotion/styled";

interface HeaderWrapperProps {
  isScrolled: boolean;
}

const HeaderWrapper = styled.div<HeaderWrapperProps>(({ isScrolled }) => ({
  position: "sticky",
  top: 0,
  zIndex: "111",
  background: "#fff",
  borderBottom: isScrolled ? "1px solid #E2E8F0" : "none",
  transition: "border-bottom 0.3s ease", // Smooth transition for border
  display: "flex",
  justifyContent: "center",
  paddingRight: "10px",
  paddingLeft: "10px",
  paddingBottom: "10px",
  paddingTop: "10px",
  // "& .@media (min-width: 48em)": {
  //   paddingRight: "10px",
  //   paddingLeft: "10px",
  //   paddingBottom: "10px",
  //   paddingTop: "10px",
  // },

  // "@media (min-width: 62em)": {
  //   paddingRight: "10px",
  //   paddingLeft: "10px",
  //   paddingBottom: "10px",
  //   paddingTop: "10px",
  // },

  // "@media (min-width: 75em)": {
  //   paddingRight: "20px",
  //   paddingLeft: "20px",
  //   paddingBottom: "20px",
  //   paddingTop: "20px",
  // },
  "& .profile-img-container": {
    borderRadius: "50%",
    border: "1px solid #cbcbcb",
    width: "30px",
    height: "30px",
    img: {
      borderRadius: "50%",
      width: "100%",
      height: "100%",
    },
  },
  "& .avatar-img-container": {
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    img: {
      borderRadius: "50%",
      width: "100%",
      height: "100%",
    },
  },
}));

export default HeaderWrapper;
