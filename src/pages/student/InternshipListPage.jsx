import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import {
  Box, Container, Typography, TextField, InputAdornment, Chip, Grid,
  Paper, Avatar, Stack, Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

const categories = ['All', 'Technology', 'Marketing', 'Design', 'Business', 'Engineering'];

const InternshipListPage = () => {
    // ... rest of the component code remains the same ...
    const [allInternships, setAllInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const db = getFirestore();

    useEffect(() => {
        const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllInternships(jobs);
            setFilteredInternships(jobs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [db]);

    useEffect(() => {
        let results = allInternships;

        if (searchTerm) {
            results = results.filter(job => 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            results = results.filter(job => job.category === selectedCategory);
        }

        setFilteredInternships(results);
    }, [searchTerm, selectedCategory, allInternships]);

    const getCategoryChipColor = (category) => {
        switch (category) {
            case 'Technology': return 'primary';
            case 'Marketing': return 'secondary';
            case 'Design': return 'success';
            case 'Business': return 'info';
            case 'Engineering': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: {xs: 2, sm: 3}, mb: 5, borderRadius: '16px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Explore Opportunities</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>Find the perfect internship to kickstart your career.</Typography>
                    
                    <TextField
                        fullWidth
                        label="Search by title or company..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                        }}
                        sx={{ mb: 2 }}
                    />
                    
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {categories.map(category => (
                             <Chip
                                key={category}
                                label={category}
                                onClick={() => setSelectedCategory(category)}
                                color={getCategoryChipColor(category)}
                                variant={selectedCategory === category ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer', color: selectedCategory !== category ? getCategoryChipColor(category) + '.main' : undefined }}
                            />
                        ))}
                    </Stack>
                </Paper>

                <Grid container spacing={4}>
                    {loading ? (
                        Array.from(new Array(6)).map((_, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '16px' }} />
                            </Grid>
                        ))
                    ) : filteredInternships.length > 0 ? (
                        filteredInternships.map((job) => (
                            <Grid item xs={12} sm={6} lg={4} key={job.id}>
                                <Paper
                                    component={RouterLink}
                                    to={`/internship/${job.id}`}
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'none',
                                        borderRadius: '16px',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': { transform: 'translateY(-5px)', boxShadow: 8 }
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>{job.companyName.charAt(0)}</Avatar>
                                        <Typography variant="subtitle1" color="text.secondary">{job.companyName}</Typography>
                                    </Stack>
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', flexGrow: 1 }}>
                                        {job.title}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip label={job.category} color={getCategoryChipColor(job.category)} size="small" />
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ textAlign: 'center', p: {xs: 4, sm: 8}, borderRadius: '16px' }}>
                                <BusinessCenterOutlinedIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6">No Internships Found</Typography>
                                <Typography color="text.secondary">Try adjusting your search or category filters.</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default InternshipListPage;