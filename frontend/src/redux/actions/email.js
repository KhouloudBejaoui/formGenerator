import formDataService from '../../services/formData.service';
import { SEND_FORM_EMAIL_SUCCESS, SEND_FORM_EMAIL_FAILURE, SEND_FORM_EMAIL_REQUEST} from "./types";

export const sendFormEmailRequest = () => ({
  type: SEND_FORM_EMAIL_REQUEST,
});

export const sendFormEmailSuccess = (response) => ({
  type: SEND_FORM_EMAIL_SUCCESS,
  payload: response,
});

export const sendFormEmailFailure = (error) => ({
  type: SEND_FORM_EMAIL_FAILURE,
  payload: error,
});

export const sendFormEmail = (id) => async (dispatch) => {
  dispatch(sendFormEmailRequest());
  try {
    const response = await formDataService.sendFormEmail(id);
    dispatch(sendFormEmailSuccess(response.data));
  } catch (error) {
    dispatch(sendFormEmailFailure(error));
  }
};
