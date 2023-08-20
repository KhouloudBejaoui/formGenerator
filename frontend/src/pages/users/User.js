import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { retrieveUsers, deleteUser,deleteAllUsers } from '../../redux/actions/users';
import {exportResponseToExcel } from '../../redux/actions/response';
import fileSaver from 'file-saver'; 
import styles from './user.module.css';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { retrieveRecompenses } from "../../redux/actions/recompense";
import recompenseDataService from "../../services/recompense.service";
import userDataService from "../../services/user.service";
import * as XLSX from 'xlsx';
const User = ({ users, retrieveUsers, recompenses, deleteUser, deleteAllUsers, retrieveRecompenses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecompense, setSelectedRecompense] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSelectRecompenseModalOpen, setIsSelectRecompenseModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupDeleteAllVisible, setPopupDeleteAllVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  // State to manage the modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);


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

  const showAlertDeleteAll = () => {
    setPopupDeleteAllVisible(true);
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

  const handleDeleteAllUsers = () => {
    deleteAllUsers();
    navigate('/users');
    handleClosePopupDeleteAll();
  };
  const handleClosePopupDeleteAll = () => {
    setPopupDeleteAllVisible(false);
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

  // Function to handle file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const fileReader = new FileReader();

        // Read the Excel file
        fileReader.onload = async (event) => {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          // Assuming data is in the first sheet
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert sheet data to JSON format
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // Send the JSON data to the backend API
          try {
            await userDataService.importUsers(jsonData);
            // Refresh the user list
            retrieveUsers();
            // Close the modal
            setIsImportModalOpen(false);
          } catch (error) {
            console.error('Error uploading file:', error);
            // Handle error here
          }
        };

        fileReader.readAsBinaryString(selectedFile);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error here
      }
    }
  };

  const filterUsers = (filterValue) => {
    setIsFiltered(true);

    if (filterValue === 'answered') {
      setFilteredUsers(users.filter(user => user.hasAnswered));
    } else if (filterValue === 'not_answered') {
      setFilteredUsers(users.filter(user => !user.hasAnswered));
    } else {
      // Reset filtering
      setIsFiltered(false);
      setFilteredUsers([]);
    }
  };


  // Function to export the response to Excel
  const handleExportToExcel = async () => {
    if (users.length === 0) return;
  
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      const sheetName = 'Users';
      const worksheetData = [['id','username','email', 'hasAnswered']];
  
      // Add data to the worksheet
      users.forEach(response => {
        const rowData = [response.id, response.username,response.email, response.hasAnswered];
        worksheetData.push(rowData);
      });
  
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
       // Convert the workbook to a binary string
    const excelFile = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });

    // Send the Excel file to the backend using the exportUsers function
    const formData = new FormData();
    formData.append('file', blob, 'users.xlsx');
    await exportResponseToExcel(formData);

    // Save the Excel file on the frontend
    fileSaver.saveAs(blob, 'users.xlsx');

  } catch (error) {
    console.error('Error exporting users to Excel:', error);
  }
};

  // Helper function to convert a string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
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
              <button style={{ cursor: 'pointer' }} onClick={() => handleAddUser()}>Add user</button>
              <button style={{ cursor: 'pointer', marginLeft: "10px" }} onClick={() => setIsImportModalOpen(true)}>
                Import Users
              </button>
              <button style={{ cursor: 'pointer', marginLeft: "10px" }}  onClick={handleExportToExcel} >Export</button>
              <button style={{ backgroundColor:"red", cursor: 'pointer', marginLeft: "10px" }}  onClick={showAlertDeleteAll} >Delete All</button>

            </div>
            
            <div className="browse">
              <input
                type="search"
                placeholder="Search"
                className="record-search"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
              />
              <select
                name=""
                id=""
                onChange={(e) => filterUsers(e.target.value)}
              >
                <option value="">All</option>
                <option value="answered">Answered</option>
                <option value="not_answered">Not Answered</option>
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

                {isFiltered
                  ? filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
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
                  ))
                  : users.filter(user => user.username.toLowerCase().includes(searchKeyword.toLowerCase()) || user.email.toLowerCase().includes(searchKeyword.toLowerCase()))
                  .map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
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
                  ))
                }
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

      {/* DeleteAll Modal Popup */}
      <Modal
        isOpen={isPopupDeleteAllVisible}
        onRequestClose={handleClosePopup}
        contentLabel="Delete Users"
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>Delete Users</h2>
        <p className={styles.popupMessage}>Are you sure you want to delete all users?</p>
        <div className={styles.popupButtons}>
          <button className={`${styles.popupButton} ${styles.popupButtonPrimary}`} onClick={handleDeleteAllUsers}>
            Delete
          </button>
          <button className={`${styles.popupButton} ${styles.popupButtonSecondary}`} onClick={handleClosePopupDeleteAll}>
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
                ?.filter(recompense => recompense.isSended === null || recompense.isSended == 0)
                .map((recompense) => (
                  <option key={recompense.id} value={recompense.libelle}>
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


      <Modal
        isOpen={isImportModalOpen}
        onRequestClose={() => setIsImportModalOpen(false)}
        contentLabel="Import Users"
        className={styles.popupContainer}
        overlayClassName={styles.popupOverlay}
      >
        <h2 className={styles.popupTitle}>Import Users from Excel</h2>
        <div className={styles.fieldAdd}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileSelect} />
        </div>

        <div className={styles.popupButtonsAdd}>
          <button onClick={handleFileUpload} className={`${styles.popupButtonAdd} ${styles.popupButtonPrimaryAdd}`}>Upload and Save</button>
          <button onClick={() => setIsImportModalOpen(false)} className={`${styles.popupButtonAdd} ${styles.popupButtonSecondaryAdd}`}>Cancel</button>
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
  deleteUser,
  deleteAllUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(User);