import { HYDRATE } from "next-redux-wrapper";
import actions from "./actions";

const initialState = {
  userData: {},
  signInUsing: "",
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case actions.SET_USER_DATA:
      return {
        ...state,
        userData: action.data,
        signInUsing: action.signInType,
      };

    default:
      return state;
  }
};

export default appReducer;
