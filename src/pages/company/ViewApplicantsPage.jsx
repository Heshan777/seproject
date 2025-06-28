import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot, getDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
    Box,
    Container,
    Typography,
    Paper,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Chip,
    Button,
    Skeleton // CircularProgress was removed from here
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

const ViewApplicantsPage = () => {
    const [applicants, setApplicants] = useState([]);
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { internshipId } = useParams();
    const { user } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        if (!user || !internshipId) return;

        const fetchInternshipDetails = async () => {
            const docRef = doc(db, 'internships', internshipId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setInternship(docSnap.data());
            }
        };
        fetchInternshipDetails();

        const q = query(
            collection(db, "applications"), 
            where("internshipId", "==", internshipId)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const applicantPromises = querySnapshot.docs.map(async (appDoc) => {
                const appData = appDoc.data();
                const studentRef = doc(db, "students", appData.studentId);
                const studentSnap = await getDoc(studentRef);
                return {
                    id: appDoc.id,
                    ...appData,
                    resumeUrl: studentSnap.exists() ? studentSnap.data().resumeUrl : null
                };
            });
            const applicantList = await Promise.all(applicantPromises);
            setApplicants(applicantList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [internshipId, db, user]);

    const handleStatusChange = async (applicationId, newStatus) => {
        const appDocRef = doc(db, 'applications', applicationId);
        try {
            await updateDoc(appDocRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const getStatusChipColor = (status) => {
        switch (status?.toLowerCase().replace(' ', '_')) {
            case 'selected': return 'success';
            case 'rejected': return 'error';
            case 'under_review': return 'warning';
            default: return 'primary';
        }
    };

    const renderTableContent = () => {
        if (loading) {
            return Array.from(new Array(3)).map((_, index) => (
                <TableRow key={index}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                </TableRow>
            ));
        }

        return applicants.map((app) => (
            <TableRow key={app.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                    <Typography sx={{ fontWeight: 'bold' }}>{app.studentName}</Typography>
                </TableCell>
                <TableCell>{app.studentEmail}</TableCell>
                <TableCell>
                    {app.resumeUrl ? (
                        <Button component={Link} href={app.resumeUrl} target="_blank" rel="noopener noreferrer" size="small">
                            View Resume
                        </Button>
                    ) : (
                        <Typography variant="body2" color="text.secondary">Not Provided</Typography>
                    )}
                </TableCell>
                <TableCell>
                    <Chip label={app.status} color={getStatusChipColor(app.status)} size="small" />
                </TableCell>
                <TableCell>
                    <Select
                        value={app.status || ''}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        size="small"
                        sx={{ minWidth: 140 }}
                    >
                        <MenuItem value="Applied">Applied</MenuItem>
                        <MenuItem value="Under Review">Under Review</MenuItem>
                        <MenuItem value="Selected">Selected</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="lg">
                <Button component={RouterLink} to="/company/dashboard" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
                    Back to Dashboard
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Applicants
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    For: {internship?.title || 'Loading Internship...'}
                </Typography>

                {applicants.length > 0 || loading ? (
                    <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ backgroundColor: 'grey.100' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Resume</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Update Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renderTableContent()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                ) : (
                    <Paper sx={{ textAlign: 'center', p: { xs: 4, sm: 8 }, borderRadius: '16px' }}>
                        <PersonSearchOutlinedIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6">No Applicants Yet</Typography>
                        <Typography color="text.secondary">Check back later to see who has applied to this role.</Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default ViewApplicantsPage;