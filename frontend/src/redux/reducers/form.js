import { SET_QUESTIONS, CHANGE_TYPE, SET_DOC_NAME, SET_DOC_DESC } from "../actions/types";

export const initialState = {
    questions: [{ questionText: "Question", questionType: "radio", options: [{ optionText: "Option 1" }], open: true, required: false }],
    questionType: "radio",
    doc_name: "Untitled form",
    doc_desc: "add the description"
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
        default:
            return state;
    }
}

export default formReducer;