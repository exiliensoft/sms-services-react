import axios from 'axios';
import PlanActionTypes from './plan.types';
/* ------------------------------------------------- */
/* PLANS ACTIONS */
/* ------------------------------------------------- */
/* Runs when fetchChatStartAsync starts, fetchingPlans: false */
export const fetchPlansStart = () => ({
    type: PlanActionTypes.FETCH_PLANS_START
});

/* Runs when fetchChatStartAsync suceeds, fetchingPlans: false, plans: action.payload */
export const fetchPlansSuccess = map => ({
    type: PlanActionTypes.FETCH_PLANS_SUCCESS,
    payload: map
})

/* Runs when fetchChatStartAsync fails, fetchingPlans: false, errorMessage: action.payload */
export const fetchPlansFailure = errorMessage => ({
    type: PlanActionTypes.FETCH_PLANS_FAILURE,
    payload: errorMessage
});

/* Action to fetch all plans */
export const fetchChatPlansAsync = () => async dispatch => {
    dispatch(fetchPlansStart());
    try {
        const plans_data = await axios.get('/plans')
        dispatch(fetchPlansSuccess(plans_data.data))
    } catch (error) {
        dispatch(fetchPlansFailure(error.message))
        throw error;
    }
}
