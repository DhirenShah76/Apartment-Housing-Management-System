import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'Admin' ? '/admin' : '/tenant'} replace />;
    }

    return children;
};

export default ProtectedRoute;