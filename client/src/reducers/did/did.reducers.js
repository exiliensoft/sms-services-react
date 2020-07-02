import DidActionTypes from "./did.types";
const INITIAL_STATE = {
  fetching: true,
  errorMessage: undefined,
  search_response: [],
};

const DidReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DidActionTypes.SEARCH_NUMBER:
      return { ...state, search_response: action.payload };
    case DidActionTypes.FETCH_DID_START:
      return {
        ...state,
        fetching: true,
      };
    case DidActionTypes.FETCH_DID_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.payload,
      };
    case DidActionTypes.FETCH_DID_FAILURE:
      return {
        ...state,
        fetching: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default DidReducer;
