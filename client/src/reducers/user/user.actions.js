import axios from "axios";
import UserActionTypes from "./user.types";

// export const setCurrentUser = user => ({
//    type: UserActionTypes.SET_CURRENT_USER,
//    payload: user
// });

// Local Register
export const initiateLocalRegister = (credentials) => async (dispatch) => {
  const response = await axios.post(`/authorization/register/local`,
    credentials
  );
  window.location.href = response.data.redirect;
};

// Local Login
export const initiateLocalLogin = (credentials) => async (dispatch) => {
  const response = await axios.post(`/authorization/local`, credentials);
  dispatch(updatingUserAuthError(response.data.authError, response.data.email))
  localStorage.setItem("link", "chats");
  if (!response.data.authError) {
    window.location.href = response.data.redirect;
  }
  dispatch({ type: UserActionTypes.LOCAL_LOGIN, payload: response.data });
};

// Function for making a payment
export const handleToken = (token, purchaseAmount) => async (dispatch) => {
  const response = await axios.post(`/charge/stripe/${purchaseAmount}`, token);

  dispatch({ type: UserActionTypes.FETCH_USER, payload: response.data });
};

// Function for making a payment
export const updatePlans = (token, plans) => async (dispatch) => {
  await axios.post(`/plans/user`, { token, plans });

  dispatch({ type: UserActionTypes.UPDATE_PLAN, payload: plans });
};

//  User Logout Action
export const userLogout = (_) => async (dispatch) => {
  await axios.get("/authorization/logout");
  localStorage.clear();

  dispatch({ type: UserActionTypes.USER_LOGOUT });
};

// Function and API to grab current user info
export const fetchUser = (_) => async (dispatch) => {
  const response = await axios.get("/authorization/current_user");

  dispatch({ type: UserActionTypes.FETCH_USER, payload: response.data });
};

// Function to update user info
export const updateUser = (state) => async (dispatch) => {
  const { given_name, family_name, cell_phone, picture } = state;

  const data = {};
  //if (picture)
  //   data.append('file', picture)
  if (given_name) data["given_name"] = given_name;
  if (family_name) data["family_name"] = family_name;
  if (cell_phone) data["cell_phone"] = cell_phone;
  await axios.put("/user/current_user", data);

  dispatch({ type: UserActionTypes.UPDATE_USER, payload: data });
};

export const fetchSameDomainUsersList = (_) => async (dispatch) => {
  let response = await axios.post("/group/domain");

  await dispatch(fetchSameDomainUsersListAsync(response.data));
};

export const fetchUserStart = () => ({
  type: UserActionTypes.FETCH_USER_START,
});

export const fetchUserSuccess = (userMap) => ({
  type: UserActionTypes.FETCH_USER_SUCCESS,
  payload: userMap,
});

export const fetchUserFailure = (errorMessage) => ({
  type: UserActionTypes.FETCH_USER_FAILURE,
  payload: errorMessage,
});

export const fetchSameDomainUsersListAsync = (emailObj) => ({
  type: UserActionTypes.FETCH_SAME_DOMAIN_EMAILS,
  payload: emailObj,
});

export const fetchUserStartAsync = () => async (dispatch) => {
  dispatch(fetchUserStart());

  try {
    const currentUser = await axios.get("/authorization/current_user");

    dispatch(fetchUserSuccess(currentUser));
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
    throw error;
  }
};

// For updating the store with auth errors
export const updatingUserAuthError = (error, email) => ({
  type: UserActionTypes.USER_AUTH_ERROR,
  payload: [error, email]
});

// For resending local email auth email an updating the redux store
export const resendConfirmationEmail = email => async (dispatch) => {
  try {
    await axios.post('/authorization/email_confirmation_resend', {
      email: email
    })
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
    throw error;
  }
  dispatch(updatingUserAuthError(null))
};

// For resending forgot password email
export const sendForgotPasswordEmail = email => async (dispatch) => {
  try {
    let response = await axios.post('/authorization/forgot_password', {
      email: email
    })
    dispatch(updatingUserAuthError(response.data, email))
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
    throw error;
  }
};

// For forgot password, password reset
export const resetPassword = (token, password) => async (dispatch) => {
  try {
    let response = await axios.post('/authorization/reset_password', {
      token: token,
      password: password
    })
    return response.data.redirect
    // window.location.href = response.data.redirect;
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
    throw error;
  }
};