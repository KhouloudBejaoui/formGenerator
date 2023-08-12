import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/admin';
import avatar from '../assets/images/avatar.png';

const Navbar=() =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Dispatch the logout action to clear the token from Redux state
      dispatch(logout());
  
      // Clear the token from Local Storage
      localStorage.removeItem('token');
      // Clear the adminDetails from Local Storage
      localStorage.removeItem('adminDetails');
      // Navigate to the login page
      navigate('/login');
    };
    
  return (
    <header>
    <div className="header-content">
        <label htmlFor="menu-toggle">
            <span className="las la-bars" />
        </label>
        <div className="header-menu">
            <label htmlFor="">
                <span className="las la-search" />
            </label>
            <div className="notify-icon">
                <span className="las la-envelope" />
                <span className="notify">4</span>
            </div>
            <div className="notify-icon">
                <span className="las la-bell" />
                <span className="notify">3</span>
            </div>
            <div className="user" onClick={handleLogout}>
                <div
                    className="bg-img"
                    style={{ backgroundImage: `url(${avatar})` }}
                />
                <span className="las la-power-off" />
                <span>Logout</span>
            </div>
        </div>
    </div>
</header>
  )
}

export default Navbar