const appActions = {
  SET_SAVED_DRAFTS: "SET_SAVED_DRAFTS",
  SET_USER_DATA: "SET_USER_DATA",

  setSavedDrafts: (data: SavedDraft[]) => ({
    type: appActions.SET_SAVED_DRAFTS,
    data,
  }),
  setUserData: (data: oauth2userinfo) => ({
    type: appActions.SET_USER_DATA,
    data,
  }),
};

export default appActions;
