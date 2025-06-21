import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        return user.role === 'students' ? "/student/dashboard" : "/company/dashboard";
    };

    const getProfileLink = () => {
        if (!user) return "/";
        return user.role === 'students' ? "/student/profile" : "/company/profile";
    };

    return (
        <nav className="navbar">
            <Link to={getDashboardLink()} className="nav-logo">InternLink</Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to={getProfileLink()}>My Profile</Link>
                        <span>Welcome, {user.fullName || user.companyName || user.email}</span>
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </>
                ) : (
                    <Link to="/">Login / Register</Link>
                )}
            </div>
        </nav>
    );
};
export default Navbar;