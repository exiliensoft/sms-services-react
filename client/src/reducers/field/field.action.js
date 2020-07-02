import axios from "axios";
import FieldActionTypes from "./field.types";

/* ------------------------------------------------- */
/* FIELDS ACTIONS */
/* ------------------------------------------------- */
export const fetchFieldSStart = () => ({
  type: FieldActionTypes.FETCH_FIELDS_START,
});

export const fetchFieldsSuccess = (map) => ({
  type: FieldActionTypes.FETCH_FIELDS_SUCCESS,
  payload: map,
});

export const fetchFieldsFailure = (errorMessage) => ({
  type: FieldActionTypes.FETCH_FIELDS_FAILURE,
  payload: errorMessage,
});

export const fetchFieldsStartAsync = () => async (dispatch) => {
  try {
    const field = await axios.get("/field");
    const fieldsData = {
      fields: field.data,
    };
    dispatch(fetchFieldsSuccess(fieldsData));
  } catch (error) {
    dispatch(fetchFieldsFailure(error.message));
    throw error;
  }
};

export const addField = (field) => async (dispatch) => {
  dispatch({
    type: FieldActionTypes.ADD_FIELD,
    payload: field,
  });
};

export const deleteField = (field_id) => async (dispatch) => {
  axios.delete(`/field/${field_id}`);
  dispatch({
    type: FieldActionTypes.DELETE_FIELD,
    payload: field_id,
  });
};

export const updateField = (body) => async (dispatch) => {
  axios.put("/field", body);
  dispatch({
    type: FieldActionTypes.UPDATE_FIELD,
    payload: body,
  });
};
