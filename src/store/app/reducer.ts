import { HYDRATE } from "next-redux-wrapper";
import actions from "./actions";

const initialState = {
  savedDrafts: [],
  userData: {}
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case actions.SET_SAVED_DRAFTS:
      return {
        ...state,
        savedDrafts: action.data,
      };
    case actions.SET_USER_DATA:
      return {
        ...state,
        userData: action.data,
      };

    default:
      return state;
  }
};

export default appReducer;
