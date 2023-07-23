import { Button, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

import { useNavigate } from "react-router-dom";

import styles from "./userForm.module.css"
import { useStateValue } from '../../redux/stateProvider';

import axios from "axios"

function Userform() {
    var quest = [];
    var post_answer = [];
    var navigate = useNavigate()
    var [answer, setAnswer] = useState([])
    var [{ questions, doc_name, doc_desc }, dispatch] = useStateValue()

    function select(que, option) {

        var k = answer.findIndex((ele) => (ele.question == que))

        answer[k].answer = option
        setAnswer(answer)
    }

    useEffect(() => {
        questions.map((q) => {
            answer.push({
                "question": q.questionText,
                "answer": " "
            })

        })
        questions.map((q, qindex) => {
            quest.push({ "header": q.questionText, "key": q.questionText })
        })
    }, [])

    var post_answer_data = {}

    function selectinput(que, option) {
        var k = answer.findIndex((ele) => (ele.question == que))

        answer[k].answer = option
        setAnswer(answer)
        console.log(answer)
    }

    function selectcheck(e, que, option) {
        var d = []
        var k = answer.findIndex((ele) => (ele.question == que))
        if (answer[k].answer) {
            d = answer[k].answer.split(",")
        }
        if (e == true) {
            d.push(option)
        }
        else {
            var n = d.findIndex((el) => (el.option == option))
            d.splice(n, 1)

        }
        answer[k].answer = d.join(",")
        setAnswer(answer)
    }


    function submit() {
        answer.map((ele) => {
            post_answer_data[ele.question] = ele.answer
        })

        axios.post(`http://localhost:9010/user_response/${doc_name}`, {
            "column": quest,
            "answer_data": [post_answer_data]
        })

        navigate(`/submitted`)

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
                        <Typography style={{ fontSize: "26px" }} >{doc_name}</Typography>
                        <Typography style={{ fontSize: "15px" }} >{doc_desc}</Typography>

                    </div>

                    {
                        questions.map((question, qindex) => (
                            <div key={qindex} className={styles.user_form_questions}>
                                <Typography style={{ fontSize: "15px", fontWeight: "400", letterSpacing: '.1px', lineHeight: '24px', paddingBottom: "8px", fontSize: "14px" }} >{qindex + 1}.  {question.questionText}</Typography>
                                {
                                    question.options.map((ques, index) => (

                                        <div key={index} style={{ marginBottom: "5px" }}>
                                            <div style={{ display: 'flex' }}>
                                                <div className={styles["form-check"]}>

                                                    {

                                                        question.questionType != "radio" ? (
                                                            question.questionType != 'text' ? (
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
                                                                        value={ques.optionText}
                                                                        className={styles["form-check-input"]}
                                                                        required={question.required}
                                                                        style={{ margnLeft: "5px", marginRight: "5px" }}
                                                                        onChange={(e) => { selectinput(question.questionText, e.target.value) }}
                                                                    /> {ques.optionText}
                                                                </label>
                                                            )

                                                        )

                                                            : (<label>
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
                                                            </label>)

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))

                    }

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
    )
}

export default Userform