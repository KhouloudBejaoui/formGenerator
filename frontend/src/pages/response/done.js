import React from 'react'
import done from '../../assets/images/done.png';
import styles from "./done.module.css"

const Done = () => {
    return (
        <main>
            <div className="page-header">
                <h1>Thank You</h1>
                <small>Your response is submitted successfully</small>
            </div>
            <div className={styles.bodydone}>
                <img className={styles.bodydone} src={done} alt="done" />
            </div>
        </main>
    )
}

export default Done
