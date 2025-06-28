import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  Link
} from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StudentDashboard = () => {
    const { user } = useAuth();
    // Fallback for user name to display something
    const userName = user?.fullName || user?.email || 'User';

    // Placeholder data for stats and recommendations
    const stats = {
        applications: 5,
        saved: 3
    };
    const recommendations = [
        { title: 'Frontend Developer Intern', company: 'Vercel' },
        { title: 'UX/UI Design Intern', company: 'Figma' },
        { title: 'Data Science Intern', company: 'Google' },
        { title: 'Product Management Intern', company: 'Linear' }
    ];

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 4 }}>
            <Container maxWidth="xl">
                {/* === HEADER === */}
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1A2027', mb: 1 }}>
                    Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 4 }}>
                    Welcome back, {userName}! Ready to find your next opportunity?
                </Typography>

                {/* === MAIN DASHBOARD GRID === */}
                <Grid container spacing={4}>

                    {/* --- LEFT COLUMN: PROFILE SUMMARY --- */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                borderRadius: '16px',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mb: 2,
                                    fontSize: '3rem',
                                    backgroundColor: 'primary.main',
                                    color: '#fff'
                                }}
                            >
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Student
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/student/profile"
                                variant="outlined"
                                fullWidth
                            >
                                Edit Profile
                            </Button>
                        </Paper>
                    </Grid>

                    {/* --- CENTER COLUMN: MAIN ACTIONS & STATS --- */}
                    <Grid item xs={12} md={8} lg={6}>
                        <Stack spacing={4}>
                             <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    border: '1px solid #e0e0e0'
                                }}
                            >
                                <CardContent sx={{ p: {xs: 3, sm: 4} }}>
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Kickstart Your Career
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: '500px' }}>
                                        Thousands of internships are waiting. Browse and apply to the best opportunities from top companies.
                                    </Typography>
                                    <Button
                                        component={RouterLink}
                                        to="/internships"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            backgroundColor: '#fff',
                                            color: '#764ba2',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                            }
                                        }}
                                    >
                                        Browse All Internships
                                    </Button>
                                </CardContent>
                            </Card>
                             <Grid container spacing={{ xs: 2, sm: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Paper component={RouterLink} to="/my-applications" elevation={0} sx={{ p: 3, borderRadius: '16px', textDecoration: 'none', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <ArticleOutlinedIcon color="primary" sx={{ fontSize: 32 }}/>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A2027' }}>{stats.applications}</Typography>
                                            <Typography variant="body2" color="text.secondary">Active Applications</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                     <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <BookmarkBorderOutlinedIcon color="secondary" sx={{ fontSize: 32 }}/>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A2027' }}>{stats.saved}</Typography>
                                            <Typography variant="body2" color="text.secondary">Saved Internships</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>

                    {/* --- RIGHT COLUMN: RECOMMENDED FOR YOU --- */}
                    <Grid item xs={12} lg={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: '100%',
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                <TrendingUpIcon color="action" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A2027' }}>
                                    Recommended for You
                                </Typography>
                            </Box>
                             <Stack spacing={3} sx={{ flexGrow: 1 }}>
                                {recommendations.map(job => (
                                    <Link component={RouterLink} to="/internships" key={job.title} underline="none" color="inherit">
                                        <Typography sx={{ fontWeight: 'bold' }}>{job.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                                    </Link>
                                ))}
                            </Stack>
                            <Button component={RouterLink} to="/internships" variant="text" sx={{ mt: 2, alignSelf: 'flex-start' }}>
                                See More
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default StudentDashboard;