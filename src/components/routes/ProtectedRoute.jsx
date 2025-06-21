// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        const dashboardPath = user.role === 'students' ? '/student/dashboard' 
                            : user.role === 'companies' ? '/company/dashboard' 
                            : '/admin/dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};
export default ProtectedRoute;
