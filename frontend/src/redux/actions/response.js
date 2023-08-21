import { FETCH_RESPONSES_FAILURE, FETCH_RESPONSES_SUCCESS } from "../actions/types";
import responseDataService from "../../services/response.service";


export const getResponseDataSuccess = (responses) => ({
  type: FETCH_RESPONSES_SUCCESS,
  payload: responses,
});

export const getResponseDataFailure = (error) => ({
  type: FETCH_RESPONSES_FAILURE,
  payload: error,
});

// Assuming you have imported responseDataService and defined the required action types
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



export const exportResponseToExcel = () => async (dispatch) => {
  try {
    const response = await responseDataService.exportResponse();
    // No need to dispatch anything for successful export
  } catch (error) {
    console.error('Error exporting response to Excel:', error);
    // You can dispatch an action here to handle the error if needed
  }
};

  