import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
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
  Skeleton,
  Breadcrumbs,
  Tooltip,
  IconButton
} from '@mui/material';

import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import PaidIcon from '@mui/icons-material/Paid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const GlassCard = ({ children, sx }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2.5, sm: 4 },
      borderRadius: '18px',
      bgcolor: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(8px)',
      border: '1px solid',
      borderColor: 'rgba(136, 136, 136, 0.15)',
      boxShadow:
        '0 10px 30px rgba(31, 41, 55, 0.07), inset 0 0 1px rgba(255,255,255,0.4)',
      ...sx
    }}
  >
    {children}
  </Paper>
);

const InfoItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.25} alignItems="center">
    <Box
      sx={{
        width: 36,
        height: 36,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 2,
        bgcolor: 'rgba(99,102,241,0.08)'
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Box>
  </Stack>
);

const SectionHeader = ({ children }) => (
  <Typography
    variant="overline"
    sx={{
      letterSpacing: '.12em',
      color: 'text.secondary',
      fontWeight: 700,
      display: 'block',
      mb: 1
    }}
  >
    {children}
  </Typography>
);

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
        const docRef = doc(db, 'internships', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setInternship(data);

          if (user && user.role === 'students') {
            const applicationsQuery = query(
              collection(db, 'applications'),
              where('internshipId', '==', id),
              where('studentId', '==', user.uid)
            );
            const querySnapshot = await getDocs(applicationsQuery);
            if (!querySnapshot.empty) setApplied(true);
          }
        } else {
          setError('Internship not found.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Could not load internship details.');
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
      setError(
        'Cannot apply: User or company data is missing. Please complete your profile.'
      );
      return;
    }

    setApplying(true);
    setError(null);
    try {
      await addDoc(collection(db, 'applications'), {
        internshipId: id,
        internshipTitle: internship.title,
        studentId: user.uid,
        studentName: user.fullName,
        studentEmail: user.email,
        companyId: internship.companyId,
        companyName: internship.companyName,
        status: 'Applied',
        appliedAt: serverTimestamp()
      });
      setApplied(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  // ---------- Loading ----------
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          py: 6,
          position: 'relative',
          // Beautiful gradient background
          background:
            'radial-gradient(1200px 600px at -10% 0%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 50%), radial-gradient(900px 500px at 110% 10%, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 60%), linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 50%, #F8FAFC 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <GlassCard>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="80%" height={80} />
                <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={300} />
              </GlassCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <GlassCard sx={{ height: 300 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // ---------- Not Found ----------
  if (!internship) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(1200px 600px at -10% 0%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 50%), radial-gradient(900px 500px at 110% 10%, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 60%), linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 50%, #F8FAFC 100%)'
        }}
      >
        <GlassCard sx={{ textAlign: 'center', maxWidth: 520 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Internship Not Found
          </Typography>
          <Typography color="text.secondary">
            This listing may have been removed or is no longer available.
          </Typography>
          <Button
            component={RouterLink}
            to="/internships"
            sx={{ mt: 2 }}
            startIcon={<ArrowBackIosNewIcon />}
          >
            Back to Listings
          </Button>
        </GlassCard>
      </Box>
    );
  }

  // ---------- Page ----------
  const postedDate =
    internship.postedAt?.toDate().toLocaleDateString() || '—';
  const location = internship.location || internship.city || internship.country;
  const employmentType = internship.type || internship.employmentType;
  const stipend =
    internship.stipend ||
    internship.salaryRange ||
    internship.salary ||
    null;
  const deadline =
    internship.deadline?.toDate().toLocaleDateString() ||
    internship.applyBy ||
    null;
  const tags =
    internship.tags ||
    internship.skills ||
    [internship.category].filter(Boolean);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflowX: 'hidden',
        // Beautiful layered gradient background
        background:
          'radial-gradient(1200px 600px at -10% 0%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 50%), radial-gradient(900px 500px at 110% 10%, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 60%), linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 50%, #F8FAFC 100%)'
      }}
    >
      <Container maxWidth="lg">
        {/* Top bar: breadcrumbs + quick actions */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Button
              component={RouterLink}
              to="/internships"
              size="small"
              startIcon={<ArrowBackIosNewIcon />}
              sx={{ textTransform: 'none' }}
            >
              Internships
            </Button>
            <Typography color="text.secondary" variant="body2">
              {internship.category || 'Opportunity'}
            </Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Share">
              <IconButton size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton size="small">
                <BookmarkBorderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Grid container spacing={4}>
          {/* --- MAIN CONTENT (Left Column) --- */}
          <Grid item xs={12} md={8}>
            <GlassCard>
              {/* Header */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 64,
                      height: 64,
                      fontSize: 28,
                      fontWeight: 700,
                      boxShadow: '0 6px 16px rgba(79,70,229,.25)'
                    }}
                  >
                    {internship.companyName?.charAt(0) || 'C'}
                  </Avatar>

                  <Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ fontWeight: 800, lineHeight: 1.2 }}
                    >
                      {internship.title}
                    </Typography>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body1" color="text.secondary">
                        {internship.companyName}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {tags?.slice(0, 4).map((t, i) => (
                    <Chip
                      key={`${t}-${i}`}
                      label={t}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: '999px' }}
                    />
                  ))}
                </Stack>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              {/* Quick facts */}
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <InfoItem
                    icon={<PlaceIcon fontSize="small" color="primary" />}
                    label="Location"
                    value={location}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <InfoItem
                    icon={<WorkOutlineIcon fontSize="small" color="primary" />}
                    label="Type"
                    value={employmentType || 'Internship'}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <InfoItem
                    icon={<PaidIcon fontSize="small" color="primary" />}
                    label="Stipend / Salary"
                    value={stipend}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <InfoItem
                    icon={<AccessTimeIcon fontSize="small" color="primary" />}
                    label="Application Deadline"
                    value={deadline}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5 }} />

              <SectionHeader>Job Description</SectionHeader>
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: '#374151' }}
              >
                {internship.description}
              </Typography>
            </GlassCard>
          </Grid>

          {/* --- SIDEBAR (Right Column) --- */}
          <Grid item xs={12} md={4}>
            <GlassCard sx={{ position: 'sticky', top: { xs: 16, md: 96 } }}>
              <Stack spacing={2.25}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 700
                    }}
                  >
                    {internship.companyName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {internship.companyName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posted on {postedDate}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack direction="row" spacing={1.25} alignItems="center">
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Start date:{' '}
                    <b>
                      {internship.startDate
                        ? internship.startDate
                        : 'Flexible / ASAP'}
                    </b>
                  </Typography>
                </Stack>

                <Box sx={{ pt: 1 }}>
                  {user?.role === 'students' ? (
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleApply}
                      disabled={applied || applying}
                      sx={{
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow:
                          '0 10px 20px rgba(79,70,229,.25), 0 2px 6px rgba(79,70,229,.15)'
                      }}
                    >
                      {applying ? (
                        <CircularProgress size={26} color="inherit" />
                      ) : applied ? (
                        'Application Submitted'
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                  ) : (
                    <Alert severity="info">
                      Please sign in as a student to apply.
                    </Alert>
                  )}
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <Divider sx={{ my: 1 }} />

                <Stack spacing={1}>
                  <SectionHeader>Next steps</SectionHeader>
                  <Typography variant="body2" color="text.secondary">
                    Tailor your resume to highlight relevant projects and skills.
                    After applying, you’ll see your application under{" "}
                    <b>My Applications</b>.
                  </Typography>
                </Stack>
              </Stack>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InternshipDetailPage;
