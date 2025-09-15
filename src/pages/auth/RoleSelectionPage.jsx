// src/pages/auth/RoleSelectionPage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography,
  GlobalStyles,
  Grid,
  Stack,
  Link,
  IconButton,
  SvgIcon,
  Skeleton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FaGoogle, FaMicrosoft, FaAmazon } from 'react-icons/fa';

/* ------------------------------ Inline TikTok ------------------------------ */
const TikTokIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24" aria-label="TikTok">
    <path d="M14.5 2v7.1a4.9 4.9 0 0 1-3.5-1.3v6.2a4.5 4.5 0 1 1-3-4.2v3.1a1.5 1.5 0 1 0 1 1.4V2h2.5c.5 1.7 2.4 3.2 4.8 3.3V8c-1.7 0-3.2-.5-4.3-1.4V2h2.5z" />
  </SvgIcon>
);

/** ---------- Logo Wall Assets (use your /public/brands svgs) ---------- */
const logoItems = [
  { alt: 'Unreal Engine', src: '/brands/unreal.svg' },
  { alt: 'HSBC', src: '/brands/hsbc.svg' },
  { alt: 'Home Depot', src: '/brands/homedepot.svg' },
  { alt: 'Snap', src: '/brands/snap.svg' },
  { alt: 'Beats', src: '/brands/beats.svg' },
  { alt: 'AT&T', src: '/brands/att.svg' },
  { alt: 'Expedia', src: '/brands/expedia.svg' },
  { alt: 'Macquarie', src: '/brands/macquarie.svg' },
  { alt: 'News Corp', src: '/brands/newscorp.svg' },
];

