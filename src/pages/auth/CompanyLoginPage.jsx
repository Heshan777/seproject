// src/pages/auth/CompanyLoginPage.jsx
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
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';

/* -------------------- Helpers -------------------- */
const initialsFromEmail = (email) => {
  if (!email) return 'C';
  const id = email.split('@')[0].replace(/[^\w]/g, ' ').trim();
  if (!id) return 'C';
  const parts = id.split(/[._-]/).filter(Boolean);
  const first = parts[0]?.[0] ?? 'C';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase();
};

/* -------------------- Component -------------------- */
const CompanyLoginPage = () => {
  const theme = useTheme(); // uses global ThemeModeProvider
  const isDark = theme.palette.mode === 'dark';

  const { login } = useAuth();
  const navigate = useNavigate();

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
      await login(email, password, 'companies');
      navigate('/company/dashboard');
    } catch (err) {
      setError(err?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 70px)',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: { xs: 4, md: 6 },
        bgcolor: isDark ? theme.palette.background.default : '#ffffff', // white in light mode
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1120,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isDark ? alpha('#ffffff', 0.12) : alpha('#000000', 0.08),
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* ---------- Left Section ---------- */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2.5,
            p: { md: 5, lg: 6 },
            borderRight: '1px solid',
            borderColor: isDark ? alpha('#ffffff', 0.12) : alpha('#000000', 0.08),
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop"
            alt="Team collaborating"
            sx={{
              width: '100%',
              maxWidth: 460,
              height: 260,
              objectFit: 'cover',
              borderRadius: 3,
              boxShadow: `0 24px 80px ${alpha('#000', isDark ? 0.35 : 0.15)}`,
            }}
          />

          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Build great teams, faster.
            </Typography>
            <Typography color="text.secondary">
              Reach vetted student talent, streamline interviews, and scale your early-career pipeline with confidence.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <BusinessCenterRoundedIcon sx={{ color: '#000' }} />
            <Typography variant="body2" color="text.secondary">
              Trusted by leading startups & enterprises
            </Typography>
          </Box>
        </Box>

        {/* ---------- Right Section (Form) ---------- */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, sm: 4, md: 5, lg: 6 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#000000', // solid black background
                color: '#ffffff',  // white initial
                fontWeight: 800,
              }}
            >
              {avatarInitials}
            </Avatar>
            <Box>
              <Typography variant="h4">Company Login</Typography>
              <Typography variant="body2" color="text.secondary">
                Use your company email to continue
              </Typography>
            </Box>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Company Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw((s) => !s)}
                    edge="end"
                    aria-label="toggle password visibility"
                    sx={{ color: '#000' }}
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  sx={{
                    color: '#000',
                    '&.Mui-checked': { color: '#000' },
                  }}
                />
              }
              label="Remember me"
            />
            <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ color: '#000' }}>
              Forgot password?
            </Link>
          </Box>

          <Box sx={{ position: 'relative', mt: 0.5 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                '&:hover': { bgcolor: '#222222' },
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

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            No account?{' '}
            <Link component={RouterLink} to="/company/signup" underline="hover" sx={{ color: '#000' }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CompanyLoginPage;
