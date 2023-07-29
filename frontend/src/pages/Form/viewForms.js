import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from "./viewForm.module.css"
import formImage from "../../assets/images/form.png"
import { Link, useNavigate } from 'react-router-dom';
import { retrieveForms, deleteForm } from '../../redux/actions/form';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from 'react-modal';

const ViewForms = ({ forms, retrieveForms, deleteForm }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formIdToDelete, setFormIdToDelete] = useState(null);

  useEffect(() => {
    // Fetch the list of forms from the Redux store when the component mounts
    retrieveForms();
  }, [retrieveForms]);

  const handleDeleteForm = (formId) => {
    deleteForm(formId);
    navigate('/view-forms'); // Redirect to the updated page after deletion
    handleClosePopup(); // Close the popup after deleting the form
  };

  const showAlert = (formId) => {
    setPopupVisible(true);
    setFormIdToDelete(formId); // Set the formIdToDelete when the delete icon is clicked
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  // Sort the forms by date of creation (createdAt)
  const sortedForms = forms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <main>
      <div className="page-header">
        <h1>Forms</h1>
        <small>Home / View All Forms</small>
      </div>
      <div className={styles.bodyV}>
        <div className={styles.main}>
          {sortedForms.map((form) => {
            const { id, documentName, documentDescription, createdAt } = form;
            // Format the date to be more human-readable (e.g., "July 28, 2023")
            const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div key={id} className={styles.card}>
                <div className={styles.image}>
                  <img src={formImage} alt="Form" />
                </div>
                <div className={styles.title}>
                  <h1 className={styles.h1V}>{documentName}</h1>
                </div>
                <div className={styles.des}>
                  <p>{formattedDate}</p>
                  <button
                    className={styles.buttonV}
                    onClick={() => {
                      navigate(`/view-form/${id}`);
                    }}
                  >
                    View Form
                  </button>
                </div>
                <div className={styles.deleteIcon} onClick={() => showAlert(id)}>
                  <DeleteIcon />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal Popup */}
      <Modal
        isOpen={isPopupVisible}
        onRequestClose={handleClosePopup}
        contentLabel="Delete Form"
        className={styles.popupContainer} // Use the classname from your CSS module for the popup container
        overlayClassName={styles.popupOverlay} // Use the classname from your CSS module for the popup overlay
      >
        <h2 className={styles.popupTitle}>Delete Form</h2>
        <p className={styles.popupMessage}>Are you sure you want to delete this form?</p>
        <div className={styles.popupButtons}>
          <button className={`${styles.popupButton} ${styles.popupButtonPrimary}`} onClick={() => handleDeleteForm(formIdToDelete)}>
            Delete
          </button>
          <button className={`${styles.popupButton} ${styles.popupButtonSecondary}`} onClick={handleClosePopup}>
            Cancel
          </button>
        </div>
      </Modal>
    </main>
  );
};

const mapStateToProps = (state) => ({
  forms: state.form.forms,
});

const mapDispatchToProps = {
  retrieveForms,
  deleteForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewForms);
