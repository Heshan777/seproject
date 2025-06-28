import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
    Box, Container, Typography, Grid, Card, CardContent, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Stack, Skeleton, Tabs, Tab, IconButton, Tooltip,
    Chip // CORRECTED: Added the missing Chip component to the import list
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const AdminDashboard = () => {
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [allCompanies, setAllCompanies] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);
    const db = getFirestore();

    useEffect(() => {
        setLoading(true);

        const queries = [
            query(collection(db, "companies"), where("verificationStatus", "==", "pending")),
            collection(db, "companies"),
            collection(db, "students")
        ];

        const unsubscribes = queries.map((q, index) => 
            onSnapshot(q, (querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (index === 0) setPendingCompanies(data);
                if (index === 1) setAllCompanies(data);
                if (index === 2) setAllStudents(data);
            }, (error) => console.error(`Error fetching collection ${index}:`, error))
        );

        setTimeout(() => setLoading(false), 500);

        return () => unsubscribes.forEach(unsub => unsub());
    }, [db]);

    const handleVerification = async (companyId, newStatus) => {
        const companyRef = doc(db, 'companies', companyId);
        try {
            await updateDoc(companyRef, { verificationStatus: newStatus });
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    const handleDelete = async (userId, userType) => {
        if (window.confirm(`Are you sure you want to permanently delete this ${userType}? This action cannot be undone.`)) {
            try {
                await deleteDoc(doc(db, userType, userId));
            } catch (error) {
                console.error(`Error deleting ${userType}:`, error);
                alert(`Failed to delete ${userType}.`);
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="xl">
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1A2027' }}>Admin Dashboard</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>Manage platform approvals and view key metrics.</Typography>

                <Grid container spacing={4} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={4}><StatCard icon={<HourglassTopOutlinedIcon color="warning" />} title="Pending Approvals" value={pendingCompanies.length} loading={loading} /></Grid>
                    <Grid item xs={12} sm={4}><StatCard icon={<BusinessOutlinedIcon color="primary" />} title="Total Companies" value={allCompanies.length} loading={loading} /></Grid>
                    <Grid item xs={12} sm={4}><StatCard icon={<SchoolOutlinedIcon color="secondary" />} title="Total Students" value={allStudents.length} loading={loading} /></Grid>
                </Grid>

                <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin management tabs">
                            <Tab label={`Pending Approvals (${pendingCompanies.length})`} />
                            <Tab label={`All Companies (${allCompanies.length})`} />
                            <Tab label={`All Students (${allStudents.length})`} />
                        </Tabs>
                    </Box>
                    
                    <TabPanel value={currentTab} index={0}>
                        <UserTable
                            users={pendingCompanies}
                            loading={loading}
                            headers={['Company Name', 'Email', 'Actions']}
                            renderRow={(users) => users.map((company) => (
                                <TableRow key={company.id} hover>
                                    <TableCell><Typography sx={{ fontWeight: 'bold' }}>{company.companyName}</Typography></TableCell>
                                    <TableCell><Typography color="text.secondary">{company.email}</Typography></TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Button variant="contained" color="error" size="small" onClick={() => handleVerification(company.id, 'rejected')} startIcon={<CancelOutlinedIcon />}>Reject</Button>
                                            <Button variant="contained" color="success" size="small" onClick={() => handleVerification(company.id, 'approved')} startIcon={<CheckCircleOutlineIcon />}>Approve</Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        />
                    </TabPanel>
                    
                    <TabPanel value={currentTab} index={1}>
                        <UserTable
                            users={allCompanies}
                            loading={loading}
                            headers={['Company Name', 'Email', 'Status', 'Actions']}
                            renderRow={(users) => users.map((company) => (
                                <TableRow key={company.id} hover>
                                    <TableCell><Typography sx={{ fontWeight: 'bold' }}>{company.companyName}</Typography></TableCell>
                                    <TableCell><Typography color="text.secondary">{company.email}</Typography></TableCell>
                                    <TableCell><Chip label={company.verificationStatus || 'N/A'} size="small" color={company.verificationStatus === 'approved' ? 'success' : company.verificationStatus === 'pending' ? 'warning' : 'error'} /></TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete Company"><IconButton size="small" color="error" onClick={() => handleDelete(company.id, 'companies')}><DeleteForeverIcon /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        />
                    </TabPanel>
                    
                    <TabPanel value={currentTab} index={2}>
                        <UserTable
                            users={allStudents}
                            loading={loading}
                            headers={['Student Name', 'Email', 'Actions']}
                            renderRow={(users) => users.map((student) => (
                                <TableRow key={student.id} hover>
                                    <TableCell><Typography sx={{ fontWeight: 'bold' }}>{student.fullName}</Typography></TableCell>
                                    <TableCell><Typography color="text.secondary">{student.email}</Typography></TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete Student"><IconButton size="small" color="error" onClick={() => handleDelete(student.id, 'students')}><DeleteForeverIcon /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        />
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};

// Helper components for a cleaner structure
const StatCard = ({ icon, title, value, loading }) => (
    <Card elevation={3} sx={{ borderRadius: '16px', p: 1, textAlign: 'center' }}>
        <CardContent>
            {React.cloneElement(icon, { sx: { fontSize: 40, mb: 1 } })}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {loading ? <Skeleton width="40%" sx={{mx: 'auto'}}/> : value}
            </Typography>
            <Typography color="text.secondary">{title}</Typography>
        </CardContent>
    </Card>
);

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

const UserTable = ({ users, loading, headers, renderRow }) => (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    {headers.map((header) => <TableCell key={header} align={header === 'Actions' ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>{header}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    Array.from(new Array(3)).map((_, index) => <TableRow key={index}>{headers.map(h => <TableCell key={h}><Skeleton /></TableCell>)}</TableRow>)
                ) : users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={headers.length} align="center" sx={{ py: 5 }}>
                            <Typography color="text.secondary">No data to display in this section.</Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    renderRow(users)
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

export default AdminDashboard;