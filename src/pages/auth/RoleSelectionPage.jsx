import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  GlobalStyles,
  ThemeProvider,
  createTheme,
  Slide,
} from '@mui/material';

// 1. Define a theme to consistently use brand colors and fonts
const theme = createTheme({
  palette: {
    primary: {
      main: '#764ba2',
    },
    secondary: {
      main: '#667eea',
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    h2: {
      fontWeight: 700,
      fontSize: '2.8rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h6: {
      fontWeight: 300,
    }
  },
});

const RoleSelectionPage = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* 2. GlobalStyles for a seamless background */}
      <GlobalStyles
        styles={{
          'body': {
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             height: '100vh',
             margin: 0,
          },
          '#root': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          },
          'main': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 0, /* Override other padding styles */
          }
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        {/* 3. A subtle slide-in animation for a premium feel */}
        <Slide direction="up" in={true} mountOnEnter timeout={500}>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, sm: 6 },
              maxWidth: 550,
              width: '100%',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              color: '#fff',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ textShadow: '1px 1px 4px rgba(0,0,0,0.25)' }}
            >
              Welcome to InternLink
            </Typography>
            <Typography variant="h6" component="p" sx={{ mb: 6, opacity: 0.9 }}>
              Connecting Students with Companies
            </Typography>

            {/* 4. Improved button hierarchy and responsive layout */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
              <Button
                component={RouterLink}
                to="/student/login"
                variant="contained"
                size="large"
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: '50px',
                  backgroundColor: '#fff',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#fff',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                I am a Student
              </Button>
              <Button
                component={RouterLink}
                to="/company/login"
                variant="outlined"
                size="large"
                 sx={{
                  flex: 1,
                  py: 1.5,
                  borderColor: '#fff',
                  color: '#fff',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s ease, background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#fff',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                I am a Company
              </Button>
            </Box>
          </Paper>
        </Slide>
      </Box>
    </ThemeProvider>
  );
};

export default RoleSelectionPage;