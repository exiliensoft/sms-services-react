import axios from "axios";
import { updateFilterGroup } from "../conversation/conversation.actions";
import { fetchDidStartAsync } from "../did/did.actions";
import groupTypes from "./group.types";

export const createNewGroup = (state) => async (dispatch) => {
  const {
    newGroupName,
    newGroupDescription,
    newGroupNewMembers,
    newGroupDIDReRoute,
    addedMembers,
    selected_fields,
    checked_fields,
  } = state;

  await axios.post("group", {
    newGroupDIDReRoute,
    group_name: newGroupName,
    group_description: newGroupDescription,
    members: newGroupNewMembers,
    addedMembers,
    selected_fields: selected_fields,
    checked_fields,
  });

  dispatch(fetchDidStartAsync());
  dispatch(fetchGroupStartAsync());
};

export const updateGroup = (group_id, state) => async (dispatch) => {
  const {
    newGroupName,
    newGroupDescription,
    addedMembers,
    deletedMembers,
    modifiedUncheckedDIDGroup,
    newGroupDIDReRoute,
    selected_fields,
    checked_fields,
  } = state;
  console.log(state);
  await axios.patch("/group", {
    modifiedUncheckedDIDGroup,
    newGroupDIDReRoute,
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
  dispatch(fetchGroupStartAsync());
};

export const acceptGroupRequest = (groupId) => async (dispatch) => {
  await axios.post(`/group/accept`, { id: groupId });
  dispatch(fetchGroupStartAsync());
};

export const rejectGroupRequest = (groupId) => async (dispatch) => {
  await axios.post(`/group/reject`, { id: groupId });
  dispatch(fetchGroupStartAsync());
};

export const deleteGroup = (groupId) => async (dispatch) => {
  await axios.delete(`/group/${groupId}`);

  await dispatch(fetchDidStartAsync());
  // dispatch(fetchChatStartAsync())
  await dispatch(fetchGroupStartAsync());
};

export const deleteGroupMember = (obj) => ({
  type:groupTypes.DELETE_GROUP_MEMBER,
  payload: obj,
});

export const addGroupMember = (obj) => ({
  type:groupTypes.ADD_GROUP_MEMBER,
  payload: obj,
});

/* Action to grab all Groups */
export const fetchGroupStartAsync = (status) => async (dispatch) => {
  // dispatch(fetchGroupStart());

  try {
    const group_data = await axios.get("/group");
    const groupData = {
      data: group_data.data.owned_groups,
      member_groups: group_data.data.member_groups,
    };
    dispatch(fetchGroupSuccess(groupData));

    if (status) {
      dispatch(
        updateFilterGroup(groupData.data.map((group) => group.id))
      );
    }
  } catch (error) {
    dispatch(fetchGroupFailure(error.message));
    throw error;
  }
};

export const fetchGroupStart = () => ({
  type:groupTypes.FETCH_GROUP_START,
});

/* Runs when fetchGroupStartAsync suceeds, fetchingGroups: false, groups: action.payload  */
export const fetchGroupSuccess = (smsData) => ({
  type:groupTypes.FETCH_GROUP_SUCCESS,
  payload: smsData,
});

/* Runs when fetchGroupStartAsync fails, fetchingGroups: false, errorMessage: action.payload  */
export const fetchGroupFailure = (errorMessage) => ({
  type:groupTypes.FETCH_GROUP_FAILURE,
  payload: errorMessage,
});
