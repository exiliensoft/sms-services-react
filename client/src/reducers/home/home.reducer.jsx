import HomeActionTypes from "./home.types";

const INITIAL_STATE = {
  profile: false,
  openSidebar: false,
  active: "chats",
  link: "chats",
  messageErrorMessage: undefined,
  newMessage: false,
  newSmsGroupModal: false,
  modifySmsGroupModal: null,
  newPhoneNumberModal: null,
  modifyPhoneNumberModal: null,
  newConversationModal: null,
  deleteDidModal: null,
  deleteSmsGroupModal: null,
  filterConversationModal: null,
};

const homeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HomeActionTypes.TOGGLE_PROFILE_HIDDEN:
      return {
        ...state,
        profile: !state.profile,
      };
    case HomeActionTypes.TOGGLE_OPEN_SIDEBAR:
      return {
        ...state,
        openSidebar: action.payload,
      };
    case HomeActionTypes.SET_NAV_LINK:
      return {
        ...state,
        link: action.payload,
        active: action.payload,
      };
    case HomeActionTypes.UPDATE_CONVERSATION_MODAL:
      return {
        ...state,
        newConversationModal: action.payload,
      };

    case HomeActionTypes.UPDATE_NEW_SMSGROUP_MODAL:
      return {
        ...state,
        newSmsGroupModal: action.payload,
      };

    case HomeActionTypes.UPDATE_NEW_PHONENUMBER_MODAL:
      return {
        ...state,
        newPhoneNumberModal: action.payload,
      };

    case HomeActionTypes.MODIFY_SMSGROUP_MODAL:
      return {
        ...state,
        modifySmsGroupModal: action.payload,
      };

    case HomeActionTypes.MODIFY_PHONENUMBER_MODAL:
      return {
        ...state,
        modifyPhoneNumberModal: action.payload,
      };

    case HomeActionTypes.DELETE_PHONENUMBER_MODAL:
      return {
        ...state,
        deleteDidModal: action.payload,
      };
    case HomeActionTypes.DELETE_SMSGROUP_MODAL:
      return {
        ...state,
        deleteSmsGroupModal: action.payload,
      };
    case HomeActionTypes.FILTER_CONVERSATION:
      return {
        ...state,
        filterConversationModal: action.payload,
      };

    default:
      return state;
  }
};

export default homeReducer;
