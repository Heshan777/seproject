import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Grid,
  Button,
  CircularProgress
  // Link was removed from here
} from '@mui/material';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import SearchIcon from '@mui/icons-material/Search';

const MyApplicationsPage = () => {
    // ... rest of the component code remains the same ...
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const { user } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "applications"), 
            where("studentId", "==", user.uid),
            orderBy("appliedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            setLoading(true);
            const appsPromises = querySnapshot.docs.map(async (appDoc) => {
                const appData = appDoc.data();
                const internshipRef = doc(db, "internships", appData.internshipId);
                const internshipSnap = await getDoc(internshipRef);
                const internshipData = internshipSnap.exists() ? internshipSnap.data() : {};

                return {
                    id: appDoc.id,
                    ...appData,
                    internshipTitle: internshipData.title || appData.internshipTitle,
                    companyName: internshipData.companyName,
                };
            });
            const populatedApps = await Promise.all(appsPromises);
            setApplications(populatedApps);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, db]);

    const getStatusChipColor = (status) => {
        switch (status?.toLowerCase().replace(' ', '_')) {
            case 'selected': return 'success';
            case 'rejected': return 'error';
            case 'under_review': return 'warning';
            default: return 'primary';
        }
    };

    const filteredApplications = applications.filter(app => 
        statusFilter === 'All' || app.status === statusFilter
    );

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1A2027', mb: 1 }}>
                    My Applications
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Track the status of all your internship applications here.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="All" onClick={() => setStatusFilter('All')} variant={statusFilter === 'All' ? 'filled' : 'outlined'} sx={{cursor: 'pointer'}}/>
                    <Chip label="Applied" onClick={() => setStatusFilter('Applied')} color="primary" variant={statusFilter === 'Applied' ? 'filled' : 'outlined'} sx={{cursor: 'pointer'}}/>
                    <Chip label="Under Review" onClick={() => setStatusFilter('Under Review')} color="warning" variant={statusFilter === 'Under Review' ? 'filled' : 'outlined'} sx={{cursor: 'pointer'}}/>
                    <Chip label="Selected" onClick={() => setStatusFilter('Selected')} color="success" variant={statusFilter === 'Selected' ? 'filled' : 'outlined'} sx={{cursor: 'pointer'}}/>
                    <Chip label="Rejected" onClick={() => setStatusFilter('Rejected')} color="error" variant={statusFilter === 'Rejected' ? 'filled' : 'outlined'} sx={{cursor: 'pointer'}}/>
                </Stack>

                {filteredApplications.length > 0 ? (
                    <Stack spacing={2}>
                        {filteredApplications.map(app => (
                            <Paper
                                key={app.id}
                                component={RouterLink}
                                to={`/internship/${app.internshipId}`}
                                elevation={2}
                                sx={{
                                    p: 3,
                                    textDecoration: 'none',
                                    borderRadius: '12px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={6} md={5}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                            {app.internshipTitle || 'Internship (Details Deleted)'}
                                        </Typography>
                                        <Typography color="text.secondary">{app.companyName || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={4}>
                                        <Typography color="text.secondary" variant="body2">
                                            Applied on: {app.appliedAt?.toDate().toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} sx={{ textAlign: { sm: 'right' } }}>
                                        <Chip label={app.status} color={getStatusChipColor(app.status)} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Paper sx={{ textAlign: 'center', p: {xs: 4, sm: 8}, borderRadius: '16px' }}>
                        <WorkHistoryOutlinedIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" sx={{mb: 1}}>No Applications Found</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                           {statusFilter === 'All' 
                             ? "You haven't applied to any internships yet."
                             : `You have no applications with the status: "${statusFilter}"`
                           }
                        </Typography>
                        <Button component={RouterLink} to="/internships" variant="contained" startIcon={<SearchIcon />}>
                            Browse Internships
                        </Button>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default MyApplicationsPage;