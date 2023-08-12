import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, SET_ADMIN_DETAILS,UPDATE_ADMIN_DETAILS } from "../actions/types";

const initialState = {
    
    auth: {
        token: null,
        isAuthenticated: false,
        error: null,
    },

};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isAuthenticated: true,
                },
                token: action.payload,
                error: null,
            };
        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isAuthenticated: false,
                },
                token: null,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isAuthenticated: false,
                },
                token: null,
                error: null,
            };
        case SET_ADMIN_DETAILS:
            return {
                ...state,
                adminDetails: action.payload,
            };
        case UPDATE_ADMIN_DETAILS:
            return {
                ...state,
                adminDetails: action.payload, // Update admin details
            };
        default:
            return state;
    }
};

export default authReducer;
