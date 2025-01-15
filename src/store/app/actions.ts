const appActions = {
  SET_USER_DATA: "SET_USER_DATA",

  setUserData: (data: oauth2userinfo) => ({
    type: appActions.SET_USER_DATA,
    data,
  }),
};

export default appActions;
