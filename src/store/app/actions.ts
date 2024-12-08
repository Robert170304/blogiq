const actions = {
  SET_SAVED_DRAFTS: "SET_SAVED_DRAFTS",

  setSavedDrafts: (data: SavedDraft[]) => ({
    type: actions.SET_SAVED_DRAFTS,
    data,
  }),
};

export default actions;
