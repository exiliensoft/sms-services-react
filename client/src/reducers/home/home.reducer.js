import HomeActionTypes from "./home.types";

const INITIAL_STATE = {
  profile: false,
  openSidebar: false,
  active: "chats",
  link: "chats",
  messageErrorMessage: undefined,
  newMessage: false,
  newGroupModal: false,
  modifyGroupModal: null,
  newDidModal: null,
  ModifyDidModal: null,
  newConversationModal: null,
  deleteDidModal: null,
  deleteGroupModal: null,
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

    case HomeActionTypes.UPDATE_NEW_Group_MODAL:
      return {
        ...state,
        newGroupModal: action.payload,
      };

    case HomeActionTypes.UPDATE_NEW_DID_MODAL:
      return {
        ...state,
        newDidModal: action.payload,
      };

    case HomeActionTypes.MODIFY_Group_MODAL:
      return {
        ...state,
        modifyGroupModal: action.payload,
      };

    case HomeActionTypes.MODIFY_DID_MODAL:
      return {
        ...state,
        ModifyDidModal: action.payload,
      };

    case HomeActionTypes.DELETE_DID_MODAL:
      return {
        ...state,
        deleteDidModal: action.payload,
      };
    case HomeActionTypes.DELETE_Group_MODAL:
      return {
        ...state,
        deleteGroupModal: action.payload,
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
