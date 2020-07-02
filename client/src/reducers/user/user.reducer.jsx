import UserActionTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: {},
  sameDomainUsers: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case UserActionTypes.SET_CURRENT_USER:
    //    return { ...state, currentUser: action.payload};

    case UserActionTypes.LOCAL_REGISTER:
      if (!action.payload) return false;
      return { ...state, ...action.payload };

    case UserActionTypes.LOCAL_LOGIN:
      if (!action.payload) return false;
      return { ...state, ...action.payload };

    case UserActionTypes.FETCH_USER:
      if (!action.payload) return false;
      return { ...state, ...action.payload };

    case UserActionTypes.USER_LOGOUT:
      return false;

    case UserActionTypes.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };

    case UserActionTypes.FETCH_USER_START:
      return {
        ...state,
        isFetching: true,
      };
    case UserActionTypes.FETCH_USER_SUCCESS:
      return action.payload.data;

    case UserActionTypes.FETCH_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload,
      };

    case UserActionTypes.UPDATE_PLAN:
      return {
        ...state,
        ...action.payload,
      };
    case UserActionTypes.FETCH_SAME_DOMAIN_EMAILS:
      return {
        ...state,
        sameDomainUsers: action.payload,
      };
    case UserActionTypes.FETCH_USER_FAILURE:
       return {
          ...state,
          isFetching: false,
          errorMessage: action.payload
       };
    case UserActionTypes.UPDATE_PLAN:
       return {
          ...state,
          ...action.payload
       }
    case UserActionTypes.FETCH_SAME_DOMAIN_EMAILS:
       return {
          ...state,
          sameDomainUsers: action.payload
       }
    case UserActionTypes.USER_AUTH_ERROR:
       return {
          ...state,
          authError: action.payload[0],
          email: action.payload[1]
       }

    default:
       return state;
   }
};

export default userReducer;
