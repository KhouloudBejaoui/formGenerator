import React,{useEffect,useState} from 'react';
import './App.css';
import {BrowserRouter,Switch,Route,useHistory,useParams, Routes} from 'react-router-dom'
import Login from './pages/auth/Login';
import Base from './pages/Base';
import Content from './pages/dashboard/Content';
import User from './pages/users/User';
import Profile from './pages/profile/Profile';
import Form from './pages/Form/Form';
import Userform from './pages/Form/userForm';
import Register from './pages/auth/register';
import ViewForms from './pages/Form/viewForms';
import FormDetails from './pages/Form/formDetails';

const Routing = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} /> 
      <Route path="/register" element={<Register/>} /> 

      <Route path="/" element={<Base><Content/></Base>} />
      <Route path="/profile" element={<Base><Profile/></Base>} />
      <Route path="/users" element={<Base><User/></Base>} />
      <Route path="/form" element={<Base><Form/></Base>} /> 
      <Route path="/view-forms" element={<Base><ViewForms/></Base>}/>v
      <Route path="/view-form/:formId" element={<Base><FormDetails /></Base>} />
      <Route path="/Userform/:formId" element={<Userform/>} /> 
      
    </Routes>
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </div>
  );
}

export default App;
