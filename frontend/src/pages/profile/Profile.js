import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdmin } from '../../redux/actions/admin';
import styles from './profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const storedAdminDetails = JSON.parse(localStorage.getItem('adminDetails'));

  // State to hold form input values
  const [formData, setFormData] = useState({
    firstname: storedAdminDetails.firstname || '',
    lastname: storedAdminDetails.lastname || '',
    email: storedAdminDetails.email || '',
    number: storedAdminDetails.number || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the updateAdmin action
    try {
      await dispatch(updateAdmin(formData)); // Dispatch action to update admin details
      // Handle success (e.g., show success message)
    } catch (error) {
      // Handle error (e.g., show error message)
    }
  };
  return (
    <main>
      <div className="page-header">
        <h1>Profile</h1>
        <small>Home / Edit Profile</small>
      </div>
      <div className={styles.bodyProfile}>
        <div className={styles.container}>
          <div className={styles.title}>Edit profile</div>
          <div className={styles.content}>
            <form action="#">
              <div className={styles["user-details"]}>
                <div className={styles["input-box"]}>
                  <span className={styles.details}>Firstname</span>
                  <input type="text" placeholder="Enter your name" name="firstname"
                    value={formData.firstname}
                    onChange={handleChange} required />
                </div>
                <div className={styles["input-box"]}>
                  <span className={styles.details}>Lastname</span>
                  <input type="text" placeholder="Enter your lastname" name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required />
                </div>
                <div className={styles["input-box"]}>
                  <span className={styles.details}>Email</span>
                  <input type="email" placeholder="Enter your email" name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                </div>
                <div className={styles["input-box"]}>
                  <span className={styles.details}>Phone Number</span>
                  <input type="text" placeholder="Enter your number" name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required />
                </div>
                <div className={styles["input-box"]}>
                  <span className={styles.details}>Password</span>
                  <input type="password" placeholder="Enter your password" name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required />
                </div>
                <div className={styles["input-box"]}>
                  <span className={styles.details}>Confirm Password</span>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.button}>
                <input type="submit" onClick={handleSubmit} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;