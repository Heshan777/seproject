// src/pages/student/StudentProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#e0e7ff' },
    background: { default: '#f8fafc' },
    text: { primary: '#0f172a', secondary: '#475569' }
  },
  typography: {
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
    h4: { fontWeight: 800, letterSpacing: '-.01em' },
    overline: { letterSpacing: '.12em', fontWeight: 700 }
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 10 } } },
    MuiTextField: { defaultProps: { size: 'small' } }
  }
});

/* ---------- small helpers ---------- */

// read a File object as data URL
const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// compress image in a canvas so Firestore stays under ~1MB per doc
async function compressImageToDataURL(file, { maxWidth = 1400, maxHeight = 1400, quality = 0.82 } = {}) {
  const dataUrl = await fileToDataURL(file);

  // create image
  const img = new Image();
  img.src = dataUrl;
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

  // compute new size
  let { width, height } = img;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  // draw
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  // prefer JPEG for smaller size
  const mime = 'image/jpeg';
  const out = canvas.toDataURL(mime, quality);

  // simple guard: if the output is still too large, reduce quality once more
  if (out.length > 900_000) {
    return canvas.toDataURL(mime, 0.74);
  }
  return out;
}

const InfoSection = ({ title, children }) => (
  <Box>
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.25 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const StudentProfilePage = () => {
  const { user, setUser } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: 'I am a passionate student ready to learn and contribute.',
    education: '',
    skills: '',
    // NEW: store resume as base64 image in Firestore
    resumeImageData: '',

    // social + avatar
    website: '',
    linkedin: '',
    github: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    photoUrl: '',
    // optional fallback if Storage isn’t configured:
    photoData: '' // base64 avatar
  });
  const [initialProfileData, setInitialProfileData] = useState({});

  const [resumeImageFile, setResumeImageFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const photoInputRef = useRef(null);

  const db = getFirestore();
  let storage = null;
  try { storage = getStorage(); } catch { /* storage not configured */ }

  // load profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, 'students', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        const merged = {
          fullName: d.fullName || '',
          bio: d.bio || profileData.bio,
          education: d.education || '',
          skills: d.skills || '',
          resumeImageData: d.resumeImageData || '',
          website: d.website || '',
          linkedin: d.linkedin || '',
          github: d.github || '',
          facebook: d.facebook || '',
          twitter: d.twitter || '',
          instagram: d.instagram || '',
          youtube: d.youtube || '',
          photoUrl: d.photoUrl || '',
          photoData: d.photoData || ''
        };
        setProfileData(merged);
        setInitialProfileData(merged);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ---------------- Resume image (base64 in Firestore) ---------------- */

  const handleResumeSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(png|jpe?g)$/i.test(f.type)) {
      setError('Please select a PNG or JPG image for your resume.');
      setResumeImageFile(null);
      return;
    }
    setError('');
    setResumeImageFile(f);
  };

  const handleResumeUpload = async () => {
    if (!resumeImageFile || !user) return;
    setUploadingResume(true);
    try {
      const dataUrl = await compressImageToDataURL(resumeImageFile, {
        maxWidth: 1600,
        maxHeight: 2000,
        quality: 0.82
      });

      await updateDoc(doc(db, 'students', user.uid), { resumeImageData: dataUrl });
      const updated = { ...profileData, resumeImageData: dataUrl };
      setProfileData(updated);
      setInitialProfileData(updated);
      setResumeImageFile(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save resume image.');
    } finally {
      setUploadingResume(false);
    }
  };

  /* ---------------- Avatar upload (Storage with graceful base64 fallback) ---------------- */

  const handlePhotoPick = () => photoInputRef.current?.click();

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG/PNG).');
      return;
    }
    setError('');
    setUploadingPhoto(true);
    try {
      let newFields = {};
      if (storage) {
        // try Storage first
        try {
          const ext = file.name.split('.').pop() || 'jpg';
          const avRef = ref(storage, `avatars/${user.uid}/profile.${ext}`);
          await uploadBytes(avRef, file);
          const url = await getDownloadURL(avRef);
          newFields = { photoUrl: url, photoData: '' };
        } catch (err) {
          // fallback to base64 into Firestore
          const b64 = await compressImageToDataURL(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
          newFields = { photoUrl: '', photoData: b64 };
        }
      } else {
        // no storage configured -> base64
        const b64 = await compressImageToDataURL(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
        newFields = { photoUrl: '', photoData: b64 };
      }

      await updateDoc(doc(db, 'students', user.uid), newFields);
      const updated = { ...profileData, ...newFields };
      setProfileData(updated);
      setInitialProfileData(updated);
    } catch (err) {
      console.error(err);
      setError('Failed to upload profile photo.');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  /* ---------------- Save/cancel ---------------- */

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateDoc(doc(db, 'students', user.uid), profileData);
      if (setUser) setUser((prev) => ({ ...prev, ...profileData }));
      setEditing(false);
      setInitialProfileData(profileData);
      setError('');
    } catch {
      setError('Failed to update profile.');
    }
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData);
    setEditing(false);
    setError('');
  };

  /* ---------------- helpers ---------------- */

  const renderSkillsChips = () => {
    const arr = (profileData.skills || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!arr.length)
      return <Typography color="text.secondary" fontStyle="italic">No skills provided.</Typography>;
    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {arr.map((skill, i) => (
          <Chip key={`${skill}-${i}`} label={skill} sx={{ bgcolor: '#e0e7ff', color: '#1e3a8a', fontWeight: 600 }} />
        ))}
      </Stack>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  const initials = (profileData.fullName || user?.fullName || user?.email || 'U')[0]?.toUpperCase();
  const avatarSrc = profileData.photoUrl || profileData.photoData || undefined;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', py: { xs: 3, sm: 6 } }}>
        <Container maxWidth="md">
          {/* Rectangular card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              overflow: 'visible',
              bgcolor: 'white',
              border: '1px solid rgba(2,6,23,.08)',
              boxShadow: '0 10px 30px rgba(2,6,23,.08)'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: { xs: 2, sm: 4 },
                py: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg,#dbeafe 0%, #bfdbfe 45%, #e0e7ff 100%)'
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={avatarSrc}
                      alt={profileData.fullName || 'Profile'}
                      sx={{
                        width: { xs: 92, sm: 110 },
                        height: { xs: 92, sm: 110 },
                        bgcolor: 'primary.main',
                        fontSize: 40,
                        fontWeight: 800,
                        boxShadow: '0 8px 24px rgba(37,99,235,.25)',
                        border: '3px solid #fff'
                      }}
                    >
                      {!avatarSrc && initials}
                    </Avatar>

                    <Tooltip title="Change photo">
                      <IconButton
                        size="small"
                        onClick={handlePhotoPick}
                        sx={{
                          position: 'absolute',
                          right: -6,
                          bottom: -6,
                          bgcolor: 'rgba(15,23,42,.85)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(15,23,42,.95)' },
                          boxShadow: '0 6px 14px rgba(2,6,23,.25)'
                        }}
                      >
                        {uploadingPhoto ? <CircularProgress size={16} color="inherit" /> : <PhotoCameraRoundedIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <input ref={photoInputRef} type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                  </Box>
                </Grid>

                <Grid item xs>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>Hello</Typography>
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>
                    {profileData.fullName || 'Your name'}
                  </Typography>
                </Grid>

                <Grid item>
                  {editing ? (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Cancel">
                        <IconButton onClick={handleCancelEdit}><CancelIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Save">
                        <IconButton type="submit" color="primary" form="profile-form">
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Tooltip title="Edit Profile">
                      <IconButton onClick={() => setEditing(true)}><EditIcon /></IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Box>

            {/* Body */}
            <Box component="form" id="profile-form" onSubmit={handleSave} sx={{ p: { xs: 2, sm: 4 } }}>
              <Grid container spacing={{ xs: 3, sm: 5 }}>
                {/* Left column */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={3} divider={<Divider flexItem />}>
                    <InfoSection title="Contact">
                      <Typography variant="body2">{user?.email}</Typography>
                    </InfoSection>

                    {/* Resume as IMAGE (base64 in Firestore) */}
                    <InfoSection title="Resume (image)">
                      <Stack spacing={1.25}>
                        {profileData.resumeImageData ? (
                          <>
                            <Box
                              sx={{
                                border: '1px solid rgba(2,6,23,0.08)',
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                bgcolor: '#f8fafc'
                              }}
                            >
                              <img
                                src={profileData.resumeImageData}
                                alt="Resume"
                                style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 380, objectFit: 'contain' }}
                              />
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                endIcon={<OpenInNewRoundedIcon />}
                                onClick={() => window.open(profileData.resumeImageData, '_blank')}
                              >
                                View full
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={async () => {
                                  await updateDoc(doc(db, 'students', user.uid), { resumeImageData: '' });
                                  const updated = { ...profileData, resumeImageData: '' };
                                  setProfileData(updated);
                                  setInitialProfileData(updated);
                                }}
                              >
                                Remove
                              </Button>
                            </Stack>
                          </>
                        ) : (
                          <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
                            No resume image uploaded.
                          </Typography>
                        )}

                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                          <Button
                            component="label"
                            size="small"
                            startIcon={<UploadFileIcon />}
                            variant="contained"
                            color="primary"
                          >
                            {resumeImageFile ? '1 image selected' : 'Upload PNG/JPG'}
                            <input type="file" hidden accept="image/png, image/jpeg" onChange={handleResumeSelect} />
                          </Button>
                          {resumeImageFile && (
                            <Button size="small" onClick={handleResumeUpload} disabled={uploadingResume} variant="text">
                              {uploadingResume ? <CircularProgress size={18} /> : 'Save'}
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </InfoSection>

                    <InfoSection title="Online Presence">
                      {editing ? (
                        <Stack spacing={1.25}>
                          {[
                            { key: 'website', label: 'Website', icon: <LanguageIcon /> },
                            { key: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon /> },
                            { key: 'github', label: 'GitHub', icon: <GitHubIcon /> },
                            { key: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
                            { key: 'twitter', label: 'Twitter', icon: <TwitterIcon /> },
                            { key: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
                            { key: 'youtube', label: 'YouTube', icon: <YouTubeIcon /> }
                          ].map(({ key, label, icon }) => (
                            <TextField
                              key={key}
                              fullWidth
                              variant="outlined"
                              label={label}
                              value={profileData[key]}
                              onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                              InputProps={{ startAdornment: <InputAdornment position="start">{icon}</InputAdornment> }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                          {profileData.website && <IconButton component={Link} href={profileData.website} target="_blank"><LanguageIcon /></IconButton>}
                          {profileData.linkedin && <IconButton component={Link} href={profileData.linkedin} target="_blank"><LinkedInIcon /></IconButton>}
                          {profileData.github && <IconButton component={Link} href={profileData.github} target="_blank"><GitHubIcon /></IconButton>}
                          {profileData.facebook && <IconButton component={Link} href={profileData.facebook} target="_blank"><FacebookIcon /></IconButton>}
                          {profileData.twitter && <IconButton component={Link} href={profileData.twitter} target="_blank"><TwitterIcon /></IconButton>}
                          {profileData.instagram && <IconButton component={Link} href={profileData.instagram} target="_blank"><InstagramIcon /></IconButton>}
                          {profileData.youtube && <IconButton component={Link} href={profileData.youtube} target="_blank"><YouTubeIcon /></IconButton>}
                          {!profileData.website && !profileData.linkedin && !profileData.github && !profileData.facebook &&
                           !profileData.twitter && !profileData.instagram && !profileData.youtube && (
                            <Typography color="text.secondary" fontStyle="italic">Add your links to stand out.</Typography>
                          )}
                        </Stack>
                      )}
                    </InfoSection>
                  </Stack>
                </Grid>

                {/* Right column */}
                <Grid item xs={12} md={7}>
                  <Stack spacing={3}>
                    <InfoSection title="About Me">
                      {editing ? (
                        <TextField
                          multiline rows={4} fullWidth variant="outlined"
                          name="bio" value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        />
                      ) : (
                        <Typography sx={{ whiteSpace: 'pre-wrap', color: profileData.bio ? 'inherit' : 'text.secondary', fontStyle: profileData.bio ? 'normal' : 'italic' }}>
                          {profileData.bio}
                        </Typography>
                      )}
                    </InfoSection>

                    <InfoSection title="Education">
                      {editing ? (
                        <TextField
                          fullWidth variant="outlined" name="education"
                          value={profileData.education}
                          onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                          placeholder="e.g., BICT, University of …"
                        />
                      ) : (
                        <Typography>{profileData.education || 'Not provided'}</Typography>
                      )}
                    </InfoSection>

                    <InfoSection title="Skills">
                      {editing ? (
                        <TextField
                          fullWidth variant="outlined" helperText="Separate skills with a comma"
                          name="skills" value={profileData.skills}
                          onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                          placeholder="React, Node.js, Figma"
                        />
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{renderSkillsChips()}</Box>
                      )}
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
