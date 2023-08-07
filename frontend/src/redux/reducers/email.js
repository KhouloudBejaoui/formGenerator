import { SEND_FORM_EMAIL_SUCCESS, SEND_FORM_EMAIL_FAILURE, SEND_FORM_EMAIL_REQUEST} from "../actions/types";

  const initialState = {
    loading: false,
    error: null,
    response: null,
  };
  
  const emailReducer = (state = initialState, action) => {
    switch (action.type) {
      case SEND_FORM_EMAIL_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
          response: null,
        };
      case SEND_FORM_EMAIL_SUCCESS:
        return {
          ...state,
          loading: false,
          error: null,
          response: action.payload,
        };
      case SEND_FORM_EMAIL_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
          response: null,
        };
      default:
        return state;
    }
  };
  
  export default emailReducer;
  