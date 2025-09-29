// src/pages/auth/StudentSignupPage.jsx
import { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { motion, useReducedMotion } from 'framer-motion';

/* ===== Helpers ===== */
const initials = (nameOrEmail) => {
  if (!nameOrEmail) return 'S';
  const base = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  const parts = base.replace(/[^\w ]/g, ' ').trim().split(/[ ._-]/).filter(Boolean);
  const a = parts[0]?.[0] ?? 'S';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase();
};

/* ===== Styled ===== */
const GlassPaper = styled(Paper)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.2)
      : alpha('#FFFFFF', 0.8),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  borderRadius: theme.shape.borderRadius * 1.25,
}));

const FocusField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'transform .18s ease, box-shadow .18s ease',
    background:
      theme.palette.mode === 'dark'
        ? alpha('#FFFFFF', 0.04)
        : alpha('#000000', 0.03),
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    transform: 'translateY(-2px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 12px 28px ${alpha('#000', 0.35)}`
        : `0 12px 28px ${alpha('#000', 0.15)}`,
  },
}));

/* ===== Motion ===== */
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

const float = (reduced) =>
  reduced
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      };

/* ===== Component ===== */
const StudentSignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const t = useTheme();
  const reduceMotion = useReducedMotion();
  const isMdUp = useMediaQuery(t.breakpoints.up('md'));

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const av = useMemo(() => initials(fullName || email), [fullName, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(email, password, { fullName }, 'students');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // page background
  const pageBg =
    t.palette.mode === 'dark'
      ? `linear-gradient(180deg, ${t.palette.background.default} 0%, ${alpha('#FFFFFF', 0.02)} 40%, ${t.palette.background.default} 100%)`
      : `linear-gradient(180deg, ${t.palette.background.default} 0%, ${alpha('#000000', 0.02)} 40%, ${t.palette.background.default} 100%)`;

  const subtleRadials =
    t.palette.mode === 'dark'
      ? `radial-gradient(900px 500px at -10% -10%, ${alpha('#FFFFFF', 0.06)} 0%, transparent 60%),
         radial-gradient(800px 400px at 120% -10%, ${alpha('#FFFFFF', 0.05)} 0%, transparent 55%)`
      : `radial-gradient(900px 500px at -10% -10%, ${alpha('#000000', 0.06)} 0%, transparent 60%),
         radial-gradient(800px 400px at 120% -10%, ${alpha('#000000', 0.05)} 0%, transparent 55%)`;

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0, background: `${subtleRadials}, ${pageBg}` } }} />

      <Box
        sx={{
          minHeight: 'calc(100vh - 70px)',
          display: 'grid',
          placeItems: 'center',
          px: 2,
          py: { xs: 4, md: 6 },
        }}
      >
        <GlassPaper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 1040,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            position: 'relative',
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Left — Illustration / value props */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              p: 6,
              position: 'relative',
              background:
                t.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${alpha('#000000', 0.35)} 0%, ${alpha('#000000', 0.55)} 100%)`
                  : `linear-gradient(180deg, ${alpha('#FFFFFF', 0.8)} 0%, ${alpha('#FFFFFF', 0.6)} 100%)`,
              borderRight: { md: `1px solid ${alpha(t.palette.text.primary, 0.12)}` },
            }}
          >
            {!reduceMotion && (
              <Box
                sx={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  filter: 'blur(38px)',
                  opacity: t.palette.mode === 'dark' ? 0.25 : 0.15,
                  background:
                    t.palette.mode === 'dark'
                      ? `conic-gradient(from 90deg at 50% 50%, ${alpha('#FFFFFF', 0.12)}, ${alpha('#FFFFFF', 0.02)}, ${alpha('#FFFFFF', 0.12)})`
                      : `conic-gradient(from 90deg at 50% 50%, ${alpha('#000000', 0.1)}, ${alpha('#000000', 0.02)}, ${alpha('#000000', 0.1)})`,
                  top: 30,
                  right: -60,
                  animation: 'spin 18s linear infinite',
                  '@keyframes spin': { to: { transform: 'rotate(1turn)' } },
                }}
              />
            )}

            <motion.div
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow:
                  t.palette.mode === 'dark'
                    ? '0 30px 80px rgba(0,0,0,.45)'
                    : '0 30px 80px rgba(0,0,0,.18)',
              }}
              whileHover={reduceMotion ? {} : { rotateX: 6, rotateY: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              {...float(reduceMotion)}
            >
              <Box
                component="img"
                src="/images/student.jpg"  // served from public/images
                alt="Students collaborating"
                sx={{ width: 360, height: 260, objectFit: 'cover', display: 'block' }}
              />
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="visible">
              <Typography
                variant="h5"
                sx={{ color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827', mb: 0.5, fontWeight: 800 }}
              >
                Create your student account
              </Typography>
              <Typography sx={{ color: alpha(t.palette.text.primary, 0.7) }}>
                Build a portfolio, get matched to internships, and grow with mentors.
              </Typography>
            </motion.div>

            <Box sx={{ display: 'grid', gap: 1.25, mt: 1 }}>
              {[
                'Guided projects & resume milestones',
                'Mentors and peer community',
                'Application tracker & reminders',
              ].map((tline) => (
                <Box key={tline} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolRoundedIcon />
                  <Typography variant="body2" sx={{ color: alpha(t.palette.text.primary, 0.7) }}>
                    {tline}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right — Signup form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              p: { xs: 3.5, sm: 5, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2.2,
              background:
                t.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${alpha('#000000', 0.3)} 0%, ${alpha('#000000', 0.6)} 100%)`
                  : `linear-gradient(180deg, ${alpha('#FFFFFF', 0.8)} 0%, ${alpha('#FFFFFF', 0.95)} 100%)`,
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Avatar
                component={motion.div}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}
                sx={{
                  width: 62,
                  height: 62,
                  bgcolor: t.palette.mode === 'dark' ? '#111111' : '#000000',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  boxShadow:
                    t.palette.mode === 'dark'
                      ? `0 10px 30px ${alpha('#000', 0.6)}`
                      : `0 10px 30px ${alpha('#000', 0.24)}`,
                }}
              >
                {av}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                  Sign up
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(t.palette.text.primary, 0.7) }}>
                  Use your campus email to get started
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                component={motion.div}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {error}
              </Alert>
            )}

            <FocusField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
              InputProps={{ sx: { color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827' } }}
              InputLabelProps={{ sx: { color: alpha(t.palette.text.primary, 0.7) } }}
              component={motion.div}
              custom={0}
              variants={item}
              initial="hidden"
              animate="visible"
            />

            <FocusField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              InputProps={{ sx: { color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827' } }}
              InputLabelProps={{ sx: { color: alpha(t.palette.text.primary, 0.7) } }}
              component={motion.div}
              custom={1}
              variants={item}
              initial="hidden"
              animate="visible"
            />

            <FocusField
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                sx: { color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end" aria-label="toggle password visibility">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: alpha(t.palette.text.primary, 0.7) } }}
              component={motion.div}
              custom={2}
              variants={item}
              initial="hidden"
              animate="visible"
            />

            <Box
              component={motion.div}
              custom={3}
              variants={item}
              initial="hidden"
              animate="visible"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    color="default"
                    sx={{
                      color: alpha(t.palette.text.primary, 0.5),
                      '&.Mui-checked': { color: t.palette.text.primary },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: alpha(t.palette.text.primary, 0.8) }}>
                    I agree to the{' '}
                    <Link component={RouterLink} to="/terms" underline="hover" color="inherit" sx={{ fontWeight: 600 }}>
                      Terms
                    </Link>
                  </Typography>
                }
              />
            </Box>

            <Box
              component={motion.div}
              custom={4}
              variants={item}
              initial="hidden"
              animate="visible"
              sx={{ position: 'relative', mt: 0.5 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !agree}
                fullWidth
                sx={{
                  py: 1.35,
                  fontWeight: 800,
                  letterSpacing: '.02em',
                  backgroundColor: t.palette.mode === 'dark' ? '#111111' : '#000000',
                  color: '#FFFFFF',
                  boxShadow:
                    t.palette.mode === 'dark'
                      ? `0 18px 40px ${alpha('#000', 0.5)}`
                      : `0 18px 40px ${alpha('#000', 0.2)}`,
                  '&:hover': {
                    backgroundColor: t.palette.mode === 'dark' ? '#1A1A1A' : '#111111',
                  },
                }}
              >
                Create Account
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }}
                />
              )}
            </Box>

            <Divider sx={{ my: 1.75, borderColor: alpha(t.palette.text.primary, 0.12) }} />

            <Typography
              component={motion.p}
              custom={5}
              variants={item}
              initial="hidden"
              animate="visible"
              style={{ margin: 0 }}
              sx={{ textAlign: 'center', color: alpha(t.palette.text.primary, 0.8) }}
            >
              Have an account?{' '}
              <Link component={RouterLink} to="/student/login" underline="hover" color="inherit" sx={{ fontWeight: 600 }}>
                Log in
              </Link>
            </Typography>

            {!isMdUp && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: -1,
                  background:
                    t.palette.mode === 'dark'
                      ? `radial-gradient(380px 160px at 110% -30%, ${alpha('#FFFFFF', 0.06)} 0%, transparent 70%),
                         radial-gradient(380px 160px at -10% -30%, ${alpha('#FFFFFF', 0.06)} 0%, transparent 70%)`
                      : `radial-gradient(380px 160px at 110% -30%, ${alpha('#000000', 0.06)} 0%, transparent 70%),
                         radial-gradient(380px 160px at -10% -30%, ${alpha('#000000', 0.06)} 0%, transparent 70%)`,
                }}
              />
            )}
          </Box>
        </GlassPaper>
      </Box>
    </>
  );
};

export default StudentSignupPage;
