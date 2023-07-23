import React from 'react';
import styles from "./profile.module.css";

const Profile = () => {
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
                <span className={styles.details}>Full Name</span>
                <input type="text" placeholder="Enter your name" required="" />
              </div>
              <div className={styles["input-box"]}>
                <span className={styles.details}>Username</span>
                <input type="text" placeholder="Enter your username" required="" />
              </div>
              <div className={styles["input-box"]}>
                <span className={styles.details}>Email</span>
                <input type="email" placeholder="Enter your email" required="" />
              </div>
              <div className={styles["input-box"]}>
                <span className={styles.details}>Phone Number</span>
                <input type="text" placeholder="Enter your number" required="" />
              </div>
              <div className={styles["input-box"]}>
                <span className={styles.details}>Password</span>
                <input type="password" placeholder="Enter your password" required="" />
              </div>
              <div className={styles["input-box"]}>
                <span className={styles.details}>Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  required=""
                />
              </div>
            </div>

            <div className={styles.button}>
              <input type="submit" defaultValue="Register" />
            </div>
          </form>
        </div>
      </div>
    </div>
    </main>
  );
}

export default Profile;
