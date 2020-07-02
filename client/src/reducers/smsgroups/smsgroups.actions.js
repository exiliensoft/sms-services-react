import axios from "axios";
import { updateFilterSmsGroup } from "../../reducers/conversation/conversation.actions";
import { fetchDidStartAsync } from "../phonenumber/did.actions";
import SmsGroupTypes from "./smsgroup.types";

export const createNewSMSGroup = (state) => async (dispatch) => {
  const {
    newGroupName,
    newGroupDescription,
    newSMSGroupNewMembers,
    newSMSGroupPhoneNumberReRoute,
    addedMembers,
    selected_fields,
    checked_fields,
  } = state;

  await axios.post("sms_group", {
    newSMSGroupPhoneNumberReRoute,
    group_name: newGroupName,
    group_description: newGroupDescription,
    members: newSMSGroupNewMembers,
    addedMembers,
    selected_fields: selected_fields,
    checked_fields,
  });

  dispatch(fetchDidStartAsync());
  dispatch(fetchSmsGroupStartAsync());
};

export const updateSMSGroup = (group_id, state) => async (dispatch) => {
  const {
    newGroupName,
    newGroupDescription,
    addedMembers,
    deletedMembers,
    modifiedUncheckedPhoneNumberSMSGroup,
    newSMSGroupPhoneNumberReRoute,
    selected_fields,
    checked_fields,
  } = state;
  console.log(state);
  await axios.patch("/sms_group", {
    modifiedUncheckedPhoneNumberSMSGroup,
    newSMSGroupPhoneNumberReRoute,
    group_id,
    group_name: newGroupName,
    group_description: newGroupDescription,
    addedMembers: addedMembers,
    deletedMembers: deletedMembers,
    fields: selected_fields,
    checked_fields,
  });

  dispatch(fetchDidStartAsync());
  // dispatch(fetchChatStartAsync())
  dispatch(fetchSmsGroupStartAsync());
};

export const acceptGroupRequest = (groupId) => async (dispatch) => {
  await axios.post(`/sms_group/accept`, { id: groupId });
  dispatch(fetchSmsGroupStartAsync());
};

export const rejectGroupRequest = (groupId) => async (dispatch) => {
  await axios.post(`/sms_group/reject`, { id: groupId });
  dispatch(fetchSmsGroupStartAsync());
};

export const deleteSMSGroup = (groupId) => async (dispatch) => {
  await axios.delete(`/sms_group/${groupId}`);

  await dispatch(fetchDidStartAsync());
  // dispatch(fetchChatStartAsync())
  await dispatch(fetchSmsGroupStartAsync());
};

export const deleteSMSGroupMember = (obj) => ({
  type: SmsGroupTypes.DELETE_SMS_GROUP_MEMBER,
  payload: obj,
});

export const addSMSGroupMember = (obj) => ({
  type: SmsGroupTypes.ADD_SMS_GROUP_MEMBER,
  payload: obj,
});

/* Action to grab all SMS Groups */
export const fetchSmsGroupStartAsync = (status) => async (dispatch) => {
  // dispatch(fetchSmsGroupStart());

  try {
    const sms_group_data = await axios.get("/sms_group");
    const smsGroupData = {
      data: sms_group_data.data.owned_groups,
      member_groups: sms_group_data.data.member_groups,
    };
    dispatch(fetchSmsGroupSuccess(smsGroupData));

    if (status) {
      dispatch(
        updateFilterSmsGroup(smsGroupData.data.map((group) => group.id))
      );
    }
  } catch (error) {
    dispatch(fetchSmsGroupFailure(error.message));
    throw error;
  }
};

export const fetchSmsGroupStart = () => ({
  type: SmsGroupTypes.FETCH_SMS_GROUP_START,
});

/* Runs when fetchSmsGroupStartAsync suceeds, fetchingSMSGroups: false, sms_groups: action.payload  */
export const fetchSmsGroupSuccess = (smsData) => ({
  type: SmsGroupTypes.FETCH_SMS_GROUP_SUCCESS,
  payload: smsData,
});

/* Runs when fetchSmsGroupStartAsync fails, fetchingSMSGroups: false, errorMessage: action.payload  */
export const fetchSmsGroupFailure = (errorMessage) => ({
  type: SmsGroupTypes.FETCH_SMS_GROUP_FAILURE,
  payload: errorMessage,
});
