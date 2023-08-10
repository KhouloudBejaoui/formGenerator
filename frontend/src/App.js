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
import UpdateForm from './pages/Form/updateForm';
import RecompenseList from './pages/recompense/recompenseList';
import AlreadySubmittedPage from './pages/response/AlreadySubmittedPage';

import ReactModal from 'react-modal';
ReactModal.setAppElement('#root'); // Use the ID of your root element


const Routing = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/Userform/:userId/:formId" element={<Userform />} />
      <Route path="/done" element={<Done />} />
      <Route path="/already-submitted" element={<AlreadySubmittedPage />} />


      {/* Use PrivateRoute for protected routes */}
      <Route exact="true" path='/form' element={<PrivateRoute />}>
        <Route  path='/form' element={<Base><Form /></Base>} />
      </Route>
      <Route exact="true" path='/' element={<PrivateRoute />}>
        <Route path="/" element={<Base><Content /></Base>} />
      </Route>
      <Route exact="true" path='/profile' element={<PrivateRoute />}>
        <Route path="/profile" element={<Base><Profile /></Base>} />
      </Route>
      <Route exact="true" path='/users' element={<PrivateRoute />}>
        <Route path="/users" element={<Base><User /></Base>} />
      </Route>
      <Route exact="true" path='/view-forms' element={<PrivateRoute />}>
        <Route path="/view-forms" element={<Base><ViewForms /></Base>} />
      </Route>
      <Route exact="true" path='/view-form/:formId' element={<PrivateRoute />}>
        <Route path="/view-form/:formId" element={<Base><FormDetails /></Base>} />
      </Route>
      <Route exact="true" path='/response/:formId' element={<PrivateRoute />}>
        <Route path="/response/:formId" element={<Base><ResponseExport /></Base>} />
      </Route>
      {/*<Route exact path='/update-form/:formId' element={<PrivateRoute />}>
        <Route path="/update-form/:formId" element={<Base><UpdateForm /></Base>} />
      </Route>*/}
      <Route exact="true" path='/view-recompenses' element={<PrivateRoute />}>
        <Route path="/view-recompenses" element={<Base><RecompenseList /></Base>} />
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