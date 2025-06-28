import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  GlobalStyles,
  ThemeProvider,
  createTheme
} from '@mui/material';

// Define a theme for consistency
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d6efd',
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
});

const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, 'students');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
             backgroundColor: '#f8f9fa',
             margin: 0,
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 70px)', // Adjust based on navbar height
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 420,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: '12px',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
            Student Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
              >
                Login
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            No account?{' '}
            <Link component={RouterLink} to="/student/signup" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default StudentLoginPage;