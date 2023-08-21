import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFormDetails } from '../../redux/actions/form';
import { getResponsesByFormId } from '../../redux/actions/response';
import axios from "axios";
import styles from "./userForm.module.css";
import responseDataService from "../../services/response.service";

function Userform() {

  const [percentageAnswered, setPercentageAnswered] = useState(false);
  const [answer, setAnswer] = useState([]);
  const navigate = useNavigate();
  const { userId, formId } = useParams();
  const dispatch = useDispatch();
  const formDetails = useSelector((state) => state.form.formDetails);
  const responses = useSelector((state) => state.response.responses);
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [checkedValues, setCheckedValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const { questions = [], documentName, documentDescription } = formDetails || {};

  useEffect(() => {
    dispatch(getFormDetails(formId));
    dispatch(getResponsesByFormId(formId));
    console.log(responses);
    setStartTime(performance.now());
  }, [dispatch, formId]);

  useEffect(() => {
    if (formDetails && formDetails.questions) {
      // Initialize the answer state based on the questions structure from formDetails
      setAnswer(
        formDetails.questions.map((question) => ({
          question: question.questionText,
          answer: '',
        }))
      );
    }
  }, [formDetails]);
  useEffect(() => {
    if (responses.length > 0 && questions.length > 0) {
      const newInitialCheckValues = {};
      const newInitialRadioValues = {};

      responses[0].responseItems.forEach((item) => {
        const questionText = item.questionText;
        const question = questions.find((q) => q.questionText === questionText);

        if (question && question.questionType === "checkbox") {
          newInitialCheckValues[questionText] = item.textResponse ? item.textResponse.split(",") : [];
        } else if (question && question.questionType === "radio") {
          newInitialRadioValues[questionText] = item.textResponse || "";
        }
      });

      setCheckedValues(newInitialCheckValues);
      setRadioValues(newInitialRadioValues);
    }
  }, [responses, questions]);


  useEffect(() => {
    const initialInputValues = {};

    if (responses.length > 0) {
      responses[0]?.responseItems.forEach((item) => {
        initialInputValues[item.questionText] = item.textResponse || "";
      });
    }

    setInputValues(initialInputValues);
  }, [responses]);

  useEffect(() => {
    async function checkUserResponse() {
      try {
        // Call your service to check if the user has answered
        const response = await responseDataService.checkResponse(userId, formId);
        setPercentageAnswered(response.data.hasAnswered); // Set the hasAnswered state based on the response if the user has responded at least 80% then hasAnswred true
      } catch (error) {
        console.error('Error checking user response:', error);
      }
    }

    // Call the checkUserResponse function when userId and formId are available
    if (userId && formId) {
      checkUserResponse();
    }
  }, [userId, formId]);





  function select(que, option) {
    const updatedAnswer = answer.map((ele) => {
      if (ele.question === que) {
        return { ...ele, answer: option };
      }
      return ele;
    });
    setAnswer(updatedAnswer);
  }

  function selectcheck(que, values) {
    const updatedAnswer = answer.map((ele) => {
      if (ele.question === que) {
        return {
          ...ele,
          answer: values.length > 0 ? values.join(',') : '',
        };
      }
      return ele;
    });

    setAnswer(updatedAnswer);
  }


  function selectinput(que, option) {
    var k = answer.findIndex((ele) => ele.question === que);

    if (!answer[k].answer) {
      answer[k].answer = '';
    }

    answer[k].answer = option;
    setAnswer([...answer]);

  }

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Inside the submit() response function
  async function submit() {
    const post_answer_data = {};
    let allQuestionsAnswered = true;
    let validAnswers = true;
    const invalidInputList = [];

    answer.forEach((ele) => {
      //post_answer_data[ele.question] = (ele.answer !== '' || ele.answer !== null ? ele.answer : checkedValues[ele.question] || inputValues[ele.question]);
      post_answer_data[ele.question] = ele.answer || inputValues[ele.question];
      console.log("hhhhh", post_answer_data[ele.question]);
      const question = questions.find((q) => q.questionText === ele.question);
      const inputValue = ele.answer || inputValues[ele.question];

      if (!inputValue && question.required) {
        allQuestionsAnswered = false;
        invalidInputList.push(ele.question);
      } else if (
        question.questionType === 'percentage' &&
        (inputValue < 0 || inputValue > 100)
      ) {
        validAnswers = false;
        invalidInputList.push(ele.question);
      }
    });

    setInvalidInputs(invalidInputList);

    if (!allQuestionsAnswered) {
      setAlertType('alert-error');
      setAlertMessage('Please answer all the required questions.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }

    if (!validAnswers) {
      setAlertType('alert-error');
      setAlertMessage('Please provide valid percentage values (0-100) for percentage questions.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }

    const existingResponseDuration = responses[0]?.responseDuration || 0;
    const endTime = performance.now(); // Get the current time when the user submits
    const responseDuration = endTime - startTime; // Calculate the duration in milliseconds
    const newTotalResponseDuration = existingResponseDuration + responseDuration;

    try {

      const totalQuestions = formDetails.questions.length;
      let answeredQuestions;

      if (Object.values(inputValues).some(value => value !== '')) {
        answeredQuestions = answer.filter(ele => ele.answer !== '' || inputValues[ele.question] !== '').length;
      } else {
        answeredQuestions = answer.filter(ele => ele.answer !== '').length;
      }
      const percentageAnswered = (answeredQuestions / totalQuestions) * 100;


      const response = await responseDataService.saveUserResponse({
        userId: userId,
        formId: formId,
        questions: formDetails.questions.map((question) => {
          const selectedOption = question.options.find((option) => option.optionText === post_answer_data[question.questionText]);
          const optionId = selectedOption ? selectedOption.optionId : null;

          return {
            questionId: question.questionId,
            optionId: optionId,
            textResponse: post_answer_data[question.questionText],
          };
        }),
        responseDuration: newTotalResponseDuration,
        percentageAnswered: percentageAnswered,
      });

      navigate(`/done`);
    } catch (error) {
      console.error('Error saving user response:', error);
    }
  }


  // Function to get the text response value based on questionText
  const getResponseValue = (questionText) => {
    const responseQuestion = responses[0]?.responseItems.find(item => item.questionText === questionText);
    return responseQuestion && responseQuestion.textResponse ? responseQuestion.textResponse : '';
  };

  // Function to get the checked status for radio and checkbox options
  const getResponseChecked = (questionText, optionText) => {
    const responseItem = responses[0]?.responseItems.find(item => item.questionText === questionText);
    return responseItem ? responseItem.textResponse === optionText : false;
  };

  const handleInputChange = (questionText, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [questionText]: value,
    }));

    // Only update the answer if the user has modified the input
    if (getResponseValue(questionText) !== value) {
      selectinput(questionText, value);
    }
  };


  const handleCheckChange = (questionText, values) => {
    setCheckedValues((prevCheckValues) => {
      const updatedValues = { ...prevCheckValues };

      if (updatedValues[questionText]) {
        updatedValues[questionText] = values;
      } else {
        updatedValues[questionText] = [...values];
      }

      // Call the selectcheck function with the appropriate parameters
      selectcheck(questionText, updatedValues[questionText]);

      return updatedValues;
    });
  };






  const handleRadioChange = (questionText, value) => {
    setRadioValues((prevRadioValues) => ({
      ...prevRadioValues,
      [questionText]: value,
    }));

    // Only update the answer if the user has modified the radio values
    if (getResponseValue(questionText) !== value) {
      select(questionText, value);
    }
  };



  if (!percentageAnswered) {
    return (
      <main>
        <div className="page-header">
          <h1>Form</h1>
          <small>Please try to answer to this form</small>
        </div>
        <div className={styles.submit}>
          {showAlert && <div className={`${styles.alert} ${styles[alertType]}`}>{alertMessage}</div>}
          <div className={styles.user_form}>
            <div className={styles.user_form_section}>
              <div className={styles.user_title_section}>
                <Typography style={{ fontSize: "26px" }}>{documentName}</Typography>
                <Typography style={{ fontSize: "15px" }}>{documentDescription}</Typography>
              </div>
              {questions.map((question, qindex) => (
                <div key={qindex} className={styles.user_form_questions}>
                  <Typography style={{ fontSize: "15px", fontWeight: "400", letterSpacing: '.1px', lineHeight: '24px', paddingBottom: "8px", fontSize: "14px" }}>
                    {qindex + 1}. {question.questionText} {question.required ? <span style={{ color: 'red' }}>*</span> : null}
                    {invalidInputs.includes(question.questionText) && question.required && (
                      <span style={{ color: 'red', marginLeft: '5px' }}>(Required)</span>
                    )}
                  </Typography>

                  {question.options.map((ques, index) => (
                    <div key={index} style={{ marginBottom: "5px" }}>
                      <div style={{ display: 'flex' }}>
                        <div className={styles["form-check"]}>
                          {question.questionType !== "radio" ? (
                            question.questionType === 'text' ? (
                              <label>
                                <input
                                  type="text"
                                  name={qindex}
                                  value={inputValues[question.questionText]}
                                  className={`${styles["form-check-input"]} ${invalidInputs.includes(question.questionText) ? styles.invalidInput : ''}`}
                                  required={question.required}
                                  style={{ marginLeft: "5px", marginRight: "5px" }}
                                  onChange={(e) => { handleInputChange(question.questionText, e.target.value) }}
                                /> {question.optionText}
                              </label>
                            ) : question.questionType === 'number' || question.questionType === 'percentage' ? (
                              <label>
                                <input
                                  type="number"
                                  name={qindex}
                                  value={inputValues[question.questionText]}
                                  className={`${styles["form-check-input"]} ${invalidInputs.includes(question.questionText) ? styles.invalidInput : ''}`}
                                  required={question.required}
                                  style={{ marginLeft: "5px", marginRight: "5px" }}
                                  onChange={(e) => { handleInputChange(question.questionText, e.target.value) }}
                                />
                                {question.optionText}
                                {question.questionType === 'percentage' && (
                                  <span style={{ color: 'red' }}>{invalidInputs.includes(question.questionText) ? ' (Invalid Percentage)' : ''}</span>
                                )}
                              </label>
                            ) : (
                              <label>
                                <input
                                  type={question.questionType}
                                  name={qindex}
                                  checked={(checkedValues[question.questionText] || []).includes(ques.optionText)}
                                  className={`${styles["form-check-input"]} ${(invalidInputs.includes(question.questionText) && question.required) ? styles.invalidInput : ''}`}
                                  required={question.required}
                                  style={{ marginLeft: "5px", marginRight: "5px" }}
                                  onChange={() => {
                                    const selectedValues = [...(checkedValues[question.questionText] || [])];
                                    if (selectedValues.includes(ques.optionText)) {
                                      selectedValues.splice(selectedValues.indexOf(ques.optionText), 1);
                                    } else {
                                      selectedValues.push(ques.optionText);
                                    }
                                    handleCheckChange(question.questionText, selectedValues);
                                  }}
                                />

                                {ques.optionText}
                              </label>
                            )
                          ) : (
                            <label>
                              <input
                                type={question.questionType}
                                name={qindex}
                                checked={radioValues[question.questionText] === ques.optionText}
                                className={`${styles["form-check-input"]} ${invalidInputs.includes(question.questionText) ? styles.invalidInput : ''}`}
                                required={question.required}
                                style={{ margnLeft: "5px", marginRight: "5px" }}
                                onChange={() => { handleRadioChange(question.questionText, ques.optionText) }}
                              />
                              {ques.optionText}
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className={styles.user_form_submit}>
                <Button variant="contained" color="primary" onClick={submit} style={{ fontSize: "14px" }}>Submit</Button>
              </div>
              <div className={styles.user_footer}>
                IACE Forms
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  else {
    navigate("/already-submitted");
  }
}

export default Userform;











