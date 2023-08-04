import { FETCH_RESPONSES_FAILURE, FETCH_RESPONSES_SUCCESS } from "../actions/types";

const initialState = {
    responses: [], // Set the initial state as an empty array
    loading: false,
    error: null,
  };
  
  const responseReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_RESPONSES_SUCCESS:
        return {
          ...state,
          responses: action.payload,
          loading: false,
          error: null,
        };
      case FETCH_RESPONSES_FAILURE:
        return {
          ...state,
          responses: [], // Reset the responses to an empty array on failure
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default responseReducer;
  