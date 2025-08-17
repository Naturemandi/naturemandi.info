import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/" />; // <-- FIXED

  return children;
};

export default AdminRoute;