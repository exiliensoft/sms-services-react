import axios from 'axios';
import ListActionTypes from './list.types';
/* ------------------------------------------------- */
/* LISTS ACTIONS */
/* ------------------------------------------------- */
/* Runs when fetchListsStartAsync starts, fetchingLists: true */
export const fetchListsStart = () => ({
    type: ListActionTypes.FETCH_LISTS_START
});

/* Runs when fetchListsStartAsync suceeds, fetchingLists: false, lists: action.payload */
export const fetchListsSuccess = map => ({
    type: ListActionTypes.FETCH_LISTS_SUCCESS,
    payload: map
});

/* Runs when fetchListsStartAsync fails, fetchingLists: false, errorMessage: action.payload */
export const fetchListsFailure = errorMessage => ({
    type: ListActionTypes.FETCH_LISTS_FAILURE,
    payload: errorMessage
});

/* Action to grab all lists */
export const fetchListsStartAsync = () => async dispatch => {
    // dispatch(fetchListsStart());

    try {
        const lists_data = await axios.get('/did')//TODO::Have lists here
        const listsData = {
            data: lists_data.data
        }
        dispatch(fetchListsSuccess(listsData))
    } catch (error) {
        dispatch(fetchListsFailure(error.message))
        throw error;
    }
}