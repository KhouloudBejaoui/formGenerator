import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFormDetails } from '../../redux/actions/form';
import axios from "axios";
import styles from "./userForm.module.css"; // Add the import for styles
import responseDataService from "../../services/response.service";

function Userform() {

  const [hasAnswered, setHasAnswered] = useState(false);
  const [answer, setAnswer] = useState([]);
  const navigate = useNavigate();
  const { userId, formId } = useParams();
  const isLoading = useSelector((state) => state.form.loading);
  const error = useSelector((state) => state.form.error);
  const dispatch = useDispatch();
  const formDetails = useSelector((state) => state.form.formDetails);
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    dispatch(getFormDetails(formId));
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
    async function checkUserResponse() {
      try {
        // Call your service to check if the user has answered
        const response = await responseDataService.checkResponse(userId, formId);
        setHasAnswered(response.data.hasAnswered); // Set the hasAnswered state based on the response
      } catch (error) {
        console.error('Error checking user response:', error);
      }
    }

    // Call the checkUserResponse function when userId and formId are available
    if (userId && formId) {
      checkUserResponse();
    }
  }, [userId, formId]);

  const { questions = [], documentName, documentDescription } = formDetails || {};


  function select(que, option) {
    const updatedAnswer = answer.map((ele) => {
      if (ele.question === que) {
        return { ...ele, answer: option };
      }
      return ele;
    });
    setAnswer(updatedAnswer);
  }

  function selectcheck(e, que, option) {
    var d = [];
    var k = answer.findIndex((ele) => ele.question === que);

    if (!answer[k].answer) {
      answer[k].answer = '';
    }

    if (answer[k].answer) {
      d = answer[k].answer.split(',');
    }

    if (e === true) {
      d.push(option);
    } else {
      var n = d.findIndex((el) => el.option === option);
      d.splice(n, 1);
    }

    answer[k].answer = d.join(',');
    setAnswer([...answer]);
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
      post_answer_data[ele.question] = ele.answer;

      const question = questions.find((q) => q.questionText === ele.question);
      if (question && question.questionType === 'percentage') {
        const parsedAnswer = parseFloat(ele.answer);

        if (parsedAnswer < 0 || parsedAnswer > 100) {
          validAnswers = false;
          invalidInputList.push(ele.question);
        }
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

    const endTime = performance.now(); // Get the current time when the user submits

    const responseDuration = endTime - startTime; // Calculate the duration in milliseconds

    try {
      // Calculate the percentage of answered questions
      const totalQuestions = formDetails.questions.length;
      const answeredQuestions = answer.filter((ele) => ele.answer !== '' && ele.answer !== null && ele.answer !== undefined).length;
      console.log(answeredQuestions);
      // Calculate the percentage considering unanswered questions as 0%
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
        responseDuration: responseDuration,
        percentageAnswered: percentageAnswered,
      });

      navigate(`/done`);
    } catch (error) {
      console.error('Error saving user response:', error);
    }
  }



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!hasAnswered) {
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
                    {qindex + 1}.   {question.questionText} {question.required ? <span style={{ color: 'red' }}>*</span> : null}
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
                                  className={`${styles["form-check-input"]} ${invalidInputs.includes(question.questionText) ? styles.invalidInput : ''}`}
                                  required={question.required}
                                  style={{ marginLeft: "5px", marginRight: "5px" }}
                                  onChange={(e) => { selectinput(question.questionText, e.target.value) }}
                                /> {question.optionText}
                              </label>
                            ) : question.questionType === 'number' || question.questionType === 'percentage' ? (
                              <label>
                                <input
                                  type="number"
                                  name={qindex}
                                  className={`${styles["form-check-input"]} ${invalidInputs.includes(question.questionText) ? styles.invalidInput : ''}`}
                                  required={question.required}
                                  style={{ marginLeft: "5px", marginRight: "5px" }}
                                  onChange={(e) => { selectinput(question.questionText, e.target.value) }}
                                />
                                {question.optionText}
                                {question.questionType === 'percentage' && (
                                  <span style={{ color: 'red' }}>{invalidInputs.includes(question.questionText) ? ' (Invalid Percentage)' : ''}</span>
                                )}
                              </label>
                            ) : (
                              <label>
                                <input
                                  type="radio"
                                  name={qindex}
                                  value={ques.optionText}
                                  className={`${styles["form-check-input"]} ${(invalidInputs.includes(question.questionText) && question.required) ? styles.invalidInput : ''}`}
                                  required={question.required}
                                  style={{ marginLeft: "5px", marginRight: "5px" }}
                                  onChange={() => { select(question.questionText, ques.optionText) }}
                                />
                                {ques.optionText}
                                {question.required && (
                                  <span style={{ color: 'red' }}>{invalidInputs.includes(question.questionText) ? '(Required)' : ''}</span>
                                )}
                              </label>
                            )
                          ) : (
                            <label>
                              <input
                                type={question.questionType}
                                name={qindex}
                                value={ques.optionText}
                                className={`${styles["form-check-input"]} ${invalidInputs.includes(question.questionText) ? styles.invalidInput : ''}`}
                                required={question.required}
                                style={{ margnLeft: "5px", marginRight: "5px" }}
                                onChange={() => { select(question.questionText, ques.optionText) }}
                              />
                              {ques.optionText}
                              {question.required && (
                                <span style={{ color: 'red' }}>{invalidInputs.includes(question.questionText) ? '(Required)' : ''}</span>
                              )}
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




/*

import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFormDetails } from '../../redux/actions/form';
import axios from "axios";
import styles from "./userForm.module.css"; // Add the import for styles

function Userform() {
    const [answer, setAnswer] = useState([]);
    const navigate = useNavigate(); // Add the missing 'navigate' variable
    const { formId } = useParams();
    const isLoading = useSelector((state) => state.form.loading);
    const error = useSelector((state) => state.form.error);
    const dispatch = useDispatch();
    const formDetails = useSelector((state) => state.form.formDetails);

    useEffect(() => {
        dispatch(getFormDetails(formId));
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


    const { questions = [], documentName, documentDescription } = formDetails || {};


    function select(que, option) {
        const updatedAnswer = answer.map((ele) => {
            if (ele.question === que) {
                return { ...ele, answer: option };
            }
            return ele;
        });
        setAnswer(updatedAnswer);
    }

    function selectcheck(e, que, option) {
        var d = [];
        var k = answer.findIndex((ele) => ele.question === que);

        if (!answer[k].answer) {
            answer[k].answer = '';
        }

        if (answer[k].answer) {
            d = answer[k].answer.split(',');
        }

        if (e === true) {
            d.push(option);
        } else {
            var n = d.findIndex((el) => el.option === option);
            d.splice(n, 1);
        }

        answer[k].answer = d.join(',');
        setAnswer([...answer]);
    }

    function selectinput(que, option) {
        var k = answer.findIndex((ele) => ele.question === que);

        if (!answer[k].answer) {
            answer[k].answer = '';
        }

        answer[k].answer = option;
        setAnswer([...answer]);
    
    }

    function submit() {
        const post_answer_data = {};
        answer.forEach((ele) => {
            post_answer_data[ele.question] = ele.answer;
        });

        axios.post(`http://localhost:9010/user_response/${documentName}`, {
            column: questions.map((q) => q.questionText),
            answer_data: [post_answer_data],
        });

        navigate(`/submitted`);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main>
            <div className="page-header">
                <h1>Forms</h1>
                <small>Home / View Form</small>
            </div>
            <div className={styles.submit}>
                <div className={styles.user_form}>
                    <div className={styles.user_form_section}>
                        <div className={styles.user_title_section}>
                            <Typography style={{ fontSize: "26px" }}>{documentName}</Typography>
                            <Typography style={{ fontSize: "15px" }}>{documentDescription}</Typography>
                        </div>
                        {questions.map((question, qindex) => (
                            <div key={qindex} className={styles.user_form_questions}>
                                <Typography style={{ fontSize: "15px", fontWeight: "400", letterSpacing: '.1px', lineHeight: '24px', paddingBottom: "8px", fontSize: "14px" }}>
                                    {qindex + 1}.  {question.questionText}
                                </Typography>
                                {question.options.map((ques, index) => (
                                    <div key={index} style={{ marginBottom: "5px" }}>
                                        <div style={{ display: 'flex' }}>
                                            <div className={styles["form-check"]}>
                                                {question.questionType !== "radio" ? (
                                                    question.questionType !== 'text' ? (
                                                        <label>
                                                            <input
                                                                type={question.questionType}
                                                                name={qindex}
                                                                value={ques.optionText}
                                                                className={styles["form-check-input"]}
                                                                required={question.required}
                                                                style={{ margnLeft: "5px", marginRight: "5px" }}
                                                                onChange={(e) => { selectcheck(e.target.checked, question.questionText, ques.optionText) }}
                                                            /> {ques.optionText}
                                                        </label>) : (
                                                        <label>
                                                            <input
                                                                type={question.questionType}
                                                                name={qindex}
                                                                value={answer[qindex].answer}
                                                                className={styles["form-check-input"]}
                                                                required={question.required}
                                                                style={{ margnLeft: "5px", marginRight: "5px" }}
                                                                onChange={(e) => { selectinput(question.questionText, e.target.value) }}
                                                            /> {ques.optionText}
                                                        </label>
                                                    )
                                                ) : (
                                                    <label>
                                                        <input
                                                            type={question.questionType}
                                                            name={qindex}
                                                            value={ques.optionText}
                                                            className={styles["form-check-input"]}
                                                            required={question.required}
                                                            style={{ margnLeft: "5px", marginRight: "5px" }}
                                                            onChange={() => { select(question.questionText, ques.optionText) }}
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

export default Userform;
*/









