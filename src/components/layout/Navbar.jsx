import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        return user.role === 'students' ? "/student/dashboard" :
               user.role === 'companies' ? "/company/dashboard" :
               '/admin/dashboard';
    };

    return (
        // A modern, semi-transparent AppBar that sits above the page content
        <AppBar 
            position="static" 
            color="transparent" 
            elevation={0} 
            sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to={getDashboardLink()}
                    sx={{
                        flexGrow: 1,
                        fontWeight: 'bold',
                        color: '#4A5568', // A slightly softer black for the logo
                        textDecoration: 'none'
                    }}
                >
                    InternLink
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user ? (
                        <>
                            <Typography variant="body1" sx={{ color: '#2D3748' }}>
                                Welcome, {user.fullName || user.companyName || 'User'}
                            </Typography>
                            <Button variant="outlined" color="primary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        // This is the styled "Login / Register" button
                        <Button
                            component={RouterLink}
                            to="/"
                            variant="outlined"
                            sx={{ 
                                color: '#4A5568',
                                borderColor: 'rgba(0, 0, 0, 0.23)'
                            }}
                        >
                            Login / Register
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;