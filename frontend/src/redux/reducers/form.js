import { SET_QUESTIONS, CHANGE_TYPE, SET_DOC_NAME, SET_DOC_DESC, RETRIEVE_FORMS, DELETE_FORM, GET_FORM_DETAILS_SUCCESS, GET_FORM_DETAILS_FAILURE,UPDATE_FORM_DETAILS } from "../actions/types";

export const initialState = {
    questions: [{ questionText: "Question", questionType: "radio", options: [{ optionText: "Option 1" }], open: true, required: false }],
    questionType: "radio",
    doc_name: "Untitled form",
    doc_desc: "add the description",
    forms: [],
    formDetails: {},
    loading: false,
    error: null,
}

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_QUESTIONS:
            return {
                ...state, questions: action.questions,
            };
        case CHANGE_TYPE:
            return {
                ...state, questionType: action.questionType,
            };
        case SET_DOC_NAME:
            return {
                ...state, doc_name: action.doc_name,
            };
        case SET_DOC_DESC:
            return {
                ...state, doc_desc: action.doc_desc,
            };
        case RETRIEVE_FORMS:
            return {
                ...state,
                forms: action.payload,
            };
        case DELETE_FORM:
            return {
                ...state,
                forms: state.forms.filter((form) => form.id !== action.payload),
            };
        case GET_FORM_DETAILS_SUCCESS:
            return {
                ...state,
                formDetails: action.payload, // Make sure that action.payload includes the questions array
                error: null,
            };
        case GET_FORM_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            case UPDATE_FORM_DETAILS:
                return {
                  ...state,
                  questions: action.payload.questions,
                  doc_name: action.payload.doc_name,
                  doc_desc: action.payload.doc_desc,
                };
        default:
            return state;
    }
}

export default formReducer;