// src/components/layout/Navbar.jsx
import * as React from 'react';
import { Link as RouterLink, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Container,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { useMonoTheme } from '../../theme/MonoThemeProvider';

/* ==== Link styles (bigger, clearer, but compact height) ==== */
const linkStyles = (t) => ({
  px: 1.25,
  py: 0.6,                         // slightly smaller vertical padding so nav feels less tall
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 'clamp(15px, 1.1vw, 18px)',  // larger, responsive font size
  letterSpacing: '.01em',
  color: t.palette.text.primary,
  textTransform: 'none',
  '&.active': {
    backgroundColor:
      t.palette.mode === 'dark'
        ? alpha('#FFFFFF', 0.1)
        : alpha('#000000', 0.08),
  },
  '&:hover': {
    backgroundColor:
      t.palette.mode === 'dark'
        ? alpha('#FFFFFF', 0.12)
        : alpha('#000000', 0.08),
  },
});

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggle } = useMonoTheme();
  const isDark = mode === 'dark';

  const [studentsEl, setStudentsEl] = React.useState(null);
  const [resourcesEl, setResourcesEl] = React.useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'students'
      ? '/student/dashboard'
      : user.role === 'companies'
      ? '/company/dashboard'
      : '/admin/dashboard';
  };

  const userInitials =
    user?.fullName?.[0] ||
    user?.companyName?.[0] ||
    user?.email?.[0] ||
    'U';

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={(t) => ({
        backgroundColor:
          t.palette.mode === 'dark'
            ? alpha(t.palette.background.default, 0.9)
            : alpha('#FFFFFF', 0.9),
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${t.palette.divider}`,
      })}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 60, gap: 1.5 }}>
          {/* Brand (larger but compact) */}
          <Typography
            component={RouterLink}
            to={getDashboardLink()}
            sx={(t) => ({
              mr: { xs: 2, md: 3 },
              fontWeight: 900,
              color: t.palette.text.primary,
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              fontSize: 'clamp(20px, 2vw, 26px)', // bigger brand text, responsive
            })}
          >
            InternLink
          </Typography>

          {/* Center nav */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.25, sm: 0.75, md: 1.25, lg: 1.5 },
              flex: 1,
            }}
          >
            {/* Students */}
            <Button
              endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={(e) => setStudentsEl(e.currentTarget)}
              sx={(t) => linkStyles(t)}
            >
              Students
            </Button>
            <Menu
              anchorEl={studentsEl}
              open={Boolean(studentsEl)}
              onClose={() => setStudentsEl(null)}
              PaperProps={{
                sx: (t) => ({
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 240,
                  border: `1px solid ${t.palette.divider}`,
                  '& .MuiMenuItem-root': {
                    fontSize: 'clamp(14px, 1vw, 16px)',
                    py: 1,
                  },
                }),
              }}
            >
              <MenuItem
                component={RouterLink}
                to="/student/login"
                onClick={() => setStudentsEl(null)}
              >
                Student Login
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/student/register"
                onClick={() => setStudentsEl(null)}
              >
                Create Student Account
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/student/resources"
                onClick={() => setStudentsEl(null)}
              >
                Student Resources
              </MenuItem>
            </Menu>

            {/* Companies */}
            <Button component={NavLink} to="/company/login" sx={(t) => linkStyles(t)}>
              Companies
            </Button>

            {/* Resources */}
            <Button
              endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={(e) => setResourcesEl(e.currentTarget)}
              sx={(t) => linkStyles(t)}
            >
              Resources
            </Button>
            <Menu
              anchorEl={resourcesEl}
              open={Boolean(resourcesEl)}
              onClose={() => setResourcesEl(null)}
              PaperProps={{
                sx: (t) => ({
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 220,
                  border: `1px solid ${t.palette.divider}`,
                  '& .MuiMenuItem-root': {
                    fontSize: 'clamp(14px, 1vw, 16px)',
                    py: 1,
                  },
                }),
              }}
            >
              <MenuItem
                component={RouterLink}
                to="/student/vlog"
                onClick={() => setResourcesEl(null)}
              >
                Blog
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/guides"
                onClick={() => setResourcesEl(null)}
              >
                Guides
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/faq"
                onClick={() => setResourcesEl(null)}
              >
                FAQ
              </MenuItem>
            </Menu>

            {/* About */}
            <Button component={NavLink} to="/about" sx={(t) => linkStyles(t)}>
              About
            </Button>

            {/* Optional center "Login" when logged out (kept from your original) */}
            {!user && (
              <Button component={NavLink} to="/login" sx={(t) => linkStyles(t)}>
                Login
              </Button>
            )}
          </Box>

          {/* Right: theme toggle + auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Tooltip title={isDark ? 'Switch to light' : 'Switch to dark'}>
              <IconButton
                onClick={toggle}
                color="inherit"
                aria-label="toggle color scheme"
                sx={(t) => ({
                  border: `1px solid ${t.palette.divider}`,
                  borderRadius: 2,
                  p: 0.75,
                })}
              >
                {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {userInitials}
                </Avatar>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: 'clamp(13px, .95vw, 15px)',
                    py: 0.6,
                    px: 1.4,
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              // Removed "Start Today" button as requested — right side stays clean when logged out
              <Box />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
