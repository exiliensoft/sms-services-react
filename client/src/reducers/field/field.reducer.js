import { updateField } from "./field-utils";
import FieldActionTypes from "./field.types";
const INITIAL_STATE = {
  fields: [],
  fetching: true,
};

const fieldReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FieldActionTypes.FETCH_FIELDS_START:
      return {
        ...state,
        fetching: true,
      };
    case FieldActionTypes.FETCH_FIELDS_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.payload,
      };
    case FieldActionTypes.FETCH_FIELDS_FAILURE:
      return {
        ...state,
        fetching: false,
        errorMessage: action.payload,
      };
    case FieldActionTypes.ADD_FIELD:
      return {
        ...state,
        fields: [...state.fields, action.payload],
      };

    case FieldActionTypes.DELETE_FIELD:
      return {
        ...state,
        fields: state.fields.filter((field) => field.id != action.payload),
      };
    case FieldActionTypes.UPDATE_FIELD:
      return {
        ...state,
        fields: updateField(state.fields, action.payload),
      };
    default:
      return {
        ...state,
      };
  }
};

export default fieldReducer;
