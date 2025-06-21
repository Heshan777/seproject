import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const StudentDashboard = () => {
    const { user } = useAuth();
    return (
        <div className="dashboard-container">
            <h1>Student Dashboard</h1>
            <h2>Welcome, {user?.fullName || user?.email}!</h2>
            <p>Ready to find your next opportunity?</p>

            <div className="dashboard-actions">
                <Link to="/internships" className="cta-button">
                    Browse All Internships
                </Link>
                <Link to="/my-applications" className="secondary-button">
                    My Applications
                </Link>
            </div>
        </div>
    );
};
export default StudentDashboard;