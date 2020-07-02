import ListActionTypes from './list.types';

const INITIAL_STATE = {
    fetching: true,
    data: []
}

const homeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ListActionTypes.FETCH_LISTS_START:
            return {
                ...state,
                fetching: true
            };
        case ListActionTypes.FETCH_LISTS_SUCCESS:
            return {
                ...state,
                fetching: false,
                ...action.payload
            };
        case ListActionTypes.FETCH_LISTS_FAILURE:
            return {
                ...state,
                fetching: false,
                errorMessage: action.payload
            };
        default:
            return state
    }
}

export default homeReducer;
