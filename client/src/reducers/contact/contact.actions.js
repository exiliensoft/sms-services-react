import axios from "axios";
import ContactActionTypes from "./contact.types";
export const toggleContact = (obj) => ({
  type: ContactActionTypes.TOGGLE_CONTACT,
  payload: obj,
});

/* ------------------------------------------------- */
/* CONTACTS ACTIONS */
/* ------------------------------------------------- */
/* Runs when fetchContactsStartAsync starts, fetchingContacts: true  */
export const fetchContactsStart = () => ({
  type: ContactActionTypes.FETCH_CONTACTS_START,
});

/* Runs when fetchContactsStartAsync suceeds, fetchingContacts: false, contacts: action.payload */
export const fetchContactsSuccess = (map) => ({
  type: ContactActionTypes.FETCH_CONTACTS_SUCCESS,
  payload: map,
});

/* Runs when fetchContactsStartAsync fails, fetchingContacts: false, errorMessage: action.payload */
export const fetchContactsFailure = (errorMessage) => ({
  type: ContactActionTypes.FETCH_CONTACTS_FAILURE,
  payload: errorMessage,
});

/* Action to grab all contacts */
export const fetchContactsStartAsync = () => async (dispatch) => {
  // dispatch(fetchContactsStart());

  try {
    const contacts_data = await axios.get("/contact");
    console.log(contacts_data);
    const contactsData = {
      data: contacts_data.data,
    };
    dispatch(fetchContactsSuccess(contactsData));
  } catch (error) {
    dispatch(fetchContactsFailure(error.message));
    throw error;
  }
};

export const updateField_Values = (body) => async (dispatch) => {
  console.log(body);
  let value = await axios.put("/contact/values", body);
  dispatch(fetchContactsStartAsync());
};
