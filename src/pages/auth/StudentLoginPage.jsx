// src/pages/auth/StudentLoginPage.jsx
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

/* ========= Helpers ========= */
const initialsFromEmail = (email) => {
  if (!email) return 'S';
  const id = email.split('@')[0].replace(/[^\w]/g, ' ').trim();
  if (!id) return 'S';
  const parts = id.split(/[._-]/).filter(Boolean);
  const first = parts[0]?.[0] ?? 'S';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase();
};

/* ========= Styled ========= */
const GlassPaper = styled(Paper)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.2)
      : alpha('#FFFFFF', 0.86),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  borderRadius: 20,
}));

const FocusField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'transform .18s ease, box-shadow .18s ease',
    background:
      theme.palette.mode === 'dark'
        ? alpha('#FFFFFF', 0.04)
        : alpha('#000000', 0.03),
    borderRadius: 12,
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    transform: 'translateY(-1px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 10px 26px ${alpha('#000', 0.5)}`
        : `0 10px 26px ${alpha('#000', 0.18)}`,
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
  },
  '& input': {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
}));

/* ========= Motion ========= */
const container = {
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

const StudentLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = useTheme();
  const isMdUp = useMediaQuery(t.breakpoints.up('md'));
  const reduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const avatarInitials = useMemo(() => initialsFromEmail(email), [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, 'students');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // adaptive neutral background
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
      <GlobalStyles
        styles={{
          'html, body': { height: '100%' },
          body: {
            margin: 0,
            background: `${subtleRadials}, ${pageBg}`,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          '*': { outlineOffset: 2 },
        }}
      />

      <Box
        sx={{
          minHeight: 'calc(100vh - 70px)',
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 6 },
        }}
      >
        <GlassPaper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 1080,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Left */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              p: { md: 6, lg: 8 },
              position: 'relative',
              background:
                t.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${alpha('#000000', 0.35)} 0%, ${alpha('#000000', 0.55)} 100%)`
                  : `linear-gradient(180deg, ${alpha('#FFFFFF', 0.86)} 0%, ${alpha('#FFFFFF', 0.7)} 100%)`,
              borderRight: { md: `1px solid ${alpha(t.palette.text.primary, 0.12)}` },
            }}
          >
            {!reduceMotion && (
              <Box
                sx={{
                  position: 'absolute',
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  opacity: t.palette.mode === 'dark' ? 0.25 : 0.15,
                  background:
                    t.palette.mode === 'dark'
                      ? `conic-gradient(from 90deg at 50% 50%, ${alpha('#FFFFFF', 0.12)}, ${alpha('#FFFFFF', 0.02)}, ${alpha('#FFFFFF', 0.12)})`
                      : `conic-gradient(from 90deg at 50% 50%, ${alpha('#000000', 0.1)}, ${alpha('#000000', 0.02)}, ${alpha('#000000', 0.1)})`,
                  top: 40,
                  left: -60,
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
                src="/images/student.jpg"  // 👈 point to your file in public/images
                alt="Student life"
                loading="eager"
                sizes="(min-width: 900px) 360px, 88vw"
                sx={{
                  width: { md: 360, lg: 400 },
                  height: { md: 260, lg: 280 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="visible">
              <Typography
                variant="h5"
                sx={{
                  mb: 0.75,
                  fontWeight: 800,
                  color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827',
                  fontSize: 'clamp(20px, 2.4vw, 24px)',
                }}
              >
                Welcome back!
              </Typography>
              <Typography sx={{ color: alpha(t.palette.text.primary, 0.72), fontSize: 'clamp(14px, 1.5vw, 16px)' }}>
                Log in to track applications, polish your resume, and land that internship.
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: alpha(t.palette.text.primary, 0.72) }}>
              <SchoolRoundedIcon fontSize="small" />
              <Typography variant="body2">Trusted by thousands of students</Typography>
            </Box>
          </Box>

          {/* Right — Form */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              gap: 22 / 8,
              position: 'relative',
              background:
                t.palette.mode === 'dark'
                  ? `linear-gradient(180deg, ${alpha('#000000', 0.3)} 0%, ${alpha('#000000', 0.6)} 100%)`
                  : `linear-gradient(180deg, ${alpha('#FFFFFF', 0.86)} 0%, ${alpha('#FFFFFF', 0.96)} 100%)`,
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
                  width: 64,
                  height: 64,
                  bgcolor: t.palette.mode === 'dark' ? '#111111' : '#000000',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  boxShadow:
                    t.palette.mode === 'dark'
                      ? `0 10px 30px ${alpha('#000', 0.6)}`
                      : `0 10px 30px ${alpha('#000', 0.24)}`,
                }}
              >
                {avatarInitials}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    fontSize: 'clamp(26px, 3.2vw, 34px)',
                    lineHeight: 1.15,
                  }}
                >
                  Student Login
                </Typography>
                <Typography sx={{ color: alpha(t.palette.text.primary, 0.72), fontSize: 'clamp(13px, 1.5vw, 15px)' }}>
                  Use your campus email to continue
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                variant="outlined"
                component={motion.div}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                sx={{ borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}

            <FocusField
              label="Edu Email ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              InputProps={{ sx: { py: 1.2, color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827' } }}
              InputLabelProps={{ sx: { color: alpha(t.palette.text.primary, 0.7) } }}
              component={motion.div}
              custom={0}
              variants={container}
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
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end" aria-label="toggle password visibility">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { py: 1.2, color: t.palette.mode === 'dark' ? '#E5E7EB' : '#111827' },
              }}
              InputLabelProps={{ sx: { color: alpha(t.palette.text.primary, 0.7) } }}
              component={motion.div}
              custom={1}
              variants={container}
              initial="hidden"
              animate="visible"
            />

            <Box
              component={motion.div}
              custom={2}
              variants={container}
              initial="hidden"
              animate="visible"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 0.5,
                color: alpha(t.palette.text.primary, 0.8),
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    color="default"
                    sx={{
                      color: alpha(t.palette.text.primary, 0.5),
                      '&.Mui-checked': { color: t.palette.text.primary },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.95rem' }}>Remember me</Typography>}
              />
              <Link component={RouterLink} to="/forgot-password" underline="hover" color="inherit" sx={{ fontWeight: 600 }}>
                Forgot password?
              </Link>
            </Box>

            <Box
              component={motion.div}
              custom={3}
              variants={container}
              initial="hidden"
              animate="visible"
              sx={{ position: 'relative', mt: 0.5 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  letterSpacing: '.02em',
                  borderRadius: 12,
                  textTransform: 'none',
                  fontSize: '1rem',
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
                Log In
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }}
                />
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: alpha(t.palette.text.primary, 0.12) }} />

            <Typography
              component={motion.p}
              custom={4}
              variants={container}
              initial="hidden"
              animate="visible"
              style={{ margin: 0 }}
              sx={{ textAlign: 'center', color: alpha(t.palette.text.primary, 0.8), fontSize: '0.98rem' }}
            >
              No account?{' '}
              <Link component={RouterLink} to="/student/signup" underline="hover" color="inherit" sx={{ fontWeight: 700 }}>
                Sign up
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

export default StudentLoginPage;
