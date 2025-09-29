// src/pages/auth/CompanySignupPage.jsx
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
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';

/* ---------- Helpers ---------- */
const initials = (name, email) => {
  const base = (name || email || 'C').split('@')[0];
  const parts = base.replace(/[^\w]/g, ' ').trim().split(/[._-\s]/).filter(Boolean);
  const a = parts[0]?.[0] ?? 'C';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase();
};

export default function CompanySignupPage() {
  const theme = useTheme(); // use global ThemeModeProvider if you have one
  const isDark = theme.palette.mode === 'dark';

  const { signup } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(true);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const avatarInitials = useMemo(() => initials(companyName, email), [companyName, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(
        email,
        password,
        {
          companyName,
          linkedin,
          verificationStatus: 'pending',
        },
        'companies'
      );
      navigate('/company/dashboard');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // shared textfield styling to get rounded inputs like the mock
  const roundedInput = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: isDark ? alpha('#0b1324', 0.6) : '#fff',
    },
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 70px)',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: { xs: 4, md: 6 },
        bgcolor: isDark ? theme.palette.background.default : '#ffffff', // white like the screenshot
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
        {/* -------- Left panel: image + copy -------- */}
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
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop&sat=-100"
            alt="Team planning roadmap"
            sx={{
              width: '100%',
              maxWidth: 460,
              height: 260,
              objectFit: 'cover',
              borderRadius: 3,
              border: '1px solid',
              borderColor: isDark ? alpha('#ffffff', 0.12) : alpha('#000000', 0.08),
              boxShadow: `0 24px 80px ${alpha('#000', isDark ? 0.35 : 0.15)}`,
              filter: 'grayscale(1)', // monochrome feel like your image
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

        {/* -------- Right panel: form -------- */}
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
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#000',  // solid black circle
                color: '#fff',    // white initial
                fontWeight: 800,
              }}
            >
              {avatarInitials}
            </Avatar>
            <Box>
              <Typography variant="h4">Register Company</Typography>
              <Typography variant="body2" color="text.secondary">
                Create your hiring workspace in a few steps
              </Typography>
            </Box>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            fullWidth
            sx={roundedInput}
          />

          <TextField
            label="Company Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            sx={roundedInput}
          />

          <TextField
            label="LinkedIn Profile Link"
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/company/your-company"
            fullWidth
            sx={roundedInput}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            helperText="Use 8+ characters with a mix of letters, numbers & symbols."
            sx={roundedInput}
          />

          <FormControlLabel
            sx={{ mt: 0.5 }}
            control={
              <Checkbox
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }}
              />
            }
            label="I agree to the Terms & Privacy Policy"
          />

          <Box sx={{ position: 'relative', mt: 0.5 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{
                py: 1.3,
                fontWeight: 900,
                borderRadius: 6,
                bgcolor: '#000',
                color: '#fff',
                '&:hover': { bgcolor: '#222' },
              }}
            >
              Create account
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
            Have an account?{' '}
            <Link component={RouterLink} to="/company/login" underline="hover" sx={{ color: '#000' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
