import { FETCH_RESPONSES_FAILURE, FETCH_RESPONSES_SUCCESS,FETCH_RESPONSES_USER_SUCCESS,FETCH_RESPONSES_USER_FAILURE } from "../actions/types";
import responseDataService from "../../services/response.service";


export const getResponseDataSuccess = (Allresponses) => ({
  type: FETCH_RESPONSES_SUCCESS,
  payload: Allresponses,
});

export const getResponseDataFailure = (error) => ({
  type: FETCH_RESPONSES_FAILURE,
  payload: error,
});

export const getResponseUserDataSuccess = (responses) => ({
  type: FETCH_RESPONSES_USER_SUCCESS,
  payload: responses,
});

export const getResponseUserDataFailure = (error) => ({
  type: FETCH_RESPONSES_USER_FAILURE,
  payload: error,
});
export const getResponsesByFormId = (formId) => {
    return async (dispatch) => {
      try {
        const response = await responseDataService.getResponseByFormId(formId);
        dispatch(getResponseDataSuccess(response.data));
      } catch (error) {
        dispatch(getResponseDataFailure(error.message));
      }
    };
  };

  export const getResponsesByFormIdAndUserId = (userId,formId) => {
    return async (dispatch) => {
      try {
        const response = await responseDataService.getResponsesByFormIdAndUserId(userId,formId);
        dispatch(getResponseUserDataSuccess(response.data));
      } catch (error) {
        dispatch(getResponseUserDataFailure(error.message));
      }
    };
  };


export const exportResponseToExcel = () => async (dispatch) => {
  try {
    const response = await responseDataService.exportResponse();
    // No need to dispatch anything for successful export
  } catch (error) {
    console.error('Error exporting response to Excel:', error);
    // You can dispatch an action here to handle the error if needed
  }
};

  