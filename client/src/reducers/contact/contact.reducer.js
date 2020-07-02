import { toggle } from "./contact-utils";
import ContactActionTypes from "./contact.types";
const INITIAL_STATE = {
  openContacts: [],
  fetching: true,
  data: [],
};

const contactReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ContactActionTypes.TOGGLE_CONTACT:
      return {
        ...state,
        openContacts: toggle(state.openContacts, action.payload),
      };

    case ContactActionTypes.FETCH_CONTACTS_START:
      return {
        ...state,
        fetching: true,
      };
    case ContactActionTypes.FETCH_CONTACTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.payload,
      };
    case ContactActionTypes.FETCH_CONTACTS_FAILURE:
      return {
        ...state,
        fetching: false,
        errorMessage: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default contactReducer;
