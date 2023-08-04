import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFormDetails } from '../../redux/actions/form';
import axios from "axios";
import styles from "./userForm.module.css"; // Add the import for styles
import formDataService from "../../services/form.service";

function FormDetails() {
  const [answer, setAnswer] = useState([]);
  const navigate = useNavigate();
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

  // Function to navigate to the response page for the current form
  const handleShowResponse = () => {
    navigate(`/response/${formId}`);
  };

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

  // Inside the submit() function
  async function submit() {

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
                                /*value={ques.optionText}   value={answer[qindex].answer} */
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
              <Button variant="contained" color="primary" onClick={submit} style={{ fontSize: "14px" }}>Send to users</Button>
            </div>
            <div className={styles.user_footer}>
              IACE Forms
            </div>

          </div>
          <Button variant="contained" color="primary" onClick={handleShowResponse}>
            Show Response
          </Button>
        </div>
      </div>

    </main>
  );
}

export default FormDetails;