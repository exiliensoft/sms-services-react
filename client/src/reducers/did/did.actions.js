import axios from "axios";
import { fetchGroupStartAsync } from "../group/group.actions";
import { fetchUserStartAsync } from "../user/user.actions";
import DidActionTypes from "./did.types";

/* ------------------------------------------------- */
/* DID ACTIONS */
/* ------------------------------------------------- */
/* Runs when fetchDidStartAsync starts, fetchingGroups: true  */
export const fetchDidStart = () => ({
  type: DidActionTypes.FETCH_DID_START,
});

/* Runs when fetchDidStartAsync suceeds, fetchingDids: false, phone_numbers: action.payload */
export const fetchDidSuccess = (map) => ({
  type: DidActionTypes.FETCH_DID_SUCCESS,
  payload: map,
});
/* Runs when fetchDidStartAsync fails, fetchingDidrs: false, errorMessage: action.payload */
export const fetchDidFailure = (errorMessage) => ({
  type: DidActionTypes.FETCH_DID_FAILURE,
  payload: errorMessage,
});

/* Action to fetcah all dids */
export const fetchDidStartAsync = () => async (dispatch) => {
  // dispatch(fetchDidStart());

  try {
    const did_data = await axios.get("/did");

    const didData = {
      data: did_data.data,
    };
    dispatch(fetchDidSuccess(didData));
  } catch (error) {
    dispatch(fetchDidFailure(error.message));
    throw error;
  }
};

export const searchDid = (state) => async (dispatch) => {
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
    type: DidActionTypes.SEARCH_NUMBER,
    payload: responseArray,
  });
};

export const confirmPurchaseDids = (state) => async (dispatch) => {
  const {
    selectedDIDs,
    purchaseDIDDescription,
    purchaseDIDGroupRoute,
    carrier,
  } = state;
  await Promise.all(
    selectedDIDs.map(async (number) => {
      if (carrier === "Ytel") {
        return await axios.post("/did/ytel/purchase", {
          number: number,
          description: purchaseDIDDescription,
          group: purchaseDIDGroupRoute,
          carrier: carrier,
          state: "Active",
        });
      }

      if (carrier === "Questblue") {
        return await axios.post("/did/questblue/purchase", {
          number: number,
          description: purchaseDIDDescription,
          group: purchaseDIDGroupRoute,
          carrier: carrier,
          state: "Active",
        });
      }
    })
  );
  await dispatch(fetchUserStartAsync());
  await dispatch(fetchDidStartAsync());
};

export const updateDid = (state) => async (dispatch) => {
  const { modifiedDidDescription, modifiedDidGroup, modifiedDidId } = state;

  await axios.patch("/did", {
    id: modifiedDidId,
    description: modifiedDidDescription,
    _group: modifiedDidGroup,
  });
  await dispatch(fetchGroupStartAsync());

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

  await dispatch(fetchGroupStartAsync());
  await dispatch(fetchDidStartAsync());
};
