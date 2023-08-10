import React, { useEffect } from 'react';
import "../../assets/css/style.css";
import avatar from '../../assets/images/avatar.png';
import { connect } from "react-redux";
import { retrieveUsers } from "../../redux/actions/users";

const User = ({ users, retrieveUsers }) => {
  useEffect(() => {
    retrieveUsers();
  }, []);
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
              <button>Add user</button>
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
                    <span className="las la-sort" /> USER
                  </th>
                  <th>
                    <span className="las la-sort" /> TOTAL
                  </th>
                  <th>
                    <span className="las la-sort" /> ISSUED DATE
                  </th>
                  <th>
                    <span className="las la-sort" /> BALANCE
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
                        <div
                          className="client-img bg-img"
                          style={{ backgroundImage: `url(${avatar})` }}
                        />
                        <div className="client-info">
                          <h4>{user.username}</h4>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.total}</td>
                    <td>{user.issuedDate}</td>
                    <td>{user.balance}</td>
                    <td>
                      <div className="actions">
                        <span className="lab la-telegram-plane" />
                        <span className="las la-eye" />
                        <span className="las la-ellipsis-v" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps, { retrieveUsers })(User);
