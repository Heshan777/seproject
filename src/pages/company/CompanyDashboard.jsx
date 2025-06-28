import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const CompanyDashboard = () => {
    const { user } = useAuth();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        const q = query(collection(db, "internships"), where("companyId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInternships(jobs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching internships:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, db]);

    const renderVerificationStatus = () => {
        switch (user?.verificationStatus) {
            case 'approved':
                return (
                    <Button
                        component={RouterLink}
                        to="/company/post-internship"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ textTransform: 'none', fontSize: '1rem', py: 1, px: 3 }}
                    >
                        Post New Internship
                    </Button>
                );
            case 'pending':
                return <Alert severity="warning" variant="outlined">Your profile is pending admin approval. You cannot post jobs yet.</Alert>;
            case 'rejected':
                return <Alert severity="error" variant="outlined">Your profile was rejected by the admin. Please contact support for assistance.</Alert>;
            default:
                return <Alert severity="info" variant="outlined">Your account is being set up. You will be able to post jobs once approved.</Alert>;
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" width="40%" height={60} />
                <Skeleton variant="text" width="60%" height={30} sx={{mb: 4}} />
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}><Skeleton variant="rectangular" height={120} sx={{borderRadius: '16px'}} /></Grid>
                    <Grid item xs={12} sm={6} md={4}><Skeleton variant="rectangular" height={120} sx={{borderRadius: '16px'}} /></Grid>
                    <Grid item xs={12} sm={6} md={4}><Skeleton variant="rectangular" height={120} sx={{borderRadius: '16px'}} /></Grid>
                </Grid>
            </Box>
        );
    }
    
    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="xl">
                {/* --- HEADER --- */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1A2027' }}>
                            Welcome, {user?.companyName || user?.email}!
                        </Typography>
                        <Typography color="text.secondary">
                            Here's what's happening with your internships today.
                        </Typography>
                    </Box>
                    {renderVerificationStatus()}
                </Stack>

                {/* --- QUICK STATS --- */}
                <Grid container spacing={4} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={3} sx={{ borderRadius: '16px', p: 1 }}>
                            <CardContent>
                                <BusinessCenterOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{internships.length}</Typography>
                                <Typography color="text.secondary">Total Posted Internships</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={3} sx={{ borderRadius: '16px', p: 1 }}>
                            <CardContent>
                                <PeopleAltOutlinedIcon color="secondary" sx={{ fontSize: 40, mb: 1 }}/>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>0</Typography>
                                <Typography color="text.secondary">Total Applicants</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={3} sx={{ borderRadius: '16px', p: 1 }}>
                            <CardContent>
                                <MarkEmailReadOutlinedIcon color="success" sx={{ fontSize: 40, mb: 1 }}/>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>0</Typography>
                                <Typography color="text.secondary">New Applicants (This Week)</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* --- POSTED INTERNSHIPS LIST --- */}
                <Paper elevation={3} sx={{ p: {xs: 2, sm: 3}, borderRadius: '16px' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Your Posted Internships</Typography>
                    {internships.length > 0 ? (
                        <Stack spacing={2} divider={<Divider />}>
                            {internships.map((job) => (
                                <Box key={job.id} sx={{ p: 2, display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{job.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Posted on: {job.postedAt?.toDate().toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={RouterLink}
                                        to={`/company/internship/${job.id}/applicants`}
                                        variant="outlined"
                                        size="small"
                                    >
                                        View Applicants
                                    </Button>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                             <Typography variant="h6">You haven't posted any internships yet.</Typography>
                             {user?.verificationStatus === 'approved' &&
                                <Button component={RouterLink} to="/company/post-internship" variant="contained" sx={{ mt: 2 }}>
                                    Post Your First Internship
                                </Button>
                             }
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default CompanyDashboard;