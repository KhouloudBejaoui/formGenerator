import { SET_QUESTIONS, CHANGE_TYPE, SET_DOC_NAME, SET_DOC_DESC } from "./types";


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
  