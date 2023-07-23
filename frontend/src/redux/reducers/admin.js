import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, SET_ADMIN_DETAILS } from "../actions/types";

const initialState = {
    token: null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                token: action.payload,
                error: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload,
                error: null,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                token: null,
                error: action.payload,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                token: null,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                token: null,
                error: null,
            };
        case SET_ADMIN_DETAILS:
            return {
                ...state,
                adminDetails: action.payload, // Set adminDetails with the payload from the action
            };
        default:
            return state;
    }
};

export default authReducer;
