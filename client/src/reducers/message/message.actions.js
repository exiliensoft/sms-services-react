import axios from "axios";
import {
  updateMessageUnreadCount,
  updateUnRepliedStatus,
} from "../conversation/conversation.actions";
import MessageActionTypes from "./message.types";

/* For updating home.newMessage Not sure what this is for */
export const updateNewMessage = (status) => ({
  type: MessageActionTypes.UPDATE_NEW_MESSAGE,
  payload: status,
});

/* ------------------------------------------------- */
/* Messages: home.messages */
/* ------------------------------------------------- */
/* Runs when fetchMessageStartAsync starts home.fetchingMessage: true */
export const fetchMessageStart = () => ({
  type: MessageActionTypes.FETCH_MESSAGE_START,
});

/* Runs when fetchMessageStartAsync suceeds fetchingMessage: false, messages: action.payload */
export const fetchMessageSuccess = (map) => ({
  type: MessageActionTypes.FETCH_MESSAGE_SUCCESS,
  payload: map,
});

/* Runs when fetchMessageStartAsync fails fetchingMessage: false, messageErrorMessage: action.payload */
export const fetchMessageFailure = (errorMessage) => ({
  type: MessageActionTypes.FETCH_MESSAGE_FAILURE,
  payload: errorMessage,
});

/* Action to begin grabbing the messages */
export const fetchMessageStartAsync = (obj) => async (dispatch) => {
  const { key, name, phone, did, _group } = obj;
  dispatch(fetchMessageStart());
  dispatch(updateMessageUnreadCount({ conversation: key, clear: true }));
  try {
    const response = await axios.get("/message/" + key);
    const messageObjArray =
      response && response.data && response.data.messages
        ? response.data.messages.map((obj) => {
            return {
              ...obj,
              date: new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(obj.date)),
            };
          })
        : null;
    const oldMessageObjArray =
      response && response.data && response.data.oldMessages
        ? response.data.oldMessages.map((oldConversation) => {
            return oldConversation.map((obj) => {
              return {
                ...obj,
                date: new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(obj.date)),
              };
            });
          })
        : null;
    const messageObj = {
      contact: response.data.contact,
      data: messageObjArray,
      key,
      name,
      phone,
      did,
      _group,
      oldMessages: oldMessageObjArray,
    };
    dispatch(fetchMessageSuccess(messageObj));
  } catch (error) {
    dispatch(fetchMessageFailure(error.message));
    throw error;
  }
};

export const uploadFile = ({
  conversationId,
  file,
  internal,
  socket,
}) => async (dispatch) => {
  const data = new FormData();
  data.append("file", file);
  data.append("conversation", conversationId);
  data.append("internal", internal);
  data.append("sent", false);
  data.append("failed", false);

  const response = await axios.post("/message/file", data);

  const chat = response.data.message;
  socket.emit("SEND_MESSAGE", response.data);
  dispatch(addNewChat(response.data));
  dispatch(
    updateUnRepliedStatus({ conversation: conversationId, status: false, chat })
  );
};

/* For adding new message record to db and sending to socket */
export const createNewMessage = ({
  conversationId,
  message,
  internal,
  socket,
  group,
  tags,
  is_close,
}) => async (dispatch) => {
  const response = await axios.post("/message", {
    chat: message,
    conversation: conversationId,
    internal,
    sent: false,
    failed: false,
    tags,
  });

  if (
    response.data.newConversationCreated ||
    response.data.conversationRouted
  ) {
    return;
  }
  socket.emit("SEND_MESSAGE", { ...response.data, ...{ room: group } });
  dispatch(addNewChat(response.data));
  dispatch(
    updateUnRepliedStatus({
      conversation: conversationId,
      status: false,
      message,
    })
  );
};

export const closeMessage = (conversation) => async (dispatch) => {
  await axios.put("/conversation/" + conversation, {
    is_close: true,
  });
};

/* ?? */
export const updateMessageStatus = (obj) => ({
  type: MessageActionTypes.UPDATE_MESSAGE_STATUS,
  payload: obj,
});

/* For updating redux store with new sent message: messages: addMessageToChat(state.messages, action.payload) */
export const addNewChat = (chat) => ({
  type: MessageActionTypes.ADD_NEW_CHAT,
  payload: chat,
});

/* For updating redux store with received message: messages: addReceviedMessageToChat(state.messages, action.payload) */
export const receivedNewMessage = (chat) => ({
  type: MessageActionTypes.RECEIVE_NEW_CHAT,
  payload: chat,
});
