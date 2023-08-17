import React, { useEffect, useState } from 'react';
import "../../assets/css/style.css";
import { connect } from "react-redux";
import { retrieveRecompenses, createRecompense, deleteRecompense, updateRecompense } from "../../redux/actions/recompense";
import styles from './modal.module.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import recompenseDataService from "../../services/recompense.service";

const RecompenseList = ({ recompenses, deleteRecompense, updateRecompense, retrieveRecompenses }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [recompenseIdToDelete, setRecompenseIdToDelete] = useState(null);
  const dispatch = useDispatch();
  const [selectedRecompense, setSelectedRecompense] = useState(null);

  useEffect(() => {
    console.log("Retrieving recompenses...");
    retrieveRecompenses();
  }, []);

  const showAlert = (formId) => {
    setPopupVisible(true);
    setRecompenseIdToDelete(formId); // Set the formIdToDelete when the delete icon is clicked
  };
  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const handleDeleteRecompense = (recompenseId) => {
    console.log(recompenseId);
    deleteRecompense(recompenseId);
    navigate('/view-recompenses');
    handleClosePopup();
  };

  // Define states for input fields
  const [libelle, setLibelle] = useState('');
  const [code, setCode] = useState('');
  const [operateur, setOperateur] = useState('');
  const userId = null;

  const handleAddRecompense = () => {
    setLibelle(''); // Reset the input fields
    setCode('');
    setOperateur('');
    setSelectedRecompense(null); // Clear the selected recompense
    setIsModalOpen(true);
  };

  const handleUpdateRecompense = (recompense) => {
    setSelectedRecompense(recompense);
    setLibelle(recompense.libelle);
    setCode(recompense.code);
    setOperateur(recompense.operateur);
    setIsModalOpen(true);
  };


  const handleSaveRecompense = async () => {
    try {
      if (selectedRecompense) {
        // Update mode
        const updatedRecompense = {
          ...selectedRecompense,
          libelle,
          code,
          operateur,
          userId,
        };

        console.log('Updating recompense with the following values:', updatedRecompense);

        await recompenseDataService.update(selectedRecompense.id, updatedRecompense);
      } else {
        // Add mode
        const newRecompense = {
          libelle,
          code,
          operateur,
          userId,
        };

        console.log('Creating new recompense with the following values:', newRecompense);

        await recompenseDataService.create(newRecompense);
      }

      console.log('Recompense saved successfully.');
      setIsModalOpen(false);
      setSelectedRecompense(null); // Clear the selected recompense
      retrieveRecompenses();
    } catch (error) {
      console.error('Error saving recompense:', error);
      // Handle error here
    }
  };


  return (
    <main>
      <div className="page-header">
        <h1>Rewards</h1>
        <small>Home / Rewards</small>
      </div>
      <div className="page-content">
        <div className="records table-responsive">
          <div className="record-header">
            <div className="add">
              <span>Entries</span>
              <select name="" id="">
                <option value="">ID</option>
              </select>
              <button style={{ cursor: 'pointer' }} onClick={() => handleAddRecompense()}>Add reward</button>
            </div>
            <div className="browse">
              <input
                type="search"
                placeholder="Search"
                className="record-search"
              />
              <select name="" id="">
                <option value="">Status</option>
              </select>
            </div>
          </div>
          <div>
            <table width="100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <span className="las la-sort" /> REWARD
                  </th>
                  <th>
                    <span className="las la-sort" /> CODE
                  </th>
                  <th>
                    <span className="las la-sort" /> OPERATEUR
                  </th>
                  <th>
                    <span className="las la-sort" /> IS IT SENDED ?
                  </th>
                  <th>
                    <span className="las la-sort" /> USER ID
                  </th>
                  <th>
                    <span className="las la-sort" /> ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {recompenses?.map((recompense) => (
                  <tr key={recompense.id}>
                    <td>{recompense.id}</td>
                    <td>
                      <div className="client">

                        <div className="client-info">
                          <h4>{recompense.libelle}</h4>
                        </div>
                      </div>
                    </td>
                    <td>{recompense.code}</td>
                    <td>{recompense.operateur}</td>
                    <td>
                      <span className={recompense.isSended ? 'green' : 'red'}>
                        {recompense.isSended ? 'true' : 'false'}
                      </span>
                    </td>
                    <td>{recompense.userId}</td>
                    <td>
                      <div className="actions">
                        <span className="la la-pencil" style={{ cursor: 'pointer', color: 'green' }} onClick={() => handleUpdateRecompense(recompense)} />
                        <span />
                        <span className="las la-trash" style={{ cursor: 'pointer', color: 'red' }} onClick={() => showAlert(recompense.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal Popup */}
      <Modal
        isOpen={isPopupVisible}
        onRequestClose={handleClosePopup}
        contentLabel="Delete Reward"
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>Delete Reward</h2>
        <p className={styles.popupMessage}>Are you sure you want to delete this reward?</p>
        <div className={styles.popupButtons}>
          <button className={`${styles.popupButton} ${styles.popupButtonPrimary}`} onClick={() => handleDeleteRecompense(recompenseIdToDelete)}>
            Delete
          </button>
          <button className={`${styles.popupButton} ${styles.popupButtonSecondary}`} onClick={handleClosePopup}>
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel={selectedRecompense ? "Update Reward" : "Add Reward"} // Update the label
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>
          {selectedRecompense ? "Update Reward" : "Add Reward"} {/* Update the title */}
        </h2>
        <div className={styles.popupContentAdd}>
          <div className={styles.fieldAdd}>
            <label className={styles.labelAdd}>Libelle</label>
            <div className={styles.controlAdd}>
              <input
                className={styles.inputAdd}
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.fieldAdd}>
            <label className={styles.labelAdd}>Code</label>
            <div className={styles.controlAdd}>
              <input
                className={styles.inputAdd}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.fieldAdd}>
            <label className={styles.labelAdd}>Operateur</label>
            <div className={styles.controlAdd}>
              <select
                className={styles.selectAdd}
                value={operateur}
                onChange={(e) => setOperateur(e.target.value)}
              >
                <option value="">Select Operateur</option>
                <option value="Orange">Orange</option>
                <option value="Telecom">Telecom</option>
                <option value="Oredoo">Oredoo</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.popupButtonsAdd}>
          <button
            className={`${styles.popupButtonAdd} ${styles.popupButtonPrimaryAdd}`}
            onClick={handleSaveRecompense}
          >
            Save
          </button>
          <button
            className={`${styles.popupButtonAdd} ${styles.popupButtonSecondaryAdd}`}
            onClick={() => {
              setIsModalOpen(false);
              setSelectedRecompense(null); // Clear the selected recompense when canceling
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>


    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    recompenses: state.recompense

  };
};
const mapDispatchToProps = {
  retrieveRecompenses,
  deleteRecompense,
  updateRecompense,
  createRecompense
};

export default connect(mapStateToProps, mapDispatchToProps)(RecompenseList);
