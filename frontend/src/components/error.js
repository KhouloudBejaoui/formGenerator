import React from 'react'
import error from '../assets/images/404.png';
import styles from "./error.module.css"

function Error() {
  return (
    <div className={styles.bodyerror}>
      <img className={styles.bodyerror} src={error} alt="error" />
    </div>
  )
}

export default Error
