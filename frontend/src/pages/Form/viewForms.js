import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from "./viewForm.module.css"
import formImage from "../../assets/images/form.png"
import { useNavigate } from 'react-router-dom';
import { retrieveForms,deleteForm } from '../../redux/actions/form';
import DeleteIcon from '@material-ui/icons/Delete';

const ViewForms = ({ forms, retrieveForms, deleteForm }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of forms from the Redux store when the component mounts
    retrieveForms();
  }, [retrieveForms]);

  const handleDeleteForm = (formId) => {
    deleteForm(formId);
    navigate('/view-forms'); // Redirect to the updated page after deletion
  };

  return (
    <main>
      <div className="page-header">
        <h1>Forms</h1>
        <small>Home / View All Forms</small>
      </div>
      <div className={styles.bodyV}>
        <div className={styles.main}>
          {forms.map((form) => {
            // Access the form details from the forms array
            const { id, documentName, documentDescription } = form;
            console.log(id);
            return (
              <div key={id} className={styles.card}>
                {/* Render the form details in the card */}
                <div className={styles.image}>
                  <img src={formImage} alt="Form" />
                </div>
                <div className={styles.title}>
                  <h1 className={styles.h1V}>{documentName}</h1>
                </div>
                <div className={styles.des}>
                  <p>{documentDescription}</p>
                  <button
                    className={styles.buttonV}
                    onClick={() => {
                      // Redirect to the individual form view page (replace 'formId' with the appropriate route)
                      navigate(`/view-form/${id}`);
                    }}
                  >
                    View Form
                  </button>
                </div>
                <div className={styles.deleteIcon} onClick={() => handleDeleteForm(id)}>
                <DeleteIcon />
              </div>
              </div>
            );
          })}
        </div>
      </div>
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
