// src/pages/company/CompanyDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import DoNotDisturbOnRoundedIcon from '@mui/icons-material/DoNotDisturbOnRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { alpha, darken, lighten } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

/* Motion helpers */
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const containerStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delayChildren: 0.05, staggerChildren: 0.05 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* Stat tile */
const StatTile = ({ to, icon, value, label, onClick }) => {
  const t = useTheme();
  const surface =
    t.palette.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.65) 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 100%)';

  return (
    <MotionCard
      role={to ? 'link' : 'article'}
      aria-label={label}
      variants={itemFade}
      elevation={0}
      sx={{
        borderRadius: 3,
        height: '100%',
        background: surface,
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        boxShadow:
          t.palette.mode === 'dark'
            ? '0 20px 40px rgba(0,0,0,.4)'
            : '0 20px 40px rgba(0,0,0,.06)',
      }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <CardActionArea
        component={to ? RouterLink : 'div'}
        to={to || undefined}
        onClick={onClick}
        sx={{ p: 2.5, height: '100%' }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {icon}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>
                {value}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                {label}
              </Typography>
            </Box>
          </Stack>
          <ArrowOutwardRoundedIcon sx={{ opacity: 0.4 }} />
        </Stack>
      </CardActionArea>
    </MotionCard>
  );
};

/* Page */
const CompanyDashboardInner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  /* Data */
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const q = query(collection(db, 'internships'), where('companyId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setInternships(jobs);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [user?.uid, db]);

  const totals = useMemo(() => {
    const applicants = internships.reduce((a, j) => a + (j.applicantCount || 0), 0);
    const newThisWeek = internships.reduce((a, j) => a + (j.newApplicantsThisWeek || 0), 0);
    return { count: internships.length, applicants, newThisWeek };
  }, [internships]);

  /* Helpers */
  const scrollToPosted = () => {
    const el = document.getElementById('posted');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const badge = (() => {
    switch (user?.verificationStatus) {
      case 'approved':
        return { icon: <VerifiedRoundedIcon color="success" />, text: 'Approved' };
      case 'pending':
        return { icon: <PendingActionsRoundedIcon color="warning" />, text: 'Pending approval' };
      case 'rejected':
        return { icon: <DoNotDisturbOnRoundedIcon color="error" />, text: 'Rejected' };
      default:
        return null;
    }
  })();

  /* Loading */
  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Skeleton variant="text" width="45%" height={48} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  /* Page background */
  const pageBg =
    theme.palette.mode === 'dark'
      ? `radial-gradient(900px 420px at -10% -10%, ${alpha('#FFFFFF', 0.06)} 0%, transparent 60%),
         radial-gradient(800px 380px at 110% -10%, ${alpha('#FFFFFF', 0.05)} 0%, transparent 60%),
         linear-gradient(180deg, ${theme.palette.background.default} 0%, ${darken(
          theme.palette.background.default,
          0.06
        )} 100%)`
      : `radial-gradient(900px 420px at -10% -10%, ${alpha('#000000', 0.05)} 0%, transparent 60%),
         radial-gradient(800px 380px at 110% -10%, ${alpha('#000000', 0.04)} 0%, transparent 60%),
         linear-gradient(180deg, ${theme.palette.background.default} 0%, ${lighten(
          theme.palette.background.default,
          0.06
        )} 100%)`;

  const surfaceCard =
    theme.palette.mode === 'dark'
      ? {
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.65) 100%)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,.40)',
        }
      : {
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 100%)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,.06)',
        };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', py: { xs: 3, md: 5 }, background: pageBg }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header / CTA */}
        <MotionPaper
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          elevation={0}
          sx={{ ...surfaceCard, mb: 3 }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Typography variant="h4">Welcome, {user?.companyName || user?.email}!</Typography>
              <Typography color="text.secondary">
                Track your postings, review applicants, and keep hiring momentum.
              </Typography>
              {badge && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  {badge.icon}
                  <Typography variant="body2" color="text.secondary">
                    {badge.text}
                  </Typography>
                </Stack>
              )}
            </Box>

            <Box>
              {user?.verificationStatus === 'approved' ? (
                <Button
                  component={RouterLink}
                  to="/company/post-internship"
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ fontSize: '1rem', py: 1.1, px: 2.4 }}
                >
                  Post New Internship
                </Button>
              ) : user?.verificationStatus === 'pending' ? (
                <Alert severity="warning" variant="outlined" sx={{ m: 0 }}>
                  Your profile is pending admin approval. You cannot post jobs yet.
                </Alert>
              ) : user?.verificationStatus === 'rejected' ? (
                <Alert severity="error" variant="outlined" sx={{ m: 0 }}>
                  Your profile was rejected by the admin. Please contact support for assistance.
                </Alert>
              ) : (
                <Alert severity="info" variant="outlined" sx={{ m: 0 }}>
                  Your account is being set up. You will be able to post jobs once approved.
                </Alert>
              )}
            </Box>
          </Stack>
        </MotionPaper>

        {/* Stats */}
        <MotionBox variants={containerStagger} initial="hidden" animate="show" sx={{ mb: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={4}>
              <StatTile
                to="/company/dashboard#posted"
                onClick={scrollToPosted}
                icon={<BusinessCenterOutlinedIcon color="primary" sx={{ fontSize: 36 }} />}
                value={totals.count}
                label="Total Posted Internships"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatTile
                to="/company/dashboard#posted"
                onClick={scrollToPosted}
                icon={<PeopleAltOutlinedIcon color="secondary" sx={{ fontSize: 36 }} />}
                value={totals.applicants}
                label="Total Applicants"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatTile
                to="/company/dashboard#posted"
                onClick={scrollToPosted}
                icon={<MarkEmailReadOutlinedIcon color="success" sx={{ fontSize: 36 }} />}
                value={totals.newThisWeek}
                label="New Applicants (This Week)"
              />
            </Grid>
          </Grid>
        </MotionBox>

        {/* Posted Internships */}
        <MotionPaper id="posted" variants={itemFade} initial="hidden" animate="show" elevation={0} sx={surfaceCard}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.5}
            sx={{ mb: 2 }}
          >
            <Typography variant="h5">Your Posted Internships</Typography>

            {user?.verificationStatus === 'approved' && (
              <Button component={RouterLink} to="/company/post-internship" variant="outlined" startIcon={<AddCircleOutlineIcon />}>
                Post Internship
              </Button>
            )}
          </Stack>

          {internships.length > 0 ? (
            <MotionBox variants={containerStagger} initial="hidden" animate="show">
              <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {internships.map((job) => {
                  const posted = job.postedAt?.toDate ? job.postedAt.toDate() : null;
                  const postedStr = posted ? posted.toLocaleDateString() : '—';
                  const status = job.status || 'open';

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                      <MotionCard
                        variants={itemFade}
                        elevation={0}
                        whileHover={{ y: -6 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          background:
                            theme.palette.mode === 'dark'
                              ? 'linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.65) 100%)'
                              : 'linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 100%)',
                          boxShadow:
                            theme.palette.mode === 'dark'
                              ? '0 14px 40px rgba(0,0,0,.40)'
                              : '0 14px 40px rgba(0,0,0,.08)',
                          overflow: 'hidden',
                        }}
                      >
                        <CardActionArea component={RouterLink} to={`/company/internship/${job.id}/applicants`} sx={{ flexGrow: 1, p: 2.25 }}>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Chip
                                size="small"
                                label={status === 'open' ? 'Open' : status}
                                color={status === 'open' ? 'success' : status === 'paused' ? 'warning' : 'default'}
                                sx={{ textTransform: 'capitalize' }}
                              />
                              {job.category && <Chip size="small" label={job.category} variant="outlined" />}
                            </Stack>

                            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                              {job.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Posted on {postedStr}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Stack direction="row" spacing={1}>
                              <Chip size="small" color="primary" label={`${job.applicantCount || 0} Applicants`} />
                              {job.newApplicantsThisWeek ? (
                                <Chip size="small" color="success" variant="outlined" label={`${job.newApplicantsThisWeek} New`} />
                              ) : null}
                            </Stack>
                          </Stack>
                        </CardActionArea>

                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                          <Button component={RouterLink} to={`/company/internship/${job.id}/applicants`} size="small" variant="contained">
                            View Applicants
                          </Button>
                          <Button component={RouterLink} to={`/company/edit-internship/${job.id}`} size="small" variant="text" sx={{ ml: 'auto' }}>
                            Edit
                          </Button>
                        </CardActions>
                      </MotionCard>
                    </Grid>
                  );
                })}
              </Grid>
            </MotionBox>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                borderRadius: 2,
                background: theme.palette.mode === 'dark' ? alpha('#FFFFFF', 0.06) : alpha('#000000', 0.04),
                border: '1px dashed',
                borderColor: theme.palette.mode === 'dark' ? alpha('#FFFFFF', 0.25) : alpha('#000000', 0.25),
              }}
            >
              <BusinessCenterOutlinedIcon sx={{ fontSize: 56, color: 'grey.400', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                You haven’t posted any internships yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first posting and start receiving applicants within minutes.
              </Typography>
              {user?.verificationStatus === 'approved' && (
                <Button component={RouterLink} to="/company/post-internship" variant="contained" sx={{ mt: 2 }}>
                  Post Your First Internship
                </Button>
              )}
            </Box>
          )}
        </MotionPaper>
      </Container>

      {/* Right floating actions */}
      <Stack
        spacing={1.5}
        sx={{
          position: 'fixed',
          top: '50%',
          right: { xs: 12, md: 24 },
          transform: 'translateY(-50%)',
          zIndex: 1200,
        }}
      >
        {/* Post Internship */}
        <Tooltip title="Post Internship">
          <IconButton
            onClick={() => navigate('/company/post-internship')}
            sx={{
              width: 58,
              height: 58,
              bgcolor: '#000',
              color: '#fff',
              borderRadius: '50%',
              boxShadow: 4,
              '&:hover': { bgcolor: '#222' },
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>

        {/* CENTER: Company Details (instant) */}
        <Tooltip title="Company Details">
          <IconButton
            onClick={() => navigate('/company/details')}
            sx={{
              width: 58,
              height: 58,
              bgcolor: '#000',
              color: '#fff',
              borderRadius: '50%',
              boxShadow: 4,
              '&:hover': { bgcolor: '#222' },
            }}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>

        {/* HOME -> Role Selection */}
        <Tooltip title="Role Selection">
          <IconButton
            onClick={() => navigate('/role-selection')}
            sx={{
              width: 58,
              height: 58,
              bgcolor: '#000',
              color: '#fff',
              borderRadius: '50%',
              boxShadow: 4,
              '&:hover': { bgcolor: '#222' },
            }}
          >
            <HomeRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

/* Export */
export default function CompanyDashboard() {
  return <CompanyDashboardInner />;
}
