import React from 'react';
import submitted from '../../assets/images/submitted.png';
import styles from "./done.module.css"

const AlreadySubmittedPage = () => {
    return (

        <main>
            <div className="page-header">
                <h1>You have already submitted your response</h1>
                <small>Stay tuned for more forms</small>
            </div>
            <div className={styles.bodydone}>
                <img className={styles.bodydone} src={submitted} alt="submitted" />
            </div>
        </main>
    );
};

export default AlreadySubmittedPage;
