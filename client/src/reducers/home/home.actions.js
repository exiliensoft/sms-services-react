import { fetchContactsStartAsync } from "../contact/contact.actions";
import { fetchChatStartAsync } from "../conversation/conversation.actions";
import {
  fetchGroupFailure,
  fetchGroupStartAsync,
} from "../group/group.actions";
import { fetchListsStartAsync } from "../list/list.actions";
import { updateNewMessage } from "../message/message.actions";
import { fetchDidStartAsync } from "../did/did.actions";
import HomeActionTypes from "./home.types";
/* ----------------------------------------------------------- */
/* Profile Toggle: home.profile true/false (not in use) */
/* ----------------------------------------------------------- */
export const toggleProfileHidden = () => ({
  type: HomeActionTypes.TOGGLE_PROFILE_HIDDEN,
});

/* ----------------------------------------------------------- */
/* Sidebar Toggle: home.openSidebar true/false (not in use) */
/* ----------------------------------------------------------- */
export const openSidebar = (openSidebar) => ({
  type: HomeActionTypes.TOGGLE_OPEN_SIDEBAR,
  payload: openSidebar,
});

/* ------------------------------------------------- */
/* Navigation Tabs: state.home.link, state.home.active */
/* ------------------------------------------------- */
/* For taking in the current Naviagtion tab and fetching/updating the necessesary data */
export const setNavLinkAsync = (link) => async (dispatch) => {
  dispatch(setNavLink(link));
  try {
    if (link === "chats") {
      dispatch(updateNewMessage(false));
      dispatch(fetchChatStartAsync());
      localStorage.setItem("link", "chats");
    } else if (link === "groups") {
      dispatch(fetchGroupStartAsync());
      localStorage.setItem("link", "groups");
    } else if (link === "dids") {
      dispatch(fetchDidStartAsync());
      localStorage.setItem("link", "dids");
    } else if (link === "contacts") {
      dispatch(fetchContactsStartAsync());
      localStorage.setItem("link", "contacts");
    } else if (link === "lists") {
      dispatch(fetchListsStartAsync());
      localStorage.setItem("link", "lists");
    }
  } catch (error) {
    dispatch(fetchGroupFailure(error.message));
    throw error;
  }
};

/* Works with setNavLinkAsync to update the home.link and home.active */
export const setNavLink = (link) => ({
  type: HomeActionTypes.SET_NAV_LINK,
  payload: link,
});

export const updateConversationModal = (obj) => ({
  type: HomeActionTypes.UPDATE_CONVERSATION_MODAL,
  payload: obj,
});

export const updateNewSmsModal = (obj) => ({
  type: HomeActionTypes.UPDATE_NEW_Group_MODAL,
  payload: obj,
});

export const updateModifyGroupModal = (obj) => ({
  type: HomeActionTypes.MODIFY_Group_MODAL,
  payload: obj,
});

export const updateModifyDidModal = (obj) => ({
  type: HomeActionTypes.MODIFY_DID_MODAL,
  payload: obj,
});

export const updateNewDidModal = (obj) => ({
  type: HomeActionTypes.UPDATE_NEW_DID_MODAL,
  payload: obj,
});

export const deleteDidModal = (obj) => ({
  type: HomeActionTypes.DELETE_DID_MODAL,
  payload: obj,
});

export const deleteGroupModal = (obj) => ({
  type: HomeActionTypes.DELETE_Group_MODAL,
  payload: obj,
});

export const updateFilterConversationModal = (obj) => ({
  type: HomeActionTypes.FILTER_CONVERSATION,
  payload: obj,
});
