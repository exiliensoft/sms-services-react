import axios from "axios";
import io from "socket.io-client";
import {
  fetchChatStartAsync,
  getUsersForConversation,
  updateCloseConversationStatus,
  updateIndividualConversation,
  updateMessageUnreadCount,
  updateUnRepliedStatus,
} from "../conversation/conversation.actions";
import {
  fetchMessageStartAsync,
  receivedNewMessage,
  updateMessageStatus,
  updateNewMessage,
} from "../message/message.actions";
import SocketActionTypes from "./socket.types";

export const connectionChanged = (isConnected) => ({
  type: SocketActionTypes.CONNECTION_CHANGED,
  payload: isConnected,
});

export const connectSocket = (socket) => ({
  type: SocketActionTypes.CONNECT_SOCKET,
  payload: socket,
});

export const connectSocketAsyn = () => async (dispatch, getState) => {
  const currentUser = await axios.get("/authorization/current_user");
  const socket = io("http://localhost:3001");
  if (currentUser)
    socket.emit("join", {
      id: currentUser.data.id,
      email: currentUser.data.email,
    });
  socket.on("RECEIVE_MESSAGE", async function (data) {
    console.log("RECEIVE_MESSAGE");
    console.log(data);
    if (
      !currentUser ||
      (!data.close_type && currentUser.data.id === data._from)
    )
      return;

    if (
      getState().home &&
      getState().conversations &&
      getState().conversations.data &&
      getState().conversations.data.find((obj) => obj.id === data._conversation)
    ) {
      if (getState().home.link === "chats") {
        if (
          getState().messages &&
          getState().messages.key === data._conversation
        ) {
          dispatch(receivedNewMessage(data));
          dispatch(
            updateUnRepliedStatus({
              conversation: data._conversation,
              status: data._from ? false : true,
              message: data.message,
            })
          );
        } else {
          dispatch(
            updateMessageUnreadCount({
              conversation: data._conversation,
              clear: data._from ? true : false,
              message: data.message,
              tags: data.tags,
            })
          );
        }
      } else {
        dispatch(updateNewMessage(true));
      }
    } else {
      dispatch(fetchChatStartAsync());
    }
  });
  socket.on("RECEIVE_MESSAGE_STATUS", async function (data) {
    if (!currentUser) return;
    const { _conversation, id, _from } = data.message;
    if (currentUser.data.id === _from) {
      if (
        getState().home &&
        getState().home.chats &&
        getState().home.chats.data &&
        getState().home.chats.data.find((obj) => obj.id === _conversation)
      ) {
        if (
          getState().home.messages &&
          getState().home.messages.key === _conversation
        ) {
          dispatch(updateMessageStatus({ messageId: id, status: data.status }));
        }
      }
    }
  });
  socket.on("UPDATE_CONVERSATION", async function (data) {
    console.log("UPDATE_CONVERSATION");
    console.log(data);
    if (!currentUser) return;
    dispatch(updateIndividualConversation(data.conversation));
  });
  socket.on("CREATE_CONVERSATION", async function (data) {
    if (!currentUser) return;
    await dispatch(fetchChatStartAsync());
    dispatch(
      fetchMessageStartAsync({
        key: data.id,
        name: data.name,
        phone: data.phone,
        did: data._did,
        _group: data._group,
      })
    );
    dispatch(getUsersForConversation({ conversationId: data.id }));
  });
  socket.on("ROUTE_CONVERSATION", async function (data) {
    if (!currentUser) return;
    dispatch(
      fetchMessageStartAsync({
        key: data.id,
        name: data.name,
        phone: data.phone,
        did: data._did,
        _group: data._group,
      })
    );
    dispatch(getUsersForConversation({ conversationId: data.id }));
  });

  socket.on("RECEIVE_CLOSE_COVERSATION_STATUS", async function (data) {
    if (!currentUser) return;
    const { conversation, status } = data;
    if (
      getState().home &&
      getState().home.chats &&
      getState().home.chats.data &&
      getState().home.chats.data.find((obj) => obj.id === conversation)
    ) {
      dispatch(
        updateCloseConversationStatus({
          conversation: conversation,
          status: status,
        })
      );
    }
  });
  dispatch(connectSocket(socket));
};
