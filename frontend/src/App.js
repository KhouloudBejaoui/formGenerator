import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, useHistory, useParams, Routes } from 'react-router-dom'
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
import ResponseExport from './pages/response/ResponseExport';
import Done from './pages/response/done';
import Error from './components/error';
import PrivateRoute from './components/PrivateRoute';




const Routing = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Userform/:formId" element={<Userform />} />
      <Route path="/done" element={<Done />} />

      {/* Use PrivateRoute for protected routes */}
      <Route exact path='/form' element={<PrivateRoute />}>
        <Route exact path='/form' element={<Base><Form /></Base>} />
      </Route>
      <Route exact path='/' element={<PrivateRoute />}>
        <Route path="/" element={<Base><Content /></Base>} />
      </Route>
      <Route exact path='/profile' element={<PrivateRoute />}>
        <Route path="/profile" element={<Base><Profile /></Base>} />
      </Route>
      <Route exact path='/users' element={<PrivateRoute />}>
        <Route path="/users" element={<Base><User /></Base>} />
      </Route>
      <Route exact path='/view-forms' element={<PrivateRoute />}>
        <Route path="/view-forms" element={<Base><ViewForms /></Base>} />
      </Route>
      <Route exact path='/view-form/:formId' element={<PrivateRoute />}>
        <Route path="/view-form/:formId" element={<Base><FormDetails /></Base>} />
      </Route>
      <Route exact path='/response/:formId' element={<PrivateRoute />}>
        <Route path="/response/:formId" element={<Base><ResponseExport /></Base>} />
      </Route>


      <Route path="*" element={<Error />} />
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