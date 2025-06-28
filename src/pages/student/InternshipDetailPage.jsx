import React, { useState, useEffect } from 'react';
// CORRECTED: Added 'Link as RouterLink' to the import statement
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Stack,
  Avatar,
  Alert,
  Skeleton
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const InternshipDetailPage = () => {
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState(false);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState(null);
    
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const fetchInternshipAndCheckApplication = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "internships", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setInternship({ id: docSnap.id, ...docSnap.data() });
                    if (user && user.role === 'students') {
                        const applicationsQuery = query(collection(db, "applications"), where("internshipId", "==", id), where("studentId", "==", user.uid));
                        const querySnapshot = await getDocs(applicationsQuery);
                        if (!querySnapshot.empty) setApplied(true);
                    }
                } else {
                    console.log("No such document!");
                    setError("Internship not found.");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not load internship details.");
            } finally {
                setLoading(false);
            }
        };
        fetchInternshipAndCheckApplication();
    }, [id, db, user]);

    const handleApply = async () => {
        if (!user) {
            navigate('/student/login');
            return;
        }

        if (!user.fullName || !internship?.companyId) {
            setError("Cannot apply: User or company data is missing. Please complete your profile.");
            return;
        }
        
        setApplying(true);
        setError(null);
        try {
            await addDoc(collection(db, "applications"), {
                internshipId: id,
                internshipTitle: internship.title,
                studentId: user.uid,
                studentName: user.fullName,
                studentEmail: user.email,
                companyId: internship.companyId,
                companyName: internship.companyName,
                status: 'Applied',
                appliedAt: serverTimestamp(),
            });
            setApplied(true);
        } catch (err) {
            console.error("Error submitting application:", err);
            setError("Failed to submit application. Please try again.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Skeleton variant="text" width="40%" height={40} />
                            <Skeleton variant="text" width="80%" height={80} />
                            <Skeleton variant="text" width="60%" height={40} sx={{mb: 3}}/>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Skeleton variant="rectangular" height={250} sx={{borderRadius: '16px'}} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        );
    }

    if (!internship) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)'}}>
                <Paper sx={{p: 4, textAlign: 'center'}}>
                    <Typography variant="h5">Internship Not Found</Typography>
                    <Typography color="text.secondary">This listing may have been removed or is no longer available.</Typography>
                    <Button component={RouterLink} to="/internships" sx={{mt: 2}}>Back to Listings</Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* --- MAIN CONTENT (Left Column) --- */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: {xs: 2, sm: 4}, borderRadius: '16px' }}>
                            <Chip label={internship.category} color="primary" sx={{ mb: 2 }} />
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {internship.title}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 3}}>
                                <BusinessIcon fontSize="small" color="action"/>
                                <Typography variant="h6" color="text.secondary">
                                    at {internship.companyName}
                                </Typography>
                            </Stack>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Job Description
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#374151' }}>
                                {internship.description}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* --- SIDEBAR (Right Column) --- */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: '16px', position: 'sticky', top: '100px' }}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, fontSize: '1.5rem' }}>
                                        {internship.companyName.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {internship.companyName}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <CalendarMonthIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        Posted on: {internship.postedAt?.toDate().toLocaleDateString()}
                                    </Typography>
                                </Stack>
                                <Box sx={{ pt: 2 }}>
                                    {user?.role === 'students' && (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            onClick={handleApply}
                                            disabled={applied || applying}
                                            sx={{py: 1.5, textTransform: 'none', fontSize: '1.1rem'}}
                                        >
                                            {applying ? <CircularProgress size={26} color="inherit" /> : applied ? 'Application Submitted' : 'Apply Now'}
                                        </Button>
                                    )}
                                </Box>
                                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default InternshipDetailPage;