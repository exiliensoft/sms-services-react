import { addMessageToChat, addReceviedMessageToChat, updateMessageStatus } from './message-utils';
import MessageActionTypes from './message.types';

const INITIAL_STATE = {
    fetching: true,
    data: [],
    contact: {},
    conversationId: ""
}

const homeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MessageActionTypes.FETCH_MESSAGE_START:
            return {
                ...state,
                fetching: true
            };
        case MessageActionTypes.FETCH_MESSAGE_SUCCESS:
            return {
                ...state,
                fetching: false,
                ...action.payload,
            };
        case MessageActionTypes.FETCH_MESSAGE_FAILURE:
            return {
                ...state,
                fetching: false,
                messageErrorMessage: action.payload
            };
        case MessageActionTypes.ADD_NEW_CHAT:
            return {
                ...state,
                ...addMessageToChat(state, action.payload)
            };
        case MessageActionTypes.RECEIVE_NEW_CHAT:
            return {
                ...state,
                ...addReceviedMessageToChat(state, action.payload)
            };
        case MessageActionTypes.UPDATE_NEW_MESSAGE:
            return {
                ...state,
                newMessage: action.payload
            };
        case MessageActionTypes.UPDATE_MESSAGE_STATUS:
            return {
                ...state,
                ...updateMessageStatus(state, action.payload)
            };
        default:
            return state

    }
}

export default homeReducer;
