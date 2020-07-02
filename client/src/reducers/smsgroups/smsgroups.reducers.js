
import { addMember, removeMember } from "./smsgroup-utils";
import SmsGroupTypes from './smsgroup.types';
const INITIAL_STATE = {
    fetching: true,
    data: [],
    member_groups: []
}

const smsgroupsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SmsGroupTypes.FETCH_SMS_GROUP_START:
            return {
                ...state,
                fetching: true
            };
        case SmsGroupTypes.FETCH_SMS_GROUP_SUCCESS:
            return {
                ...state,
                fetching: false,
                ...action.payload
            };
        case SmsGroupTypes.FETCH_SMS_GROUP_FAILURE:
            return {
                ...state,
                fetching: false,
                errorMessage: action.payload
            };
        case SmsGroupTypes.DELETE_SMS_GROUP_MEMBER:
            return {
                ...state,
                ...removeMember(state, action.payload)
            }
        case SmsGroupTypes.ADD_SMS_GROUP_MEMBER:
            return {
                ...state,
                ...addMember(state, action.payload)
            }
        default:
            return state
    }
}

export default smsgroupsReducer;
