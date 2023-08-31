import { FETCH_RESPONSES_FAILURE, FETCH_RESPONSES_SUCCESS,FETCH_RESPONSES_USER_FAILURE, FETCH_RESPONSES_USER_SUCCESS } from "../actions/types";

const initialState = {
    Allresponses: [],
    responses:[],
    responseData:{},
    loading: false,
    error: null,
  };
  
  const responseReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_RESPONSES_USER_SUCCESS:
        return {
          ...state,
          responses: action.payload,
          loading: false,
          error: null,
        };
      case FETCH_RESPONSES_USER_FAILURE:
        return {
          ...state,
          responses: [], 
          loading: false,
          error: action.payload,
        };
        case FETCH_RESPONSES_SUCCESS:
          return {
            ...state,
            Allresponses: action.payload,
            loading: false,
            error: null,
          };
        case FETCH_RESPONSES_FAILURE:
          return {
            ...state,
            Allresponses: [], 
            loading: false,
            error: action.payload,
          };
      default:
        return state;
    }
  };
  
  export default responseReducer;
  