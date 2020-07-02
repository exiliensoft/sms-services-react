import PhoneNumberActionTypes from "./did.types";
const INITIAL_STATE = {
  fetching: true,
  errorMessage: undefined,
  search_response: [],
};

const phoneNumberReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PhoneNumberActionTypes.SEARCH_NUMBER:
      return { ...state, search_response: action.payload };
    case PhoneNumberActionTypes.FETCH_DID_START:
      return {
        ...state,
        fetching: true,
      };
    case PhoneNumberActionTypes.FETCH_DID_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.payload,
      };
    case PhoneNumberActionTypes.FETCH_DID_FAILURE:
      return {
        ...state,
        fetching: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default phoneNumberReducer;
