import React from 'react';
import { NavLink } from 'react-router-dom';
import "../assets/css/style.css";
import avatar from '../assets/images/avatar.png';
import { connect } from 'react-redux';

const Sidebar = ({ adminDetails }) => {
  // Check if adminDetails exist in local storage or session storage
  const storedAdminDetails = JSON.parse(localStorage.getItem('adminDetails')) || JSON.parse(sessionStorage.getItem('adminDetails'));

  // Use the stored adminDetails if available, otherwise use the one from Redux store
  const { firstname, lastname } = storedAdminDetails || adminDetails || { firstname: '', lastname: '' };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"
      />
      <input type="checkbox" id="menu-toggle" />
      <div className="sidebar">
        <div className="side-header">
          <h3>
            I<span>ACE</span>
          </h3>
        </div>
        <div className="side-content">
          <div className="profile">
            <div
              className="profile-img bg-img"
              style={{ backgroundImage: `url(${avatar})` }}
            />
            <h4>{firstname} {lastname}</h4>
            <small>Admin</small>
          </div>
          <div className="side-menu">
            <ul>
              <li>
                <NavLink exact to="/" activeClassName="active">
                  <span className="las la-home" />
                  <small>Dashboard</small>
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" activeClassName="active">
                  <span className="las la-user-alt" />
                  <small>Profile</small>
                </NavLink>
              </li>
              <li>
                <NavLink to="/users" activeClassName="active">
                  <span className="las la-users" />
                  <small>Users</small>
                </NavLink>
              </li>
              <li>
                <NavLink to="/form" activeClassName="active">
                  <span className="las la-clipboard-list" />
                  <small>Add New Form</small>
                </NavLink>
              </li>
              <li>
                <NavLink to="/view-forms" activeClassName="active">
                  <span className="las la-eye" />
                  <small>View All Forms</small>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  adminDetails: state.admin.adminDetails, // Assuming you have an admin reducer that stores the admin details
});

export default connect(mapStateToProps)(Sidebar);
