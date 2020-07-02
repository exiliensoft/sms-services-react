import axios from "axios";
import { fetchSmsGroupStartAsync } from "../smsgroups/smsgroups.actions";
import { fetchUserStartAsync } from "../user/user.actions";
import PhoneNumberActionTypes from "./did.types";

/* ------------------------------------------------- */
/* PHONE NUMBER ACTIONS */
/* ------------------------------------------------- */
/* Runs when fetchDidStartAsync starts, fetchingSMSGroups: true  */
export const fetchDidStart = () => ({
  type: PhoneNumberActionTypes.FETCH_DID_START,
});

/* Runs when fetchDidStartAsync suceeds, fetchingPhoneNumbers: false, phone_numbers: action.payload */
export const fetchDidSuccess = (map) => ({
  type: PhoneNumberActionTypes.FETCH_DID_SUCCESS,
  payload: map,
});
/* Runs when fetchDidStartAsync fails, fetchingPhoneNumbers: false, errorMessage: action.payload */
export const fetchDidFailure = (errorMessage) => ({
  type: PhoneNumberActionTypes.FETCH_DID_FAILURE,
  payload: errorMessage,
});

/* Action to fetcah all phone numbers */
export const fetchDidStartAsync = () => async (dispatch) => {
  // dispatch(fetchDidStart());

  try {
    const did_data = await axios.get("/did");

    const phoneNumberData = {
      data: did_data.data,
    };
    dispatch(fetchDidSuccess(phoneNumberData));
  } catch (error) {
    dispatch(fetchDidFailure(error.message));
    throw error;
  }
};

export const searchPhoneNumber = (state) => async (dispatch) => {
  const { searchedAreaCode } = state;
  let carriers = state.currentUser.carriers;
  let response = "";
  let responseArray = { Ytel: [], Questblue: [] };

  if (carriers.indexOf("Ytel") !== -1) {
    response = await axios.post("/did/ytel/availablenumber", {
      searchedAreaCode: searchedAreaCode,
    });
    if (response.data.count !== 0) {
      console.log("PAYLOAD", response.data.payload);
      responseArray.Ytel = response.data.payload;
      // responseArray.Ytel = response.data['Phones']['Phone'];
    }
  }
  if (carriers.indexOf("Questblue") !== -1) {
    response = await axios.post("/did/questblue/listAvailableDids", {
      searchedAreaCode: searchedAreaCode,
    });
    responseArray.Questblue = response.data;
  }
  dispatch({
    type: PhoneNumberActionTypes.SEARCH_NUMBER,
    payload: responseArray,
  });
};

export const confirmPurchasePhoneNumbers = (state) => async (dispatch) => {
  const {
    selectedPhoneNumbers,
    purchasePhoneNumberDescription,
    purchasePhoneNumberSMSGroupRoute,
    carrier,
  } = state;
  await Promise.all(
    selectedPhoneNumbers.map(async (number) => {
      if (carrier === "Ytel") {
        return await axios.post("/did/ytel/purchase", {
          number: number,
          description: purchasePhoneNumberDescription,
          sms_group: purchasePhoneNumberSMSGroupRoute,
          carrier: carrier,
          state: "Active",
        });
      }

      if (carrier === "Questblue") {
        return await axios.post("/did/questblue/purchase", {
          number: number,
          description: purchasePhoneNumberDescription,
          sms_group: purchasePhoneNumberSMSGroupRoute,
          carrier: carrier,
          state: "Active",
        });
      }
    })
  );
  await dispatch(fetchUserStartAsync());
  await dispatch(fetchDidStartAsync());
};

export const updatePhoneNumber = (state) => async (dispatch) => {
  const {
    modifiedPhoneNumberDescription,
    modifiedPhoneNumberSMSGroup,
    modifiedPhoneNumberId,
  } = state;

  await axios.patch("/did", {
    id: modifiedPhoneNumberId,
    description: modifiedPhoneNumberDescription,
    _sms_group: modifiedPhoneNumberSMSGroup,
  });
  await dispatch(fetchSmsGroupStartAsync());

  await dispatch(fetchDidStartAsync());
};

export const deleteDid = (props) => async (dispatch) => {
  const { id, number, carrier } = props;
  if (carrier === "Ytel") {
    await axios.post("/did/ytel/release", {
      id: id,
      number: number,
    });
  }
  if (carrier === "Questblue") {
    await axios.post("/did/questblue/release", {
      id: id,
      number: number,
    });
  }

  await dispatch(fetchSmsGroupStartAsync());
  await dispatch(fetchDidStartAsync());
};
