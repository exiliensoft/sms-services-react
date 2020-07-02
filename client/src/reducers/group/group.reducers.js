
import { addMember, removeMember } from "./group-utils";
import groupTypes from './group.types';
const INITIAL_STATE = {
    fetching: true,
    data: [],
    member_groups: []
}

const groupsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case groupTypes.FETCH_GROUP_START:
            return {
                ...state,
                fetching: true
            };
        case groupTypes.FETCH_GROUP_SUCCESS:
            return {
                ...state,
                fetching: false,
                ...action.payload
            };
        case groupTypes.FETCH_GROUP_FAILURE:
            return {
                ...state,
                fetching: false,
                errorMessage: action.payload
            };
        case groupTypes.DELETE_GROUP_MEMBER:
            return {
                ...state,
                ...removeMember(state, action.payload)
            }
        case groupTypes.ADD_GROUP_MEMBER:
            return {
                ...state,
                ...addMember(state, action.payload)
            }
        default:
            return state
    }
}

export default groupsReducer;
