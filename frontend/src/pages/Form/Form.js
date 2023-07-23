import React, { useState } from 'react';
import styles from './form.module.css';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import { BsTrash } from "react-icons/bs";
import { FcRightUp } from "react-icons/fc";
import { BsFileText } from "react-icons/bs";
import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ShortTextIcon from "@material-ui/icons/ShortText";
import SubjectIcon from "@material-ui/icons/Subject";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { OndemandVideo } from '@material-ui/icons';
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../redux/actions/types';

const Form = () => {

    const { id } = useParams();
    const state = useSelector((state) => state); // Replace 'state' with your specific state slice if needed
    const dispatch = useDispatch();

    const [questions, setQuestions] = useState(
        [{
            questionText: "which is the capital of Tunisia ? ",
            questionType: "radio",
            options: [
                { optionText: "Tunis" },
                { optionText: "Sousse" },
                { optionText: "Ariana" },
                { optionText: "Sfax" }
            ],
            answer: false,
            answerKey: "",
            points: 0,
            open: true,
            required: false
        }]
    )
    const [documentName, setDocName] = useState("untitled Document");
    const [documentDescription, setDocDesc] = useState("Add Description");

    /*useEffect(() => {
      async function data_adding() {
        var request = await axios.get(`http://localhost:9010/data/${id}`);
        var question_data = request.data.questions;
        console.log(question_data);
        var doc_name = request.data.document_name
        var doc_descip = request.data.document_desc
        console.log(doc_name + " " + doc_descip);
        setDocName(doc_name)
        setDocDesc(doc_descip)
        setQuestions(question_data)
        dispatch({
          type: actionTypes.SET_DOC_NAME,
          doc_name: doc_name
        })
  
        dispatch({
          type: actionTypes.SET_DOC_DESC,
          doc_desc: doc_descip
        })
  
        dispatch({
          type: actionTypes.SET_QUESTIONS,
          questions: question_data
        })
  
  
      }
      data_adding()
    },[])*/

    function changeQuestion(text, i) {
        var newQuestion = [...questions];
        newQuestion[i].questionText = text;
        setQuestions(newQuestion);
        console.log(newQuestion);
    }

    function changeOptionValue(text, i, j) {
        var optionsQuestion = [...questions];
        optionsQuestion[i].options[j].optionText = text;
        setQuestions(optionsQuestion);
    }

    function addQuestionType(i, type) {
        let qs = [...questions];
        console.log(type);
        qs[i].questionType = type;
        setQuestions(qs);
    }

    function removeOption(i, j) {
        var RemoveOptionQuestion = [...questions];
        if (RemoveOptionQuestion[i].options.length > 1) {
            RemoveOptionQuestion[i].options.splice(j, 1);
            setQuestions(RemoveOptionQuestion)
            console.log(i + "__" + j);
        }
    }

    function addOption(i) {
        var optionsOfQuestion = [...questions];
        if (optionsOfQuestion[i].options.length < 5) {
            optionsOfQuestion[i].options.push({ optionText: "option" + (optionsOfQuestion[i].options.length + 1) })
        } else {
            console.log("max 5 options");
        }
        setQuestions(optionsOfQuestion)
    }

    function copyQuestion(i) {
        expandCloseAll();
        let qs = [...questions]
        var newQuestion = { ...qs[i] };
        setQuestions([...questions, newQuestion])
    }

    function deleteQuestion(i) {
        let qs = [...questions];
        if (questions.length > 1) {
            qs.splice(i, 1);
        }
        setQuestions(qs)
    }

    function requiredQuestion(i) {
        var reqQuestion = [...questions];
        reqQuestion[i].required = !reqQuestion[i].required
        console.log(reqQuestion[i].required + " " + i);
        setQuestions(reqQuestion)
    }

    function addMoreQuestionField() {
        expandCloseAll();
        setQuestions([...questions, { questionText: "Question", questionType: "radio", options: [{ optionText: "option 1" }], open: true, required: false }])
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        var itemgg = [...questions];
        const itemF = reorder(itemgg, result.source.index, result.destination.index);
        setQuestions(itemF);
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    function expandCloseAll() {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            qs[j].open = false;
        }
        setQuestions(qs);
    }

    function handleExpand(i) {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            if (i == j) {
                qs[i].open = true;
            } else {
                qs[i].open = false;
            }
            setQuestions(qs);
        }
    }

    function setOptionAnswer(ans, qno) {
        var Questions = [...questions];
        Questions[qno].answerKey = ans;
        setQuestions(Questions)
        console.log(qno + "" + ans)
    }

    function setOptionPoints(points, qno) {
        var Questions = [...questions];
        Questions[qno].points = points;
        setQuestions(Questions)
        console.log(qno + " " + points);
    }

    function doneAnswer(i) {
        var answerOfQuestion = [...questions];
        answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
        setQuestions(answerOfQuestion)

    }

    function addAnswer(i) {
        var answerOfQuestion = [...questions];
        answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
        setQuestions(answerOfQuestion)
    }



    async function commitToDB() {
        try {
            console.log(questions);
            dispatch({
                type: actionTypes.SET_QUESTIONS,
                questions: questions
            })
            await axios.post(`http://localhost:9010/add_questions/${id}`, {
                "document_name": documentName,
                "doc_desc": documentDescription,
                "questions": questions,
            });
            // Request successful
        } catch (error) {
            console.error("Error:", error);
        }
    }


    function questionsUI() {
        return questions.map((ques, i) => (
            <Draggable key={i} draggableId={i + 'id'} index={i}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div>
                    <div style={{ marginBottom: '0px' }}>
                      <div style={{ width: '100%', marginBottom: '0px' }}>
                        <DragIndicatorIcon style={{ transform: 'rotate(-90deg)', color: '#DAE0E2', position: 'relative', left: "300px" }} fontSize='small' />
                      </div>
          
                      <div>
                        <Accordion expanded={questions[i].open} onChange={() => { handleExpand(i) }} className={questions[i].open ? styles.add_border : ""}>
                          <AccordionSummary
                            aria-controls="panella-content"
                            id="panella-header"
                            elevation={1}
                            style={{ width: '100%' }}
                          >
                            {!questions[i].open ? (
                              <div className={styles.saved_questions}>
                                <Typography style={{ fontSize: "15px", fontWeight: "400", letterSpacing: '.1px', lineHeight: '24px', paddingBottom: "8px" }}>
                                  {i + 1}. {questions[i].questionText}
                                </Typography>
          
                                {ques.options.map((op, j) => (
                                  <div key={j}>
                                    <div style={{ display: 'flex', }}>
                                      <FormControlLabel style={{ marginLeft: "5px", marginBottom: "5px" }} disabled control={<input type={ques.questionType} color="primary" style={{ marginRight: '3px' }} required={ques.type} />} label={
                                        <Typography style={{
                                          fontFamily: 'Roboto,Arial,sans-serif',
                                          fontSize: '13px',
                                          fontWeight: '400',
                                          letterSpacing: '.2px',
                                          lineHeight: '20px',
                                          color: '#202124'
                                        }}>
                                          {ques.options[j].optionText}
                                        </Typography>
                                      } />
          
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
          
                          </AccordionSummary>
                          <div className={styles.question_boxes}>
                            {!questions[i].answer ? (
                              <AccordionDetails className={styles.add_question}>
                                <div className={styles.add_question_top}>
                                  <input type="text" className={styles.question} placeholder="Question" value={ques.questionText} onChange={(e) => { changeQuestion(e.target.value, i) }} />
                                  <CropOriginalIcon style={{ color: "#5f6368" }} />
                                  <Select className={styles.select} style={{ color: "#5f6368", fontSize: "13px" }}>
                                    <MenuItem id="text" value="Text" onClick={() => { addQuestionType(i, "text") }}> <SubjectIcon style={{ marginRight: "10px" }} />Paragraph</MenuItem>
                                    <MenuItem id="checkbox" value="Checkbox" onClick={() => { addQuestionType(i, "checkbox") }}><CheckBoxIcon style={{ marginRight: "10px", color: "#70757a" }} checked /> Checkboxes</MenuItem>
                                    <MenuItem id="radio" value="Radio" onClick={() => { addQuestionType(i, "radio") }}> <Radio style={{ marginRight: "10px", color: "#70757a" }} checked />Multiple choice</MenuItem>
                                  </Select>
                                </div>
                                {ques.options.map((op, j) => (
                                  <div className={styles.add_question_body} key={j}>
                                    {
                                      (ques.questionType !== "text") ?
                                        <input type={ques.questionType} style={{ marginRight: "10px" }} /> :
                                        <ShortTextIcon style={{ marginRight: "10px" }} />
                                    }
                                    <div>
                                      <input type='text' className={styles.text_input} placeholder='option' value={ques.options[j].optionText} onChange={(e) => { changeOptionValue(e.target.value, i, j) }}></input>
                                    </div>
                                    <CropOriginalIcon style={{ color: "#5f6368" }} />
                                    <IconButton aria-label='delete'>
                                      <CloseIcon onClick={() => { removeOption(i, j) }} />
                                    </IconButton>
                                  </div>
                                ))}
                                {
                                  ques.options.length < 5 ? (
                                    <div className={styles.add_question_body}>
                                      <FormControlLabel
                                        disabled
                                        control={
                                          (ques.questionText !== "text") ? (
                                            <input
                                              type={ques.questionType}
                                              color="primary"
                                              style={{ marginLeft: "10px", marginRight: "10px" }}
                                              disabled
                                            />
                                          ) : (
                                            <ShortTextIcon style={{ marginRight: "10px" }} />
                                          )
                                        }
                                        label={
                                          <Typography>
                                            <div>
                                              <input
                                                type="text"
                                                className={styles.text_input}
                                                style={{ fontSize: "13px", width: "60px" }}
                                                placeholder="Add other"
                                              />
                                              <Button
                                                size="small"
                                                onClick={() => { addOption(i) }}
                                                style={{
                                                  textTransform: "none",
                                                  color: "#4285f4",
                                                  fontSize: "13px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                Add Option
                                              </Button>
                                            </div>
                                          </Typography>
                                        }
                                      />
          
                                    </div>
                                  ) : null
                                }
                                <div className={styles.add_footer}>
                                  <div className={styles.add_question_bottom_left}>
                                    <Button size="small" style={{ textTransform: 'none', color: "#4285f4", fontSize: "13px", fontWeight: "600" }} onClick={() => { addAnswer(i) }}>
                                      <FcRightUp style={{ border: "2px solid #4285f4", padding: "2px", marginRight: "8px" }} />Answer key
                                    </Button>
                                  </div>
                                  <div className={styles.add_question_bottom}>
                                    <IconButton aria-label="copy" onClick={() => { copyQuestion(i) }}>
                                      <FilterNoneIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => { deleteQuestion(i) }}>
                                      <BsTrash />
                                    </IconButton>
                                    <span style={{ color: "#5f6368", fontSize: "13px" }}>Required</span> <Switch name="checkedA" color="primary" onClick={() => { requiredQuestion(i) }} ></Switch>
                                    <IconButton>
                                      <MoreVertIcon />
                                    </IconButton>
                                  </div>
                                </div>
                              </AccordionDetails>
                            ) : (
                                <AccordionDetails className={styles.add_question}>
                                  <div className={styles.top_header}>
                                    Choose Correct Answer
                                  </div>
                                  <div>
                                    <div className={styles.add_question_top}>
                                      <input type="text" className={styles.question} placeholder='Question' value={ques.questionText} disabled></input>
                                      <input type='number' className={styles.points} min="0" step="1" placeholder='0' onChange={(e) => { setOptionPoints(e.target.value, i) }}></input>
                                    </div>
                                    {ques.options.map((op, j) => (
                                      <div className={styles.add_question_body} key={j} style={{ marginLeft: "8px", marginBottom: "10px", marginTop: "5px" }}>
                                        <div key={j}>
                                          <div style={{ display: 'flex' }} className=''>
                                            <div className={styles["form-check"]}>
                                              <label style={{ fontSize: "13px" }} onClick={() => { setOptionAnswer(ques.options[j].optionText, i) }}>
                                                {(ques.questionType !== "text") ?
                                                  <input type={ques.questionType}
                                                    name={ques.questionText}
                                                    value="option3"
                                                    className={styles["form-check-input"]}
                                                    required={ques.required}
                                                    style={{ marginRight: '10px', marginBottom: "10px", marginTop: "5px" }}
                                                  /> : <ShortTextIcon style={{ marginRight: "10px" }} />
                                                }
                                                {ques.options[j].optionText}
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className={styles.add_question_body}>
                                      <Button size='small' style={{ textTransform: 'none', color: "#4285f4", fontSize: "13px", fontWeight: "600" }}>
                                        <BsFileText style={{ fontSize: "20px", marginRight: "8px" }} /> ADD Answer Feedback
                                      </Button>
                                    </div>
                                    <div className={styles.add_question_bottom}>
                                      <Button variant='outlined' color='primary' style={{ textTransform: 'none', color: "#4285f4", fontSize: "12px", marginTop: "12px", fontWeight: "600" }} onClick={() => { doneAnswer(i) }}>
                                        Done
                                      </Button>
                                    </div>
                                  </div>
          
                                </AccordionDetails>
                              )}
          
                            {!ques.answer ? (<div className={styles.question_edit}>
                              <AddCircleOutlineIcon onClick={addMoreQuestionField} className={styles.edit} />
                              <OndemandVideoIcon className={styles.edit} />
                              <CropOriginalIcon className={styles.edit} />
                              <TextFieldsIcon className={styles.edit} />
                            </div>) : null}
                          </div>
                        </Accordion>
          
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ));
          
      }
      return (
        <main>
        <div className="page-header">
            <h1>Forms</h1>
            <small>Home / Add Form</small>
        </div>
        <div className={styles.question_form}>
      <br></br>
      <div className={styles.section}>
        <div className={styles.question_title_section}>
          <div className={styles.question_form_top}>
            <input type='text' className={styles.question_form_top_name} style={{ color: "black" }} placeholder='untitled document' />
            <input type='text' className={styles.question_form_top_desc} placeholder='Form description' />
          </div>
        </div>
     
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {questionsUI()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className={styles.save_form}>
            <Button variant="contained" color='primary' onClick={commitToDB} style={{ fontSize: "14px" }}>Save</Button>
          </div>
      </div>
     </div>
     
         
        </main>
      )
}
/* const [questions, setQuestions] = useState(
   [{
     questionText: "which is the capital of Tunisia ? ",
     questionType: "radio",
     options: [
       { optionText: "Tunis" },
       { optionText: "Sousse" },
       { optionText: "Ariana" },
       { optionText: "Sfax" }
     ],
     answer:false,
     answerKey:"",
     points:0,
     open: true,
     required: false
   }]
 )

 function changeQuestion(text, i) {
   var newQuestion = [...questions];
   newQuestion[i].questionText = text;
   setQuestions(newQuestion);
   console.log(newQuestion);
 }

 function changeOptionValue(text, i, j) {
   var optionsQuestion = [...questions];
   optionsQuestion[i].options[j].optionText = text;
   setQuestions(optionsQuestion);
 }

 function addQuestionType(i, type) {
   let qs = [...questions];
   console.log(type);
   qs[i].questionType = type;
   setQuestions(qs);
 }

 function removeOption(i, j) {
   var RemoveOptionQuestion = [...questions];
   if (RemoveOptionQuestion[i].options.length > 1) {
     RemoveOptionQuestion[i].options.splice(j, 1);
     setQuestions(RemoveOptionQuestion)
     console.log(i + "__" + j);
   }
 }

 function addOption(i) {
   var optionsOfQuestion = [...questions];
   if (optionsOfQuestion[i].options.length < 5) {
     optionsOfQuestion[i].options.push({ optionText: "option" + (optionsOfQuestion[i].options.length + 1) })
   } else {
     console.log("max 5 options");
   }
   setQuestions(optionsOfQuestion)
 }

 function copyQuestion(i) {
   expandCloseAll();
   let qs = [...questions]
   var newQuestion = {...qs[i]};
   setQuestions([...questions, newQuestion])
 }

 function deleteQuestion(i) {
   let qs = [...questions];
   if (questions.length > 1) {
     qs.splice(i, 1);
   }
   setQuestions(qs)
 }

 function requiredQuestion(i) {
   var reqQuestion = [...questions];
   reqQuestion[i].required = !reqQuestion[i].required
   console.log(reqQuestion[i].required + " " + i);
   setQuestions(reqQuestion)
 }

 function addMoreQuestionField() {
   expandCloseAll();
   setQuestions([...questions, { questionText: "Question", questionType: "radio", options: [{ optionText: "option 1" }], open: true, required: false }])
 }

 function onDragEnd(result) {
   if (!result.destination) {
     return;
   }
   var itemgg = [...questions];
   const itemF = reorder(itemgg, result.source.index, result.destination.index);
   setQuestions(itemF);
 }

 const reorder = (list, startIndex, endIndex) => {
   const result = Array.from(list);
   const [removed] = result.splice(startIndex, 1);
   result.splice(endIndex, 0, removed);
   return result;
 }

 function expandCloseAll(){
   let qs = [...questions];
   for(let j =0; j< qs.length; j++){
     qs[j].open = false;
   }
   setQuestions(qs);
 }

 function handleExpand(i){
   let qs = [...questions];
   for(let j =0; j< qs.length;j++){
     if(i==j){
       qs[i].open = true;
     }else{
       qs[i].open = false;
     }
     setQuestions(qs);
   }
 }

 function setOptionAnswer(ans,qno){
   var Questions = [...questions];
   Questions[qno].answerKey = ans;
   setQuestions(Questions)
   console.log(qno+""+ans)
 }

 function setOptionPoints(points,qno){
   var Questions = [...questions];
   Questions[qno].points = points;
   setQuestions(Questions)
   console.log(qno+" "+points);
 }

 function doneAnswer(i) {
   var answerOfQuestion = [...questions];
   answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
   setQuestions(answerOfQuestion)
   
 }

 function addAnswer(i) {
   var answerOfQuestion = [...questions];
   answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
   setQuestions(answerOfQuestion)
 }

 function questionsUI() {
   return questions.map((ques, i) => (
       <Draggable key={i} draggableId={i + 'id'} index={i}>
         {(provided, snapshot) => (
           <div
             ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}
           >
             <div>
               <div style={{ marginBottom: '0px' }}>
                 <div style={{ width: '100%', marginBottom: '0px' }}>
                   <DragIndicatorIcon style={{ transform: 'rotate(-90deg)', color: '#DAE0E2', position: 'relative', left: "300px" }} fontSize='small' />
                 </div>
     
                 <div>
                   <Accordion expanded={questions[i].open} onChange={() => { handleExpand(i) }} className={questions[i].open ? styles.add_border : ""}>
                     <AccordionSummary
                       aria-controls="panella-content"
                       id="panella-header"
                       elevation={1}
                       style={{ width: '100%' }}
                     >
                       {!questions[i].open ? (
                         <div className={styles.saved_questions}>
                           <Typography style={{ fontSize: "15px", fontWeight: "400", letterSpacing: '.1px', lineHeight: '24px', paddingBottom: "8px" }}>
                             {i + 1}. {questions[i].questionText}
                           </Typography>
     
                           {ques.options.map((op, j) => (
                             <div key={j}>
                               <div style={{ display: 'flex', }}>
                                 <FormControlLabel style={{ marginLeft: "5px", marginBottom: "5px" }} disabled control={<input type={ques.questionType} color="primary" style={{ marginRight: '3px' }} required={ques.type} />} label={
                                   <Typography style={{
                                     fontFamily: 'Roboto,Arial,sans-serif',
                                     fontSize: '13px',
                                     fontWeight: '400',
                                     letterSpacing: '.2px',
                                     lineHeight: '20px',
                                     color: '#202124'
                                   }}>
                                     {ques.options[j].optionText}
                                   </Typography>
                                 } />
     
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : null}
     
                     </AccordionSummary>
                     <div className={styles.question_boxes}>
                       {!questions[i].answer ? (
                         <AccordionDetails className={styles.add_question}>
                           <div className={styles.add_question_top}>
                             <input type="text" className={styles.question} placeholder="Question" value={ques.questionText} onChange={(e) => { changeQuestion(e.target.value, i) }} />
                             <CropOriginalIcon style={{ color: "#5f6368" }} />
                             <Select className={styles.select} style={{ color: "#5f6368", fontSize: "13px" }}>
                               <MenuItem id="text" value="Text" onClick={() => { addQuestionType(i, "text") }}> <SubjectIcon style={{ marginRight: "10px" }} />Paragraph</MenuItem>
                               <MenuItem id="checkbox" value="Checkbox" onClick={() => { addQuestionType(i, "checkbox") }}><CheckBoxIcon style={{ marginRight: "10px", color: "#70757a" }} checked /> Checkboxes</MenuItem>
                               <MenuItem id="radio" value="Radio" onClick={() => { addQuestionType(i, "radio") }}> <Radio style={{ marginRight: "10px", color: "#70757a" }} checked />Multiple choice</MenuItem>
                             </Select>
                           </div>
                           {ques.options.map((op, j) => (
                             <div className={styles.add_question_body} key={j}>
                               {
                                 (ques.questionType !== "text") ?
                                   <input type={ques.questionType} style={{ marginRight: "10px" }} /> :
                                   <ShortTextIcon style={{ marginRight: "10px" }} />
                               }
                               <div>
                                 <input type='text' className={styles.text_input} placeholder='option' value={ques.options[j].optionText} onChange={(e) => { changeOptionValue(e.target.value, i, j) }}></input>
                               </div>
                               <CropOriginalIcon style={{ color: "#5f6368" }} />
                               <IconButton aria-label='delete'>
                                 <CloseIcon onClick={() => { removeOption(i, j) }} />
                               </IconButton>
                             </div>
                           ))}
                           {
                             ques.options.length < 5 ? (
                               <div className={styles.add_question_body}>
                                 <FormControlLabel
                                   disabled
                                   control={
                                     (ques.questionText !== "text") ? (
                                       <input
                                         type={ques.questionType}
                                         color="primary"
                                         style={{ marginLeft: "10px", marginRight: "10px" }}
                                         disabled
                                       />
                                     ) : (
                                       <ShortTextIcon style={{ marginRight: "10px" }} />
                                     )
                                   }
                                   label={
                                     <Typography>
                                       <div>
                                         <input
                                           type="text"
                                           className={styles.text_input}
                                           style={{ fontSize: "13px", width: "60px" }}
                                           placeholder="Add other"
                                         />
                                         <Button
                                           size="small"
                                           onClick={() => { addOption(i) }}
                                           style={{
                                             textTransform: "none",
                                             color: "#4285f4",
                                             fontSize: "13px",
                                             fontWeight: "600",
                                           }}
                                         >
                                           Add Option
                                         </Button>
                                       </div>
                                     </Typography>
                                   }
                                 />
     
                               </div>
                             ) : null
                           }
                           <div className={styles.add_footer}>
                             <div className={styles.add_question_bottom_left}>
                               <Button size="small" style={{ textTransform: 'none', color: "#4285f4", fontSize: "13px", fontWeight: "600" }} onClick={() => { addAnswer(i) }}>
                                 <FcRightUp style={{ border: "2px solid #4285f4", padding: "2px", marginRight: "8px" }} />Answer key
                               </Button>
                             </div>
                             <div className={styles.add_question_bottom}>
                               <IconButton aria-label="copy" onClick={() => { copyQuestion(i) }}>
                                 <FilterNoneIcon />
                               </IconButton>
                               <IconButton aria-label="delete" onClick={() => { deleteQuestion(i) }}>
                                 <BsTrash />
                               </IconButton>
                               <span style={{ color: "#5f6368", fontSize: "13px" }}>Required</span> <Switch name="checkedA" color="primary" onClick={() => { requiredQuestion(i) }} ></Switch>
                               <IconButton>
                                 <MoreVertIcon />
                               </IconButton>
                             </div>
                           </div>
                         </AccordionDetails>
                       ) : (
                           <AccordionDetails className={styles.add_question}>
                             <div className={styles.top_header}>
                               Choose Correct Answer
                             </div>
                             <div>
                               <div className={styles.add_question_top}>
                                 <input type="text" className={styles.question} placeholder='Question' value={ques.questionText} disabled></input>
                                 <input type='number' className={styles.points} min="0" step="1" placeholder='0' onChange={(e) => { setOptionPoints(e.target.value, i) }}></input>
                               </div>
                               {ques.options.map((op, j) => (
                                 <div className={styles.add_question_body} key={j} style={{ marginLeft: "8px", marginBottom: "10px", marginTop: "5px" }}>
                                   <div key={j}>
                                     <div style={{ display: 'flex' }} className=''>
                                       <div className='form-check'>
                                         <label style={{ fontSize: "13px" }} onClick={() => { setOptionAnswer(ques.options[j].optionText, i) }}>
                                           {(ques.questionType !== "text") ?
                                             <input type={ques.questionType}
                                               name={ques.questionText}
                                               value="option3"
                                               className='form-check-input'
                                               required={ques.required}
                                               style={{ marginRight: '10px', marginBottom: "10px", marginTop: "5px" }}
                                             /> : <ShortTextIcon style={{ marginRight: "10px" }} />
                                           }
                                           {ques.options[j].optionText}
                                         </label>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               ))}
                               <div className={styles.add_question_body}>
                                 <Button size='small' style={{ textTransform: 'none', color: "#4285f4", fontSize: "13px", fontWeight: "600" }}>
                                   <BsFileText style={{ fontSize: "20px", marginRight: "8px" }} /> ADD Answer Feedback
                                 </Button>
                               </div>
                               <div className={styles.add_question_bottom}>
                                 <Button variant='outlined' color='primary' style={{ textTransform: 'none', color: "#4285f4", fontSize: "12px", marginTop: "12px", fontWeight: "600" }} onClick={() => { doneAnswer(i) }}>
                                   Done
                                 </Button>
                               </div>
                             </div>
     
                           </AccordionDetails>
                         )}
     
                       {!ques.answer ? (<div className={styles.question_edit}>
                         <AddCircleOutlineIcon onClick={addMoreQuestionField} className={styles.edit} />
                         <OndemandVideoIcon className={styles.edit} />
                         <CropOriginalIcon className={styles.edit} />
                         <TextFieldsIcon className={styles.edit} />
                       </div>) : null}
                     </div>
                   </Accordion>
     
                 </div>
               </div>
             </div>
           </div>
         )}
       </Draggable>
     ));
     
 }
 return (
   <main>
   <div className="page-header">
       <h1>Forms</h1>
       <small>Home / Add Form</small>
   </div>
   <div className={styles.question_form}>
 <br></br>
 <div className={styles.section}>
   <div className={styles.question_title_section}>
     <div className={styles.question_form_top}>
       <input type='text' className={styles.question_form_top_name} style={{ color: "black" }} placeholder='untitled document' />
       <input type='text' className={styles.question_form_top_desc} placeholder='Form description' />
     </div>
   </div>

   <DragDropContext onDragEnd={onDragEnd}>
     <Droppable droppableId='droppable'>
       {(provided, snapshot) => (
         <div {...provided.droppableProps} ref={provided.innerRef}>
           {questionsUI()}
           {provided.placeholder}
         </div>
       )}
     </Droppable>
   </DragDropContext>
 </div>
</div>

    
   </main>
 )
}*/

export default Form