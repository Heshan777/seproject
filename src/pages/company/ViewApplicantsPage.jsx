// src/pages/company/ViewApplicantsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import {
  Avatar,
  Box,
  Chip,
  Container,
  Typography,
  Paper,
  Link,
  Grid,
  Stack,
  Button,
  Select,
  MenuItem,
  Divider,
  Skeleton,
  IconButton,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const ViewApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  const { internshipId } = useParams();
  const { user } = useAuth();
  const db = getFirestore();
  const t = useTheme();

  useEffect(() => {
    if (!user || !internshipId) return;

    const fetchInternshipDetails = async () => {
      const docRef = doc(db, 'internships', internshipId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setInternship(docSnap.data());
    };
    fetchInternshipDetails();

    const q = query(collection(db, 'applications'), where('internshipId', '==', internshipId));
    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const applicantPromises = querySnapshot.docs.map(async (appDoc) => {
          const appData = appDoc.data();
          const studentRef = doc(db, 'students', appData.studentId);
          const studentSnap = await getDoc(studentRef);
          const student = studentSnap.exists() ? studentSnap.data() : {};

          // Prefer new base64 resume, fall back to any stored URL.
          const resumeImageData = student.resumeImageData || null;
          const resumeUrl = student.resumeUrl || null;

          return {
            id: appDoc.id,
            ...appData,
            // surface student profile fields for easy rendering
            student: {
              fullName: student.fullName || appData.studentName || '—',
              email: appData.studentEmail || student.email || '—',
              bio: student.bio || '',
              education: student.education || '',
              skills: student.skills || '',
              website: student.website || '',
              linkedin: student.linkedin || '',
              github: student.github || '',
              facebook: student.facebook || '',
              twitter: student.twitter || '',
              instagram: student.instagram || '',
              youtube: student.youtube || '',
              photoUrl: student.photoUrl || '',
              photoData: student.photoData || '',
              resumeImageData,
              resumeUrl,
            },
          };
        });

        const applicantList = await Promise.all(applicantPromises);
        setApplicants(applicantList);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [internshipId, db, user]);

  const handleStatusChange = async (applicationId, newStatus) => {
    const appDocRef = doc(db, 'applications', applicationId);
    try {
      await updateDoc(appDocRef, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const getStatusChipColor = (status) => {
    switch ((status || '').toLowerCase().replace(/\s+/g, '_')) {
      case 'selected':
        return 'success';
      case 'rejected':
        return 'error';
      case 'under_review':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const SocialIcons = ({ s }) => {
    const items = [
      { key: 'website', icon: <LanguageIcon />, href: s.website },
      { key: 'linkedin', icon: <LinkedInIcon />, href: s.linkedin },
      { key: 'github', icon: <GitHubIcon />, href: s.github },
      { key: 'facebook', icon: <FacebookIcon />, href: s.facebook },
      { key: 'twitter', icon: <TwitterIcon />, href: s.twitter },
      { key: 'instagram', icon: <InstagramIcon />, href: s.instagram },
      { key: 'youtube', icon: <YouTubeIcon />, href: s.youtube },
    ].filter((i) => i.href);

    if (!items.length) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No social links provided.
        </Typography>
      );
    }

    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {items.map(({ key, icon, href }) => (
          <IconButton key={key} component={Link} href={href} target="_blank" rel="noopener">
            {icon}
          </IconButton>
        ))}
      </Stack>
    );
  };

  const renderSkills = (skillsStr) => {
    const arr = (skillsStr || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!arr.length)
      return <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>No skills listed.</Typography>;
    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {arr.map((skill, i) => (
          <Chip
            key={`${skill}-${i}`}
            size="small"
            label={skill}
            sx={{ bgcolor: alpha(t.palette.primary.main, 0.12), color: t.palette.primary.dark, fontWeight: 600 }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: 'calc(100vh - 64px)',
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Button
          component={RouterLink}
          to="/company/dashboard"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Applicants
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          For: {internship?.title || 'Loading Internship...'}
        </Typography>

        {/* Loading skeleton grid */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3 }}
                >
                  <Skeleton variant="text" width="30%" height={30} />
                  <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 2 }} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : applicants.length > 0 ? (
          <Grid container spacing={3}>
            {applicants.map((app) => {
              const s = app.student || {};
              const avatarSrc = s.photoUrl || s.photoData || undefined;

              return (
                <Grid item xs={12} key={app.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    }}
                  >
                    {/* Header row */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={avatarSrc}
                          alt={s.fullName}
                          sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 800 }}
                        >
                          {!avatarSrc && (s.fullName || 'U')[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                            {s.fullName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {s.email}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip label={app.status || 'Applied'} color={getStatusChipColor(app.status)} />
                        <Select
                          size="small"
                          value={app.status || 'Applied'}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          sx={{ minWidth: 160 }}
                        >
                          <MenuItem value="Applied">Applied</MenuItem>
                          <MenuItem value="Under Review">Under Review</MenuItem>
                          <MenuItem value="Selected">Selected</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Body: two columns */}
                    <Grid container spacing={3}>
                      {/* Left: profile details */}
                      <Grid item xs={12} md={7}>
                        <Stack spacing={2.25}>
                          <Box>
                            <Typography variant="overline" color="text.secondary">About</Typography>
                            <Typography
                              sx={{
                                mt: 0.5,
                                whiteSpace: 'pre-wrap',
                                color: s.bio ? 'inherit' : 'text.secondary',
                                fontStyle: s.bio ? 'normal' : 'italic',
                              }}
                            >
                              {s.bio || 'No bio provided.'}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="overline" color="text.secondary">Education</Typography>
                            <Typography sx={{ mt: 0.5 }}>
                              {s.education || 'Not provided'}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="overline" color="text.secondary">Skills</Typography>
                            <Box sx={{ mt: 1 }}>{renderSkills(s.skills)}</Box>
                          </Box>

                          <Box>
                            <Typography variant="overline" color="text.secondary">Online Presence</Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <SocialIcons s={s} />
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Right: resume preview */}
                      <Grid item xs={12} md={5}>
                        <Box>
                          <Typography variant="overline" color="text.secondary">Resume</Typography>

                          {s.resumeImageData ? (
                            <>
                              <Box
                                sx={{
                                  mt: 1,
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  border: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                                  bgcolor: alpha(t.palette.text.primary, 0.02),
                                }}
                              >
                                <img
                                  src={s.resumeImageData}
                                  alt="Resume"
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: 420,
                                    objectFit: 'contain',
                                  }}
                                />
                              </Box>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1 }}
                                endIcon={<OpenInNewRoundedIcon />}
                                onClick={() => window.open(s.resumeImageData, '_blank')}
                              >
                                Open full size
                              </Button>
                            </>
                          ) : s.resumeUrl ? (
                            <Button
                              component={Link}
                              href={s.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                              sx={{ mt: 1 }}
                            >
                              View Resume
                            </Button>
                          ) : (
                            <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                              Not Provided
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              p: { xs: 4, sm: 8 },
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: `1px dashed ${alpha(t.palette.text.primary, 0.25)}`,
            }}
          >
            <PersonSearchOutlinedIcon
              sx={{
                fontSize: 60,
                color: alpha(t.palette.text.primary, 0.4),
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No Applicants Yet
            </Typography>
            <Typography color="text.secondary">
              Check back later to see who has applied to this role.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default ViewApplicantsPage;
