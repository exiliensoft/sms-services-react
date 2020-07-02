import { updateCloseConversationStatus, updateConversation, updateMessageUnreadCount, updateMessageUnrepliedStatus, updateSeenStatus } from "./conversation-utils";
import ConversationActionTypes from './conversation.types';
const INITIAL_STATE = {
    fetching: true,
    filterGroups: []
}

const conversationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ConversationActionTypes.FETCH_CHAT_START:
            return {
                ...state,
                fetching: true
            };
        case ConversationActionTypes.FETCH_CHAT_SUCCESS:
            return {
                ...state,
                fetching: false,
                ...action.payload
            };
        case ConversationActionTypes.FETCH_CHAT_FAILURE:
            return {
                ...state,
                fetching: false,
                errorMessage: action.payload
            };
        case ConversationActionTypes.UPDATE_MESSAGE_UNREAD:
            return {
                ...state,
                ...updateMessageUnreadCount(state, action.payload)
            };
        case ConversationActionTypes.UPDATE_UNREPLIED_STATUS:
            return {
                ...state,
                ...updateMessageUnrepliedStatus(state, action.payload)
            };
        case ConversationActionTypes.UPDATE_CLOSE_COVERSATION_STATUS:
            return {
                ...state,
                ...updateCloseConversationStatus(state, action.payload)
            };
        case ConversationActionTypes.UPDATE_SEEN_TO_TRUE:
            return {
                ...state,
                ...updateSeenStatus(state, action.payload)
            }
        case ConversationActionTypes.UPDATE_FILTER_GROUP:
            return {
                ...state,
                filterGroups: action.payload
            }
        case ConversationActionTypes.SET_USERS:
            return {
                ...state,
                users: action.payload
            }
        case ConversationActionTypes.UPDATE_INDIVIDUAL_CONVERSATION:
            return {
                ...state,
                data: updateConversation(state.data, action.payload)
            }
        default:
            return state
    }
}

export default conversationReducer;
