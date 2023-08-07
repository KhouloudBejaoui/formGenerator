import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginAdmin } from '../../redux/actions/admin';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from "./login.module.css";
import login from '../../assets/images/login.png';

const Login = ({ loginAdmin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Create adminData object with email and password fields
  const adminData = {
    email,
    password,
  };

  try {
    // Dispatch the loginAdmin action with the adminData
    const response = await loginAdmin(adminData);

    // Ensure that the response is successful (status 200) and has the token
    if (response && response.token) {
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('token', response.token);

      // Navigate to the home page or any other page after successful login
      navigate('/');
    } else {
      // Show the alert for authentication failure
      setAlertType('alert-error');
      setAlertMessage('Authentication failed. Please check your credentials and try again.');
      setShowAlert(true);
    }
  } catch (error) {
    console.error(error); // Log any errors that occurred during login
    // Show the alert for authentication failure
    setAlertType('alert-error');
    setAlertMessage('Authentication failed. Please check your credentials and try again.');
    setShowAlert(true);
  }
};


  return (
    <div className={styles.bodyLogin}>
      <div className={styles.containerLogin}>
        <div className={styles.login}>
          {showAlert && <div className={`${styles.alert} ${styles[alertType]}`}>{alertMessage}</div>}
          <form className={styles.formLogin} onSubmit={handleSubmit}>
            <h1 className={styles.h1Login}>Login</h1>
            <hr className={styles.hrLogin} />
            <p className={styles.pLogin}>Explore the World!</p>
            <label className={styles.labelLogin}>Email</label>
            <input
              className={styles.inputLogin}
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="abc@exampl.com"
            />
            <label className={styles.labelLogin}>Password</label>
            <input
              className={styles.inputLogin}
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="enter your password!"
            />
            <button className={styles.buttonLogin} type="submit">Submit</button>
            <p className={styles.pLogin}>
              <Link className={styles.aLogin} to="/register">Not registered ?</Link>
            </p>
          </form>
        </div>
        <div className={styles.picLogin}>
          <img src={login} alt="Login" />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  loginAdmin: (adminData) => dispatch(loginAdmin(adminData)),
});

export default connect(null, mapDispatchToProps)(Login);
