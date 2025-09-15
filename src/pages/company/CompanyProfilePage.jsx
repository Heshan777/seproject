import React, { useEffect, useMemo, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const normalizeUrl = (u) => {
  if (!u) return '';
  const v = u.trim();
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};
const isEmail = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const CompanyProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    companyName: '',
    website: '',
    description: '',
    contactEmail: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const db = getFirestore();

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      setLoading(true);
      const ref = doc(db, 'companies', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        const filled = {
          companyName: d.companyName || '',
          website: d.website || '',
          description: d.description || '',
          contactEmail: d.contactEmail || user.email || '',
          linkedin: d.linkedin || '',
          facebook: d.facebook || '',
          twitter: d.twitter || '',
          instagram: d.instagram || '',
          youtube: d.youtube || '',
        };
        setProfileData(filled);
        setInitialData(filled);
      } else {
        const base = { ...profileData, contactEmail: user.email || '' };
        setProfileData(base);
        setInitialData(base);
      }
      setLoading(false);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, db]);

  const dirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(profileData) !== JSON.stringify(initialData);
  }, [profileData, initialData]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isEmail(profileData.contactEmail)) {
      setSnack({ open: true, message: 'Enter a valid contact email.', severity: 'warning' });
      return;
    }
    const payload = {
      companyName: profileData.companyName.trim(),
      website: normalizeUrl(profileData.website),
      description: profileData.description.trim(),
      contactEmail: profileData.contactEmail.trim(),
      linkedin: normalizeUrl(profileData.linkedin),
      facebook: normalizeUrl(profileData.facebook),
      twitter: normalizeUrl(profileData.twitter),
      instagram: normalizeUrl(profileData.instagram),
      youtube: normalizeUrl(profileData.youtube),
    };
    try {
      setSaving(true);
      await updateDoc(doc(db, 'companies', user.uid), payload);
      setInitialData(payload);
      setProfileData(payload);
      setEditing(false);
      setSnack({ open: true, message: 'Profile updated successfully.', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update profile.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    setProfileData(initialData || profileData);
    setEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const socialDefs = [
    { key: 'website', label: 'Website', icon: <LanguageIcon />, placeholder: 'https://example.com' },
    { key: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon />, placeholder: 'https://linkedin.com/company/yourcompany' },
    { key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, placeholder: 'https://facebook.com/yourcompany' },
    { key: 'twitter', label: 'Twitter/X', icon: <TwitterIcon />, placeholder: 'https://twitter.com/yourcompany' },
    { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, placeholder: 'https://instagram.com/yourcompany' },
    { key: 'youtube', label: 'YouTube', icon: <YouTubeIcon />, placeholder: 'https://youtube.com/@yourcompany' },
  ];

  return (
    <Box sx={{ bgcolor: '#F7F7FB', minHeight: 'calc(100vh - 64px)', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              p: { xs: 2.5, sm: 4 },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: { xs: 72, sm: 96 },
                    height: { xs: 72, sm: 96 },
                    bgcolor: 'rgba(255,255,255,.2)',
                    color: '#fff',
                    fontSize: { xs: 28, sm: 36 },
                    fontWeight: 800,
                    border: '2px solid rgba(255,255,255,.35)',
                  }}
                >
                  {(profileData.companyName || 'C').charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                  {profileData.companyName || 'Company'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {user?.verificationStatus && (
                    <Chip
                      size="small"
                      color={
                        user.verificationStatus === 'approved'
                          ? 'success'
                          : user.verificationStatus === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                      label={`Status: ${user.verificationStatus}`}
                    />
                  )}
                  {profileData.contactEmail && (
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<EmailOutlinedIcon />}
                      label={profileData.contactEmail}
                    />
                  )}
                </Stack>
              </Grid>
              <Grid item>
                {!editing ? (
                  <Tooltip title="Edit Profile">
                    <IconButton onClick={() => setEditing(true)} sx={{ color: '#fff' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Cancel">
                      <IconButton onClick={resetChanges} sx={{ color: '#fff' }}>
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save">
                      <IconButton form="company-profile-form" type="submit" sx={{ color: '#fff' }}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box component="form" id="company-profile-form" onSubmit={handleSave} sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid item xs={12}>
                <TextField
                  label="Company Name"
                  fullWidth
                  value={profileData.companyName}
                  onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={4}
                  value={profileData.description}
                  onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Email"
                  fullWidth
                  type="email"
                  value={profileData.contactEmail}
                  onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Website"
                  fullWidth
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Social Links</Typography>
                <Grid container spacing={2}>
                  {socialDefs.map((s) => (
                    <Grid item xs={12} md={6} key={s.key}>
                      <TextField
                        label={s.label}
                        fullWidth
                        value={profileData[s.key]}
                        onChange={(e) => setProfileData({ ...profileData, [s.key]: e.target.value })}
                        disabled={!editing}
                        placeholder={s.placeholder}
                        InputProps={{ startAdornment: <InputAdornment position="start">{s.icon}</InputAdornment> }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {!editing ? (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Preview</Typography>
                    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                      {profileData.website && (
                        <Tooltip title="Website">
                          <IconButton
                            component={Link}
                            href={normalizeUrl(profileData.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LanguageIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {profileData.linkedin && (
                        <Tooltip title="LinkedIn">
                          <IconButton component={Link} href={normalizeUrl(profileData.linkedin)} target="_blank" rel="noopener noreferrer">
                            <LinkedInIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {profileData.facebook && (
                        <Tooltip title="Facebook">
                          <IconButton component={Link} href={normalizeUrl(profileData.facebook)} target="_blank" rel="noopener noreferrer">
                            <FacebookIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {profileData.twitter && (
                        <Tooltip title="Twitter/X">
                          <IconButton component={Link} href={normalizeUrl(profileData.twitter)} target="_blank" rel="noopener noreferrer">
                            <TwitterIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {profileData.instagram && (
                        <Tooltip title="Instagram">
                          <IconButton component={Link} href={normalizeUrl(profileData.instagram)} target="_blank" rel="noopener noreferrer">
                            <InstagramIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {profileData.youtube && (
                        <Tooltip title="YouTube">
                          <IconButton component={Link} href={normalizeUrl(profileData.youtube)} target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {!profileData.website &&
                        !profileData.linkedin &&
                        !profileData.facebook &&
                        !profileData.twitter &&
                        !profileData.instagram &&
                        !profileData.youtube && (
                          <Typography color="text.secondary">No social links added yet.</Typography>
                        )}
                    </Stack>
                  </Paper>
                </Grid>
              ) : null}

              <Grid item xs={12}>
                {editing ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
                    <Button onClick={resetChanges} variant="text" startIcon={<CancelIcon />} disabled={saving}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={saving || !dirty}
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </Stack>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setEditing(true)} variant="contained" startIcon={<EditIcon />}>
                      Edit Profile
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyProfilePage;
