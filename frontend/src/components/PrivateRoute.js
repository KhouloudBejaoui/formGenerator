import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // Check your authentication logic here
    const isAuthenticated = !!localStorage.getItem('token'); // Replace this with your actual logic

    // If authenticated, return an outlet that will render child elements
    // If not, return element that will navigate to the login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;



