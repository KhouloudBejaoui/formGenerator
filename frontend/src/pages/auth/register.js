import React, { useState } from 'react';
import { connect } from 'react-redux';
import { registerAdmin } from '../../redux/actions/admin';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import login from '../../assets/images/login.png';

const Register = () =>  {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [adminData, setAdminData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the registerAdminAction with the admin data
    dispatch(registerAdmin(adminData))
      .then((response) => {
        console.log(response); // Check the response from the server

        // Check the response data for success or error
        if (response && response.token) {
          // Registration success
          setAlertType('alert-success');
          setAlertMessage('Registration successful!');
          setShowAlert(true);
          // Optionally, you can navigate to the login page after a delay
          setTimeout(() => {
            navigate('/login'); // Navigate to login page after successful registration
          }, 3000); // 3 seconds delay before navigating
        } else {
          // Registration error
          setAlertType('alert-error');
          setAlertMessage('Registration failed. Please try again.');
          setShowAlert(true);
        }
      })
      .catch((error) => {
        console.error(error); // Log any errors that occurred during registration
        setAlertType('alert-error');
        setAlertMessage('Registration failed. Please try again.');
        setShowAlert(true);
      });
  };  

  return (
    <div className={styles.bodyLogin}>
      <div className={styles.containerLogin}>
        <div className={styles.login}>
        {showAlert && <div className={`${styles.alert} ${styles[alertType]}`}>{alertMessage}</div>}
          <form className={styles.formLogin} onSubmit={handleSubmit}>
            <h1 className={styles.h1Login}>Register</h1>
            <hr className={styles.hrLogin} />
            <p className={styles.pLogin}>Explore the World!</p>
            <label className={styles.labelLogin}>Username</label>
            <input className={styles.inputLogin} type="text" name="username" value={adminData.username} onChange={handleChange} placeholder="enter your username" />
            <label className={styles.labelLogin}>Email</label>
            <input className={styles.inputLogin} type="text" name="email" value={adminData.email} onChange={handleChange} placeholder="abc@example.com" />
            <label className={styles.labelLogin}>Password</label>
            <input className={styles.inputLogin} type="password" name="password" value={adminData.password}  onChange={handleChange} placeholder="enter your password!" />
            <button className={styles.buttonLogin} type="submit">Submit</button>
            <closeform />
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
  registerAdmin: (adminData) => dispatch(registerAdmin(adminData)),
});

export default connect(null, mapDispatchToProps)(Register);
