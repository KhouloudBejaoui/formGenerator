import { SET_QUESTIONS, CHANGE_TYPE, SET_DOC_NAME, SET_DOC_DESC,RETRIEVE_FORMS,DELETE_FORM, GET_FORM_DETAILS_SUCCESS, GET_FORM_DETAILS_FAILURE} from "./types";
import formDataService from "../../services/form.service";


export const setQuestions = (questions) => ({
    type: SET_QUESTIONS,
    questions,
  });
  
  export const changeType = (questionType) => ({
    type: CHANGE_TYPE,
    questionType,
  });
  
  export const setDocName = (doc_name) => ({
    type: SET_DOC_NAME,
    doc_name,
  });
  
  export const setDocDesc = (doc_desc) => ({
    type: SET_DOC_DESC,
    doc_desc,
  });

  export const getFormDetailsSuccess = (formDetails) => ({
    type: GET_FORM_DETAILS_SUCCESS,
    payload: formDetails,
  });
  
  export const getFormDetailsFailure = (error) => ({
    type: GET_FORM_DETAILS_FAILURE,
    payload: error,
  });

  export const saveForm = (formData) => {
    return async (dispatch) => {
      try {
        // Call the formDataService.saveForm method to save the form data
        const response = await formDataService.saveForm(formData);
  
        // Return the response data
        return response.data;
      } catch (error) {
        // Handle the error, dispatch an action if needed
        console.error('Error while saving the form:', error);
        throw error;
      }
    };
  };

  export const retrieveForms = () => async (dispatch) => {
    try {
      const res = await formDataService.getAllFormsFromDB();
  
      dispatch({
        type: RETRIEVE_FORMS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  export const deleteForm = (formId) => async (dispatch) => {
    try {
      // Send a request to the backend to delete the form with the given formId
      await formDataService.deleteForm(formId);
  
      // After successful deletion, dispatch the action to remove the form from the Redux store
      dispatch({
        type: DELETE_FORM,
        payload: formId,
      });
    } catch (error) {
      console.error('Error while deleting form:', error);
    }
  };

  export const getFormDetails = (formId) => async (dispatch) => {
    try {
      const response = await formDataService.getForm(formId);
      dispatch(getFormDetailsSuccess(response.data));
    } catch (error) {
      dispatch(getFormDetailsFailure(error.message));
    }
  };