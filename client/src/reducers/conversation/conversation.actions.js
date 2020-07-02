import axios from "axios";
import { fetchMessageStartAsync } from "../message/message.actions";
import ConversationActionTypes from "./conversation.types";
export const createNewConversation = (obj) => async (dispatch) => {
  try {
    const conversation = await axios.post("/conversation", obj);
    await dispatch(fetchChatStartAsync());
    dispatch(
      fetchMessageStartAsync({
        key: conversation.data.id,
        name: conversation.data.name,
        phone: obj.phone,
        did: conversation.data._did,
        _group: conversation.data._group,
      })
    );
    dispatch(getUsersForConversation({ conversationId: conversation.data.id }));
    dispatch(fetchChatStartAsync());
  } catch (e) {
    if (
      e.response &&
      e.response.data &&
      e.response.data.msg == "Conversation already exists"
    ) {
      const conversation = e.response.data.existingConversation;
      dispatch(
        fetchMessageStartAsync({
          key: conversation.id,
          name: conversation.name,
          phone: obj.phone,
          did: conversation._did,
          _group: conversation._group,
        })
      );
      dispatch(getUsersForConversation({ conversationId: conversation.id }));
      dispatch(fetchChatStartAsync());
    }
    console.log(e.response);
  }
};

/* ------------------------------------------------- */
/* CHATS ACTIONS */
/* ------------------------------------------------- */
/* Runs when fetchChatStartAsync starts, fetchingChats: true */
export const fetchChatStart = () => ({
  type: ConversationActionTypes.FETCH_CHAT_START,
});

/* Runs when fetchChatStartAsync suceeds, fetchingChats: false, chats: action.payload */
export const fetchChatSuccess = (map) => ({
  type: ConversationActionTypes.FETCH_CHAT_SUCCESS,
  payload: map,
});

/* Runs when fetchChatStartAsync fails, fetchingChats: false, errorMessage: action.payload */
export const fetchChatFailure = (errorMessage) => ({
  type: ConversationActionTypes.FETCH_CHAT_FAILURE,
  payload: errorMessage,
});

/* Action to fetch all chats */
export const fetchChatStartAsync = () => async (dispatch) => {
  // dispatch(fetchChatStart());

  try {
    const chat_messages_data = await axios.get("/conversation");
    const chatData = {
      data: chat_messages_data.data
        ? chat_messages_data.data.map((item) => {
            return { ...item };
          })
        : null,
    };
    dispatch(fetchChatSuccess(chatData));
  } catch (error) {
    dispatch(fetchChatFailure(error.message));
    throw error;
  }
};

export const updateConversation = (conversationId, body) => async (
  dispatch
) => {
  let response = await axios.put(`/conversation/${conversationId}`, body);
  dispatch(updateIndividualConversation(response.data));
};

export const updateIndividualConversation = (obj) => ({
  type: ConversationActionTypes.UPDATE_INDIVIDUAL_CONVERSATION,
  payload: obj,
});
/* ------------------------------------------------- */
/* Conversations:  */
/* ------------------------------------------------- */

/* For getting getting all users included in this conversation strictly for tagging */
export const getUsersForConversation = (obj) => async (dispatch) => {
  const value = await axios.get(
    `/conversation/users?conversationId=${obj.conversationId}`
  );
  dispatch(setConversationUsers(value.data.users));
};

/* For updating home.users with all the users in the conversation */
export const setConversationUsers = (users) => ({
  type: ConversationActionTypes.SET_USERS,
  payload: users,
});

/* ?? */
export const updateMessageUnreadCount = (obj) => ({
  type: ConversationActionTypes.UPDATE_MESSAGE_UNREAD,
  payload: obj,
});

/* For updating the status of the unreplied messages, chats: updateMessageUnrepliedStatus(state.chats, action.payload) */
export const updateUnRepliedStatus = (obj) => ({
  type: ConversationActionTypes.UPDATE_UNREPLIED_STATUS,
  payload: obj,
});

export const setSeen = ({ id, conversationId }) => async (dispatch) => {
  await axios.post("/conversation/removeTag", { id, conversationId });
  dispatch(updateSeenToTrue({ id, conversationId }));
};

export const updateSeenToTrue = (obj) => ({
  type: ConversationActionTypes.UPDATE_SEEN_TO_TRUE,
  payload: obj,
});

export const updateFilterGroup = (obj) => ({
  type: ConversationActionTypes.UPDATE_FILTER_GROUP,
  payload: obj,
});

export const updateCloseConversationStatus = (obj) => ({
  type: ConversationActionTypes.UPDATE_CLOSE_COVERSATION_STATUS,
  payload: obj,
});
