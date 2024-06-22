import React from 'react';
import {Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Home from '../home/Home';
import { Button } from 'react-bootstrap';

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  if(localStorage.length == 0)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (localStorage.getItem("userRole") !== 'ROLE_ADMIN') {
    // Display message for non-admin users
    return <div>
        <h1>
        Bạn Không có quyền truy cập vào trang này. <Link to="/">Quay Lại Trang Chủ</Link>
        </h1>
        </div>
  }

  
  

  

  return children;
};

export default RequireAdmin;