/* ------------------------- Logo image w/ graceful UX ----------------------- */
function LogoImg({ src, alt }) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const t = useTheme();

  const commonBoxSx = {
    height: { xs: 28, sm: 32, md: 36 },
    maxWidth: 180,
    display: 'grid',
    placeItems: 'center',
    px: 1.25,
    borderRadius: 999,
    border: `1px dashed ${t.palette.divider}`,
    bgcolor:
      t.palette.mode === 'dark'
        ? alpha('#FFFFFF', 0.06)
        : alpha('#000000', 0.04),
    boxShadow:
      t.palette.mode === 'dark'
        ? `inset 0 0 0 1px ${alpha('#FFFFFF', 0.06)}`
        : `inset 0 0 0 1px ${alpha('#000000', 0.06)}`,
    backdropFilter: 'saturate(110%)',
    transition:
      'transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease',
    opacity: 0.97,
    '&:hover': {
      transform: 'translateY(-2px)',
      opacity: 1,
      borderColor: t.palette.mode === 'dark' ? alpha('#FFFFFF', 0.35) : alpha('#000000', 0.35),
      bgcolor: t.palette.mode === 'dark' ? alpha('#FFFFFF', 0.10) : alpha('#000000', 0.06),
      boxShadow:
        t.palette.mode === 'dark'
          ? `0 8px 22px ${alpha('#000', 0.6)}`
          : `0 8px 22px ${alpha('#000', 0.12)}, 0 2px 8px ${alpha('#000', 0.08)}`,
    },
  };

  if (error) {
    return (
      <Box role="img" aria-label={alt} sx={commonBoxSx} title={alt}>
        <Typography variant="caption" sx={{ color: alpha(t.palette.text.primary, 0.75), fontWeight: 700 }}>
          {alt}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={commonBoxSx}>
      {!loaded && (
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{ width: '70%', height: 14, borderRadius: 99, opacity: 0.4 }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        sx={{
          display: loaded ? 'block' : 'none',
          height: { xs: 20, sm: 24, md: 28 },
          maxWidth: 150,
          objectFit: 'contain',
          // keep original colors
          filter: 'none',
        }}
      />
    </Box>
  );
}

/* --------------------------- Expert LogoWall (UI) -------------------------- */
function LogoWall() {
  const marqueeItems = React.useMemo(() => [...logoItems, ...logoItems], []);
  const t = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 7, md: 9 },
        background:
          t.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${t.palette.background.default} 0%, ${alpha('#FFFFFF', 0.02)} 55%, ${t.palette.background.default} 100%)`
            : `linear-gradient(180deg, ${t.palette.background.default} 0%, ${alpha('#000000', 0.02)} 55%, ${t.palette.background.default} 100%)`,
        overflow: 'hidden',
      }}
    >
      <GlobalStyles
        styles={{
          '@keyframes scrollLeft': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
          '@keyframes scrollRight': { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
          '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        }}
      />
      <Container maxWidth="lg">
        <Typography
          align="center"
          sx={{
            fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
            fontWeight: 800,
            letterSpacing: '-0.01em',
            fontSize: 'clamp(1.6rem, 1.2rem + 2vw, 2.2rem)',
            mb: 2,
            color: 'text.primary',
            animation: 'fadeUp 400ms ease both',
          }}
        >
          Delivering internships from startups
          <br /> to Fortune 1000 brands
        </Typography>

        <Stack alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label="Trusted by industry leaders"
            size="small"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.3,
              color: 'text.primary',
              background:
                'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)) padding-box, ' +
                'linear-gradient(90deg, currentColor, currentColor) border-box',
              border: '1px solid transparent',
            }}
          />
        </Stack>

        <Stack spacing={2.5} sx={{ mt: 2 }}>
          {/* Row 1 (left) */}
          <Box
            sx={{
              overflow: 'hidden',
              maskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0))',
              WebkitMaskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0))',
            }}
          >
            <Box
              role="list"
              sx={(t) => ({
                display: 'flex',
                gap: { xs: t.spacing(1.5), sm: t.spacing(2), md: t.spacing(2.5) },
                width: '200%',
                animation: 'scrollLeft 28s linear infinite',
                '&:hover': { animationPlayState: 'paused' },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              })}
            >
              {marqueeItems.map((item, idx) => (
                <Tooltip key={`row1-${idx}-${item.alt}`} title={item.alt}>
                  <Box role="listitem">
                    <LogoImg src={item.src} alt={item.alt} />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Row 2 (right) */}
          <Box
            sx={{
              overflow: 'hidden',
              maskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0))',
              WebkitMaskImage:
                'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0))',
            }}
          >
            <Box
              role="list"
              sx={(t) => ({
                display: 'flex',
                gap: { xs: t.spacing(1.5), sm: t.spacing(2), md: t.spacing(2.5) },
                width: '200%',
                animation: 'scrollRight 30s linear infinite',
                '&:hover': { animationPlayState: 'paused' },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              })}
            >
              {marqueeItems.map((item, idx) => (
                <Tooltip key={`row2-${idx}-${item.alt}`} title={item.alt}>
                  <Box role="listitem">
                    <LogoImg src={item.src} alt={item.alt} />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

/* ------------------------- HERO (rotating images) -------------------------- */
/* keep hero images in color */
const HERO_IMAGES = ['/images/hero-bg.jpg', '/images/Internship-1.jpg', '/images/one.jpg'];

/* your original daypart overlays retained */
const OVERLAYS = {
  morning: 'linear-gradient(rgba(255,255,255,.25), rgba(255,255,255,.10))',
  afternoon: 'linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.10))',
  evening: 'linear-gradient(rgba(0,0,0,.18), rgba(0,0,0,.35))',
  night: 'linear-gradient(rgba(0,0,0,.66), rgba(0,0,0,.66))',
};
const SLIDE_MS = 4000;

function getDaypart(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

function useDaypartOverlay() {
  const [daypart, setDaypart] = React.useState(getDaypart());
  React.useEffect(() => {
    const id = setInterval(() => setDaypart(getDaypart()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return OVERLAYS[daypart] || OVERLAYS.night;
}

function HeroSection() {
  const overlay = useDaypartOverlay();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const t = useTheme();

  React.useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const [index, setIndex] = React.useState(0);
  const [prevIndex, setPrevIndex] = React.useState(null);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setPrevIndex((p) => (p === null ? 0 : (p + 1) % HERO_IMAGES.length));
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const current = HERO_IMAGES[index];
  const previous = prevIndex === null ? null : HERO_IMAGES[prevIndex];

  return (
    <Box component="section" sx={{ position: 'relative', py: { xs: 5, sm: 7, md: 9 }, overflow: 'hidden' }}>
      {/* Background layers (cross-fading, FULL COLOR) */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        {previous && (
          <Box
            key={`prev-${previous}`}
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `${overlay}, url("${previous}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0,
              transition: 'opacity 600ms ease',
              // keep colors: no grayscale
              filter: 'none',
            }}
          />
        )}
        <Box
          key={`cur-${current}`}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `${overlay}, url("${current}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            transition: 'opacity 600ms ease',
            // keep colors: no grayscale
            filter: 'none',
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor:
              t.palette.mode === 'dark'
                ? alpha(t.palette.background.paper, 0.85)
                : alpha('#FFFFFF', 0.92),
            border: `1px solid ${t.palette.divider}`,
            backdropFilter: 'saturate(120%) blur(2px)',
          }}
        >
          <Chip
            label="Welcome"
            sx={{
              bgcolor: t.palette.mode === 'dark' ? alpha('#FFFFFF', 0.12) : alpha('#000000', 0.08),
              color: 'text.primary',
              fontWeight: 700,
              mb: 2,
              px: 1.25,
              height: 34,
              borderRadius: 2,
              border: `1px solid ${t.palette.divider}`,
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
              fontWeight: 800,
              letterSpacing: '-0.015em',
              fontSize: 'clamp(2.2rem, 4vw + 1rem, 3.8rem)',
              lineHeight: 1.08,
              mb: 1.5,
            }}
          >
            Connecting Students and Companies with Care
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '65ch', mb: 4, fontSize: '1.05rem', lineHeight: 1.65 }}
          >
            Choose your path to get started. Whether you’re seeking internships or hiring talent,
            InternLink makes the journey simple and clear.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/student/login"
              variant="contained"
              size="large"
              startIcon={<SchoolRoundedIcon />}
              endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                background: t.palette.mode === 'dark' ? '#1A1A1A' : '#000000',
                color: '#FFFFFF',
                boxShadow:
                  t.palette.mode === 'dark'
                    ? '0 10px 22px rgba(0,0,0,0.5)'
                    : '0 10px 22px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: t.palette.mode === 'dark' ? '#222222' : '#111111',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              I’m a Student
            </Button>

            <Button
              component={RouterLink}
              to="/company/login"
              variant="outlined"
              size="large"
              startIcon={<BusinessRoundedIcon />}
              endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderWidth: 2,
                borderColor: 'divider',
                color: 'text.primary',
                backgroundColor: 'transparent',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor:
                    t.palette.mode === 'dark'
                      ? alpha('#FFFFFF', 0.06)
                      : alpha('#000000', 0.04),
                  transform: 'translateY(-1px)',
                },
              }}
            >
              I’m a Company
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

/* ---------------------------------- FOOTER --------------------------------- */
function Footer() {
  const t = useTheme();
  return (
    <Box component="footer" sx={{ bgcolor: t.palette.background.default, color: t.palette.mode === 'dark' ? '#fff' : '#000' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} md={5}>
            <Typography
              sx={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: 32,
                lineHeight: 1,
              }}
            >
              InternLink
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: 'wrap' }}>
              <IconButton aria-label="LinkedIn" component="a" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="Instagram" component="a" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="TikTok" component="a" href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <TikTokIcon />
              </IconButton>
              <IconButton aria-label="YouTube" component="a" href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <YouTubeIcon />
              </IconButton>

              <IconButton aria-label="Google" component="a" href="https://about.google/" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <FaGoogle />
              </IconButton>
              <IconButton aria-label="Microsoft" component="a" href="https://www.microsoft.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <FaMicrosoft />
              </IconButton>
              <IconButton aria-label="Amazon" component="a" href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', bgcolor: alpha(t.palette.getContrastText(t.palette.background.default), 0.12) }}>
                <FaAmazon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={{ xs: 4, md: 6 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: '0.08em' }}>
                  Work experience.
                  <br /> Anytime, anywhere.
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                  <Link component={RouterLink} to="/student/login" underline="none" color="inherit">
                    Students
                  </Link>
                  <Link component={RouterLink} to="/company/login" underline="none" color="inherit">
                    Companies
                  </Link>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: '0.08em' }}>
                  Resources
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                  <Link component={RouterLink} to="/blog" underline="none" color="inherit">
                    Blog
                  </Link>
                  <Link component={RouterLink} to="/events" underline="none" color="inherit">
                    Community Events
                  </Link>
                  <Link component={RouterLink} to="/apply" underline="none" color="inherit">
                    Apply to be an Intern
                  </Link>
                  <Link component={RouterLink} to="/newsletter" underline="none" color="inherit">
                    Sign up for Newsletter
                  </Link>
                  <Link component={RouterLink} to="/help" underline="none" color="inherit">
                    Help Center
                  </Link>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: '0.08em' }}>
                  About
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                  <Link component={RouterLink} to="/what-is-internship" underline="none" color="inherit">
                    What is an Internship?
                  </Link>
                  <Link component={RouterLink} to="/mission" underline="none" color="inherit">
                    Mission and values
                  </Link>
                  <Link component={RouterLink} to="/terms" underline="none" color="inherit">
                    Terms of service
                  </Link>
                  <Link component={RouterLink} to="/privacy" underline="none" color="inherit">
                    Privacy policy
                  </Link>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            pt: 2,
            borderTop: `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            color: alpha(t.palette.text.primary, 0.7),
            fontSize: 14,
          }}
        >
          <span>© {new Date().getFullYear()} InternLink. All rights reserved.</span>
          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/privacy" underline="none" color="inherit">
              Privacy
            </Link>
            <Link component={RouterLink} to="/terms" underline="none" color="inherit">
              Terms
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

/* -------------------------------- MAIN PAGE -------------------------------- */
const RoleSelectionPage = () => {
  const t = useTheme();

  return (
    <>
      {/* page background follows global theme; hero stays in color */}
      <GlobalStyles styles={{ body: { margin: 0, backgroundColor: t.palette.background.default } }} />
      <HeroSection />
      <LogoWall />
      <Footer />
    </>
  );
};

export default RoleSelectionPage;
