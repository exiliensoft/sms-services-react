import PlanActionTypes from "./plan.types";
const INITIAL_STATE = {
  fetching: true,
  errorMessage: undefined,
  sms_plan: [],
  voice_plan: [],
  did_plan: [],
};

const planReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PlanActionTypes.FETCH_PLANS_START:
      return {
        ...state,
        fetching: false,
      };

    case PlanActionTypes.FETCH_PLANS_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.payload,
      };

    case PlanActionTypes.FETCH_PLANS_FAILURE:
      return {
        ...state,
        fetching: false,
        errorMessage: action.payload,
      };

    default:
      return state;
  }
};

export default planReducer;
