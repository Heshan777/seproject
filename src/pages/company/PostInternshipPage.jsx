import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const PostInternshipPage = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Technology');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("You must be logged in to post an internship.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'internships'), {
                title,
                category,
                description,
                companyId: user.uid,
                companyName: user.companyName,
                postedAt: serverTimestamp(),
            });
            navigate('/company/dashboard');
        } catch (err) {
            console.error("Error posting internship:", err);
            setError("Failed to post internship. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
            <Container maxWidth="md">
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    elevation={4}
                    sx={{ p: { xs: 2, sm: 4 }, borderRadius: '16px' }}
                >
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Post a New Internship
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Fill out the details below to find your next great hire.
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Stack spacing={4}>
                        <TextField
                            fullWidth
                            label="Internship Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="Technology">Technology</MenuItem>
                                <MenuItem value="Marketing">Marketing</MenuItem>
                                <MenuItem value="Design">Design</MenuItem>
                                <MenuItem value="Business">Business</MenuItem>
                                <MenuItem value="Engineering">Engineering</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Internship Description"
                            multiline
                            rows={10}
                            variant="outlined"
                            placeholder="Describe the role, responsibilities, and requirements."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <Box sx={{ position: 'relative', alignSelf: 'flex-start' }}>
                             <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ py: 1.5, px: 5, textTransform: 'none', fontSize: '1rem' }}
                            >
                                Post Internship
                            </Button>
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default PostInternshipPage;