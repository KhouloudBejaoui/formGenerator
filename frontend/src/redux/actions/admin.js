import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,SET_ADMIN_DETAILS } from './types.js'
import AdminDataService from "../../services/admin.service";
import axios from 'axios';

// Action creators
export const registerSuccess = (token) => ({
    type: REGISTER_SUCCESS,
    payload: token,
});

export const registerFailure = (error) => ({
    type: REGISTER_FAILURE,
    payload: error,
});

export const loginSuccess = (token) => ({
    type: LOGIN_SUCCESS,
    payload: token,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: LOGOUT,
});

export const setAdminDetails = (adminDetails) => {
    return {
      type: SET_ADMIN_DETAILS,
      payload: adminDetails,
    };
  };


// Async action creator for registration
export const registerAdmin = (adminData) => {
    return async (dispatch) => {
        try {
            // Call the AdminDataService.create method to register the admin
            const response = await AdminDataService.register(adminData);

            // Assuming the server responds with a token upon successful registration
            const { token } = response.data;

            // Dispatch REGISTER_SUCCESS action with the token
            dispatch(registerSuccess(token));

            // Return the response data
            return response.data;
        } catch (error) {
            // Dispatch REGISTER_FAILURE action with the error message
            dispatch(registerFailure(error.message));

            // Return the error
            throw error;
        }
    };
};



 /* export const loginAdmin = (adminData) => {
    return async (dispatch) => {
      try {
        // Make the API request to the backend for login
        const response = await AdminDataService.login(adminData);
  
        // Assuming the server responds with a token upon successful login
        const { token } = response.data;
  
        // Dispatch the LOGIN_SUCCESS action with the token if the login is successful
        dispatch(loginSuccess(token));
  
        // Fetch the admin's details using the token
        const adminDetailsResponse = await AdminDataService.getAdminDetails(token);
  
        // Dispatch an action to store the admin's details in the state
        dispatch(setAdminDetails(adminDetailsResponse.data));
  
        // Return the entire response object
        return response.data;
      } catch (error) {
        // Dispatch the LOGIN_FAILURE action with the error message if the login fails
        dispatch(loginFailure(error.message));
        // Throw the error to indicate that the login failed
        throw error;
      }
    };
  };*/
  
  
  export const loginAdmin = (adminData) => {
    return async (dispatch) => {
      try {
        // Make the API request to the backend for login
        const response = await AdminDataService.login(adminData);
        
        // Assuming the server responds with a token upon successful login
        const { token } = response.data;
        
        // Store the token in localStorage or a secure cookie
        localStorage.setItem('token', token);
  
        // Dispatch the LOGIN_SUCCESS action with the token if the login is successful
        dispatch(loginSuccess(token));
  
        // Fetch the admin's details using the extracted token
        const adminDetailsResponse = await AdminDataService.getAdminDetails(token);
  
        // Dispatch an action to store the admin's details in the state
        dispatch(setAdminDetails(adminDetailsResponse.data));
  
        // Return the entire response object
        return response.data;
      } catch (error) {
        // Dispatch the LOGIN_FAILURE action with the error message if the login fails
        dispatch(loginFailure(error.message));
        // Throw the error to indicate that the login failed
        throw error;
      }
    };
  };
  