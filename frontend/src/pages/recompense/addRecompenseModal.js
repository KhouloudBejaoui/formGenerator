import React, { useState } from 'react';
import styles from './modal.module.css'; // Import the CSS module

const AddRecompenseModal = ({ isOpen, onClose, onSave }) => {
  const [libelle, setLibelle] = useState('');
  const [code, setCode] = useState('');
  const [operateur, setOperateur] = useState('');

  const handleSave = () => {
    const newRecompense = {
      libelle,
      code,
      operateur,
    };
    onSave(newRecompense);
    onClose();
  };
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`${styles.modal} ${isOpen ? styles['is-active'] : ''}`}>
      <div className={styles['modal-background']} onClick={onClose}></div>
      <div className={styles['modal-card']} onClick={handleModalClick}>
      <div className={styles['modal-card']}>
        <header className={styles['modal-card-head']}>
          <p className={styles['modal-card-title']}>Add Recompense</p>
          <button className={styles.delete} onClick={onClose}></button>
        </header>
        <section className={styles['modal-card-body']}>
          <div className={styles.field}>
            <label className={styles.label}>Libelle</label>
            <div className={styles.control}>
              <input
                className={styles.input}
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Code</label>
            <div className={styles.control}>
              <input
                className={styles.input}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Operateur</label>
            <div className={styles.control}>
              <select
                className={styles.select}
                value={operateur}
                onChange={(e) => setOperateur(e.target.value)}
              >
                <option value="">Select Operateur</option>
                <option value="Orange">Orange</option>
                <option value="Telecom">Telecom</option>
                <option value="Telecom">Oredoo</option>
              </select>
            </div>
          </div>
        </section>
        <footer className={styles['modal-card-foot']}>
          <button className={`${styles.button} ${styles['is-success']}`} onClick={handleSave}>
            Save
          </button>
          <button className={styles.button} onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
      </div>
    </div>
  );
};

export default AddRecompenseModal;
