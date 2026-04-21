import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, role }) => {
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);
    if (!isLoggedIn || userInfo?.roleId !== role) return <Navigate to="/login" replace />;
    return children;
};

export default RoleRoute;
