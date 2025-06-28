import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '../../hooks/useAuth';
import {
  Avatar, Box, Button, Container, Paper, Typography, Grid, TextField,
  CircularProgress, Divider, Chip, Stack, Link, Alert, IconButton, Tooltip,
  InputAdornment, createTheme, ThemeProvider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';

const profileTheme = createTheme({
  palette: {
    primary: {
      main: '#e91e63',
    },
    secondary: {
      main: '#fce4ec',
    },
    background: {
      default: '#fdf6f8',
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
});

const InfoSection = ({ title, children }) => (
  <Box>
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 'bold' }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const StudentProfilePage = () => {
    // ... rest of the component code remains the same ...
    const { user, setUser } = useAuth();
    
    const [profileData, setProfileData] = useState({
        fullName: '', bio: '', education: '', skills: '',
        resumeUrl: '', website: '', linkedin: '', github: '',
    });
    const [initialProfileData, setInitialProfileData] = useState({});
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    
    const db = getFirestore();
    const storage = getStorage();

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            setLoading(true);
            const docRef = doc(db, 'students', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const fetchedData = {
                    fullName: data.fullName || '',
                    bio: data.bio || 'I am a passionate student ready to learn and contribute.',
                    education: data.education || '',
                    skills: data.skills || '',
                    resumeUrl: data.resumeUrl || '',
                    website: data.website || '',
                    linkedin: data.linkedin || '',
                    github: data.github || '',
                };
                setProfileData(fetchedData);
                setInitialProfileData(fetchedData);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user, db]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setResumeFile(file);
            setError('');
        } else {
            setResumeFile(null);
            setError("Please select a PDF file.");
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return;
        setUploading(true);
        setError('');
        const storageRef = ref(storage, `resumes/${user.uid}/${resumeFile.name.replace(/\s/g, '_')}`);
        try {
            await uploadBytes(storageRef, resumeFile);
            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, 'students', user.uid), { resumeUrl: downloadURL });
            const updatedProfile = { ...profileData, resumeUrl: downloadURL };
            setProfileData(updatedProfile);
            setInitialProfileData(updatedProfile);
            setResumeFile(null);
        } catch (error) {
            setError("Failed to upload resume.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'students', user.uid), profileData);
            if (setUser) setUser(prevUser => ({...prevUser, ...profileData}));
            setEditing(false);
            setInitialProfileData(profileData);
        } catch (error) {
            setError("Failed to update profile.");
        }
    };

    const handleCancelEdit = () => {
        setProfileData(initialProfileData);
        setEditing(false);
    };
    
    const renderSkillsChips = () => {
        if (!profileData.skills) return <Typography color="text.secondary" fontStyle="italic">No skills provided.</Typography>;
        return profileData.skills.split(',').map(skill => skill.trim()).filter(Boolean).map((skill, index) => <Chip key={index} label={skill} sx={{ backgroundColor: '#fce4ec', color: '#e91e63', fontWeight: 500 }} />);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

    return (
        <ThemeProvider theme={profileTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', py: {xs: 3, sm: 5} }}>
                <Container maxWidth="md">
                    <Paper elevation={5} sx={{ borderRadius: '24px', overflow: 'hidden' }}>
                        <Box sx={{ p: {xs: 2, sm: 4}, background: 'linear-gradient(to right, #fce4ec, #f8bbd0)' }}>
                            <Grid container spacing={{xs: 2, sm: 3}} alignItems="center">
                                <Grid item>
                                    <Avatar sx={{ width: {xs: 80, sm: 120}, height: {xs: 80, sm: 120}, bgcolor: 'primary.main', fontSize: '3rem' }}>
                                        {profileData.fullName.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: "'Poppins', sans-serif" }}>HELLO</Typography>
                                    <Typography variant="h5" color="primary.dark">{profileData.fullName}</Typography>
                                </Grid>
                                <Grid item>
                                    {editing ? (
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Cancel"><IconButton onClick={handleCancelEdit}><CancelIcon /></IconButton></Tooltip>
                                            <Tooltip title="Save"><IconButton type="submit" color="primary" form="profile-form"><SaveIcon /></IconButton></Tooltip>
                                        </Stack>
                                    ) : (
                                        <Tooltip title="Edit Profile"><IconButton onClick={() => setEditing(true)}><EditIcon /></IconButton></Tooltip>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                        <Box component="form" id="profile-form" onSubmit={handleSave} sx={{ p: {xs: 2, sm: 4} }}>
                             <Grid container spacing={{xs: 4, sm: 5}}>
                                <Grid item xs={12} md={5}>
                                    <Stack spacing={3} divider={<Divider flexItem />}>
                                        <InfoSection title="Contact">
                                            <Typography variant="body2">{user?.email}</Typography>
                                        </InfoSection>
                                        <InfoSection title="Resume">
                                            {profileData.resumeUrl && <Button size="small" variant="text" component={Link} href={profileData.resumeUrl} target="_blank">View Resume</Button>}
                                            <Button component="label" size="small" startIcon={<UploadFileIcon />} sx={{ mt: 0.5, textTransform: 'none' }}>
                                                {resumeFile ? "1 File Selected" : "Upload"}
                                                <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
                                            </Button>
                                            {resumeFile && <Button size="small" onClick={handleResumeUpload} disabled={uploading} sx={{ml: 1}}>{uploading ? <CircularProgress size={20}/> : 'Save'}</Button>}
                                        </InfoSection>
                                        <InfoSection title="Online Presence">
                                             <Stack direction="row" spacing={1}>
                                                {editing ? <TextField fullWidth variant="standard" size="small" label="LinkedIn" name="linkedin" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} InputProps={{startAdornment: <InputAdornment position="start"><LinkedInIcon/></InputAdornment>}}/> : profileData.linkedin && <IconButton component={Link} href={profileData.linkedin} target="_blank"><LinkedInIcon /></IconButton>}
                                                {editing ? <TextField fullWidth variant="standard" size="small" label="GitHub" name="github" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} InputProps={{startAdornment: <InputAdornment position="start"><GitHubIcon/></InputAdornment>}}/> : profileData.github && <IconButton component={Link} href={profileData.github} target="_blank"><GitHubIcon /></IconButton>}
                                                {editing ? <TextField fullWidth variant="standard" size="small" label="Website" name="website" value={profileData.website} onChange={e => setProfileData({...profileData, website: e.target.value})} InputProps={{startAdornment: <InputAdornment position="start"><LanguageIcon/></InputAdornment>}}/> : profileData.website && <IconButton component={Link} href={profileData.website} target="_blank"><LanguageIcon /></IconButton>}
                                             </Stack>
                                        </InfoSection>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Stack spacing={3}>
                                        <InfoSection title="About Me">
                                            {editing ? <TextField multiline rows={4} fullWidth variant="outlined" name="bio" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} /> : <Typography sx={{whiteSpace: 'pre-wrap', fontStyle: profileData.bio ? 'normal' : 'italic', color: profileData.bio ? 'inherit' : 'text.secondary'}}>{profileData.bio}</Typography>}
                                        </InfoSection>
                                         <InfoSection title="Education">
                                            {editing ? <TextField fullWidth variant="outlined" name="education" value={profileData.education} onChange={e => setProfileData({...profileData, education: e.target.value})} /> : <Typography>{profileData.education || 'Not provided'}</Typography>}
                                        </InfoSection>
                                        <InfoSection title="Skills">
                                            {editing ? <TextField fullWidth variant="outlined" helperText="Separate skills with a comma" name="skills" value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} /> : <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{renderSkillsChips()}</Box>}
                                        </InfoSection>
                                    </Stack>
                                </Grid>
                             </Grid>
                             {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default StudentProfilePage;