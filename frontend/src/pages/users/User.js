import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { retrieveUsers, deleteUser } from '../../redux/actions/users';
import styles from './user.module.css';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { retrieveRecompenses } from "../../redux/actions/recompense";
import recompenseDataService from "../../services/recompense.service";
import userDataService from "../../services/user.service";

const User = ({ users, retrieveUsers, recompenses, deleteUser, retrieveRecompenses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecompense, setSelectedRecompense] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSelectRecompenseModalOpen, setIsSelectRecompenseModalOpen] = useState(false); // New state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  useEffect(() => {
    retrieveUsers();
    retrieveRecompenses();
  }, []);

  const showAlert = (userId) => {
    setSelectedUserId(userId); 
    setIsModalOpen(true);
  };
  const handleClosePopup = () => {
    setIsModalOpen(false);
  };

  const showAlertDelete = (userId) => {
    setPopupVisible(true);
    setUserIdToDelete(userId); 
  };
  const handleClosePopupDelete = () => {
    setPopupVisible(false);
  };

  const handleDeleteUser = (userId) => {
    console.log(userId);
    deleteUser(userId);
    navigate('/users');
    handleClosePopupDelete();
  };

  // Define states for input fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleAddUser = () => {
    setUsername(''); // Reset the input fields
    setEmail('');
    setSelectedUser(null); // Clear the selected recompense
    setIsModalUpdateOpen(true);
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setIsModalUpdateOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        // Update mode
        const updatedUser = {
          ...selectedUser,
          email,
          username
        };

        console.log('Updating user with the following values:', updatedUser);

        await userDataService.update(selectedUser.id, updatedUser);
      } else {
        // Add mode
        const newUser = {
          email,
          username,
        };

        console.log('Creating new user with the following values:', newUser);

        await userDataService.create(newUser);
      }

      console.log('User saved successfully.');
      setIsModalUpdateOpen(false);
      setSelectedUser(null); // Clear the selected user
      retrieveUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      // Handle error here
    }
  };

  const handleSendRecompense = () => {
    // Handle the recompense sending logic here
    console.log(`Sending recompense to user with ID: ${selectedUserId}`);
    // Open the second modal for selecting recompenses
    setIsSelectRecompenseModalOpen(true);
    // Close the first modal
    handleClosePopup();
  };

  const handleSelectRecompense = async () => {
    if (selectedRecompense) {
      const selectedRecompenseObject = recompenses.find(recompense => recompense.libelle === selectedRecompense);
      const selectedUser = users.find(user => user.id === selectedUserId);

      if (selectedUser && selectedRecompenseObject) {
        const emailData = {
          userId: selectedUserId,
          recompenseId: selectedRecompenseObject.id
        };
        try {
          // Call the backend function using your service
          const response = await recompenseDataService.sendRecompenseByEmail(emailData);
          console.log('Response from backend:', response.data.message);

          // Close the select recompense modal
          handleCloseSelectRecompenseModal();
        } catch (error) {
          console.error('Error sending recompense by email:', error);
        }
      } else {
        console.log('Selected user or recompense not found.');
      }
    } else {
      console.log('No recompense selected.');
    }
  };



  const handleCloseSelectRecompenseModal = () => {
    setIsSelectRecompenseModalOpen(false);
  };

  return (
    <main>
      <div className="page-header">
        <h1>Users</h1>
        <small>Home / Users</small>
      </div>
      <div className="page-content">
        <div className="records table-responsive">
          <div className="record-header">
            <div className="add">
              <span>Entries</span>
              <select name="" id="">
                <option value="">ID</option>
              </select>
              <button style={{ cursor: 'pointer' }} onClick={() => handleAddUser()}>Add user</button>
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
                    <span className="las la-sort" /> USERNAME
                  </th>
                  <th>
                    <span className="las la-sort" /> EMAIL
                  </th>
                  <th>
                    <span className="las la-sort" /> HAS ANSWERED ?
                  </th>
                  <th>
                    <span className="las la-sort" /> ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div className="client">
                        <div className="client-info">
                          <h4>{user.username}</h4>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={user.hasAnswered ? 'green' : 'red'}>
                        {user.hasAnswered ? 'true' : 'false'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <span className="lab la-telegram-plane" style={{ cursor: 'pointer' }} onClick={() => showAlert(user.id)} />
                        <span className="la la-pencil" style={{ cursor: 'pointer', color: 'green' }} onClick={() => handleUpdateUser(user)} />
                        <span className="las la-trash" style={{ cursor: 'pointer', color: 'red' }} onClick={() => showAlertDelete(user.id)} />
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
        contentLabel="Delete User"
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>Delete User</h2>
        <p className={styles.popupMessage}>Are you sure you want to delete this user?</p>
        <div className={styles.popupButtons}>
          <button className={`${styles.popupButton} ${styles.popupButtonPrimary}`} onClick={() => handleDeleteUser(userIdToDelete)}>
            Delete
          </button>
          <button className={`${styles.popupButton} ${styles.popupButtonSecondary}`} onClick={handleClosePopupDelete}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* send recompence Modal Popup */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleClosePopup}
        contentLabel="Send Recompense"
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>Send Recompense</h2>
        <p className={styles.popupMessage}>Are you sure you want to send a recompense to this user?</p>
        <div className={styles.popupButtons}>
          <button className={`${styles.popupButton} ${styles.popupButtonPrimary}`} onClick={handleSendRecompense}>
            Send
          </button>
          <button className={`${styles.popupButton} ${styles.popupButtonSecondary}`} onClick={handleClosePopup}>
            Cancel
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isSelectRecompenseModalOpen}
        onRequestClose={handleCloseSelectRecompenseModal}
        contentLabel="Select Reward"
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>Select Reward</h2>
        <div className={styles.fieldAdd}>
          <label className={styles.labelAdd}>Reward</label>
          <div className={styles.controlAdd}>
            <select
              className={styles.selectAdd}
              value={selectedRecompense}
              onChange={(e) => setSelectedRecompense(e.target.value)}
            >
              <option value="">Select Reward</option>
              {recompenses
                ?.filter(recompense => recompense.isSended === null || recompense.isSended == 0 )
                .map((recompense) => (
                  <option key={recompense.id} value={recompense.id}>
                    {recompense.libelle}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={styles.popupButtons}>
          <button
            className={`${styles.popupButton} ${styles.popupButtonPrimary}`}
            onClick={handleSelectRecompense} // Handle the select logic here
          >
            Send
          </button>
          <button
            className={`${styles.popupButton} ${styles.popupButtonSecondary}`}
            onClick={handleCloseSelectRecompenseModal}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* update and save Modal Popup */}
      <Modal
        isOpen={isModalUpdateOpen}
        onRequestClose={() => setIsModalUpdateOpen(false)}
        contentLabel={selectedUser ? "Update User" : "Add User"} // Update the label
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>
          {selectedUser ? "Update User" : "Add User"} {/* Update the title */}
        </h2>
        <div className={styles.popupContentAdd}>
          <div className={styles.fieldAdd}>
            <label className={styles.labelAdd}>Username</label>
            <div className={styles.controlAdd}>
              <input
                className={styles.inputAdd}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.fieldAdd}>
            <label className={styles.labelAdd}>Email</label>
            <div className={styles.controlAdd}>
              <input
                className={styles.inputAdd}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={styles.popupButtonsAdd}>
          <button
            className={`${styles.popupButtonAdd} ${styles.popupButtonPrimaryAdd}`}
            onClick={handleSaveUser}
          >
            Save
          </button>
          <button
            className={`${styles.popupButtonAdd} ${styles.popupButtonSecondaryAdd}`}
            onClick={() => {
              setIsModalUpdateOpen(false);
              setSelectedUser(null); // Clear the selected user when canceling
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
    users: state.users,
    recompenses: state.recompense
  };
};

const mapDispatchToProps = {
  retrieveRecompenses,
  retrieveUsers,
  deleteUser
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
