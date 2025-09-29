// src/pages/AboutPage.jsx
import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Avatar,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

/** Top hero image (swap with your asset/URL if you like) */
const heroImage =
  'https://assets.nationbuilder.com/standupforeurope/pages/21/attachments/original/1658141364/interns.png?1658141364';

/* ---------- Reusable bits ---------- */
const ReasonRow = ({ title, body }) => (
  <Stack spacing={1.25}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="h6" sx={{ fontWeight: 900 }}>
        {title}
      </Typography>
      <Avatar
        sx={(t) => ({
          bgcolor: t.palette.mode === 'dark' ? alpha('#00C853', 0.18) : alpha('#10b981', 0.12),
          color: t.palette.mode === 'dark' ? '#7CFFB0' : t.palette.success.main,
          width: 32,
          height: 32,
          boxShadow:
            t.palette.mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,.4)'
              : '0 2px 8px rgba(16,185,129,.25)',
        })}
      >
        <CheckCircleRoundedIcon fontSize="small" />
      </Avatar>
    </Stack>
    <Typography color="text.secondary">{body}</Typography>
  </Stack>
);

const MonoCard = ({ children, sx }) => (
  <Paper
    elevation={0}
    sx={(t) => ({
      p: 3,
      borderRadius: 3,
      height: '100%',
      bgcolor:
        t.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.02) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.88) 100%)',
      border: `1px solid ${t.palette.divider}`,
      ...sx,
    })}
  >
    {children}
  </Paper>
);

const BenefitCard = ({ icon, title, body }) => (
  <MonoCard>
    <Stack spacing={1.5}>
      <Avatar
        sx={(t) => ({
          width: 40,
          height: 40,
          bgcolor:
            t.palette.mode === 'dark'
              ? alpha(t.palette.primary.main, 0.18)
              : alpha(t.palette.primary.main, 0.10),
          color: t.palette.primary.main,
        })}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography color="text.secondary">{body}</Typography>
    </Stack>
  </MonoCard>
);

const DefinedRow = ({ title, body }) => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
      <Box sx={{ pr: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{body}</Typography>
      </Box>
      <Avatar
        sx={(t) => ({
          bgcolor: t.palette.mode === 'dark' ? alpha('#00C853', 0.18) : alpha('#10b981', 0.12),
          color: t.palette.mode === 'dark' ? '#7CFFB0' : t.palette.success.main,
          width: 34,
          height: 34,
          mt: 0.25,
        })}
      >
        <CheckCircleRoundedIcon fontSize="small" />
      </Avatar>
    </Stack>
  </Box>
);

/* ---------- Bottom CTA form ---------- */
function GetStartedCTA() {
  const [values, setValues] = React.useState({
    name: '',
    role: '',
    org: '',
    email: '',
    phone: '',
    note: '',
  });
  const [errors, setErrors] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const required = ['name', 'role', 'org', 'email', 'phone'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    required.forEach((k) => {
      if (!values[k]?.trim()) nextErrors[k] = 'Required';
    });
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = 'Invalid email';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    // TODO: send to backend
    setOpen(true);
    setValues({ name: '', role: '', org: '', email: '', phone: '', note: '' });
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Typography
          align="center"
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: '-.02em',
            mb: 1,
            fontFamily: `'Georgia', 'Times New Roman', serif`,
          }}
        >
          Ready to get started?
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          Learn how <b>Internships</b> can help you prosper
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Stack spacing={1.25}>
            <TextField
              label="Name *"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <Grid container spacing={1.25}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Role *"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  error={!!errors.role}
                  helperText={errors.role}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Organization *"
                  name="org"
                  value={values.org}
                  onChange={handleChange}
                  error={!!errors.org}
                  helperText={errors.org}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={1.25}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email *"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone number *"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Leave us a note"
              name="note"
              value={values.note}
              onChange={handleChange}
              multiline
              minRows={3}
              fullWidth
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={(t) => ({
                mt: 0.5,
                py: 1.25,
                fontWeight: 700,
                borderRadius: 1.5,
                bgcolor: t.palette.mode === 'dark' ? t.palette.common.white : t.palette.common.black,
                color: t.palette.mode === 'dark' ? t.palette.common.black : t.palette.common.white,
                '&:hover': {
                  bgcolor:
                    t.palette.mode === 'dark'
                      ? alpha(t.palette.common.white, 0.9)
                      : alpha(t.palette.common.black, 0.9),
                },
              })}
            >
              Submit
            </Button>
          </Stack>
        </Box>

        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
          <Alert onClose={() => setOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
            Thanks! We’ll be in touch shortly.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

/* ---------- Footer (InternLink) ---------- */
function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 3c.4 2.3 1.9 4 4.1 4.4v3.2c-1.5 0-3-.5-4.1-1.3v5.9c0 3.6-2.6 6.3-6.1 6.3S1.3 18.8 1.3 15.2 3.9 9 7.4 9c.6 0 1.2.1 1.8.3v3.3c-.6-.4-1.1-.6-1.8-.6-1.8 0-3 1.4-3 3.2s1.2 3.2 3 3.2 2.9-1.3 2.9-3.2V3h3.2Z" />
    </svg>
  );
}

const footerHeadingSx = (t) => ({
  fontSize: 12,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: alpha(t.palette.getContrastText(t.palette.background.default), 0.7),
  mb: 1.25,
  fontWeight: 700,
});

const footerLinkSx = (t) => ({
  color: alpha(t.palette.getContrastText(t.palette.background.default), 0.88),
  textDecoration: 'none',
  '&:hover': { color: t.palette.getContrastText(t.palette.background.default), textDecoration: 'underline' },
  fontSize: 14,
});

function FooterSection() {
  const t = useTheme();
  const footerBg =
    t.palette.mode === 'dark'
      ? t.palette.background.default
      : t.palette.common.black;

  return (
    <Box component="footer" sx={{ bgcolor: footerBg, color: t.palette.getContrastText(footerBg), pt: 8, pb: 6, mt: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="flex-start">
          {/* Logo + Social */}
          <Grid item xs={12} md={6} lg={5}>
            <Stack spacing={2.5}>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1 }} aria-label="InternLink">
                <Box component="span">intern</Box>
                <Box component="span" sx={{ px: 0.5 }}>•</Box>
                <Box component="span">link</Box>
              </Typography>

              <Stack direction="row" spacing={1.25}>
                <IconButton aria-label="LinkedIn" size="small" component={Link} href="https://www.linkedin.com" target="_blank" rel="noopener" sx={{ color: 'inherit' }}>
                  <LinkedInIcon />
                </IconButton>
                <IconButton aria-label="Instagram" size="small" component={Link} href="https://www.instagram.com" target="_blank" rel="noopener" sx={{ color: 'inherit' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton aria-label="TikTok" size="small" component={Link} href="https://www.tiktok.com" target="_blank" rel="noopener" sx={{ color: 'inherit' }}>
                  <TikTokIcon />
                </IconButton>
                <IconButton aria-label="YouTube" size="small" component={Link} href="https://www.youtube.com" target="_blank" rel="noopener" sx={{ color: 'inherit' }}>
                  <YouTubeIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Columns */}
          <Grid item xs={12} md={6} lg={7}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography sx={footerHeadingSx(t)}>Work experience. Anytime, anywhere.</Typography>
                <Stack spacing={1}>
                  <Link href="/student/login" sx={footerLinkSx(t)}>Students</Link>
                  <Link href="/company/login" sx={footerLinkSx(t)}>Companies</Link>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={footerHeadingSx(t)}>Resources</Typography>
                <Stack spacing={1}>
                  <Link href="/blog" sx={footerLinkSx(t)}>Blog</Link>
                  <Link href="/events" sx={footerLinkSx(t)}>Community Events</Link>
                  <Link href="/student/register" sx={footerLinkSx(t)}>Apply to be an Intern</Link>
                  <Link href="/newsletter" sx={footerLinkSx(t)}>Signup for Newsletter</Link>
                  <Link href="/help" sx={footerLinkSx(t)}>Help Center</Link>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={footerHeadingSx(t)}>About</Typography>
                <Stack spacing={1}>
                  <Link href="/about" sx={footerLinkSx(t)}>What is an Internship?</Link>
                  <Link href="/mission" sx={footerLinkSx(t)}>Mission and values</Link>
                  <Link href="/terms" sx={footerLinkSx(t)}>Terms of service</Link>
                  <Link href="/privacy" sx={footerLinkSx(t)}>Privacy policy</Link>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha(t.palette.getContrastText(footerBg), 0.12) }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ color: alpha(t.palette.getContrastText(footerBg), 0.8) }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} InternLink. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/terms" sx={footerLinkSx(t)}>Terms</Link>
            <Link href="/privacy" sx={footerLinkSx(t)}>Privacy</Link>
            <Link href="/contact" sx={footerLinkSx(t)}>Contact</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

/* ------------------------------ Page ------------------------------ */
export default function AboutPage() {
  const t = useTheme();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        py: { xs: 4, md: 8 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        {/* Hero */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            mb: { xs: 3, md: 5 },
            boxShadow:
              t.palette.mode === 'dark'
                ? '0 16px 40px rgba(0,0,0,.5)'
                : '0 16px 40px rgba(2,6,23,.12)',
          }}
        >
          <Box
            component="img"
            src={heroImage}
            alt="Students collaborating during an internship"
            sx={{
              display: 'block',
              width: '100%',
              height: { xs: 220, sm: 320, md: 420 },
              objectFit: 'cover',
              filter: 'none', // keep original colors
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                t.palette.mode === 'dark'
                  ? 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.35) 100%)'
                  : 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.12) 100%)',
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Internships section */}
        <MonoCard sx={{ mb: { xs: 3, md: 6 } }}>
          <Box
            sx={(t) => ({
              px: { xs: 2, md: 4 },
              py: 2.5,
              borderBottom: `1px solid ${t.palette.divider}`,
            })}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-.01em' }}>
              Internships are an innovative way to gain work experience—an alternative to traditional paths.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              Here’s why they stand out:
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ReasonRow
                  title="Flexible duration"
                  body="Internships can be part-time or full-time across weeks or months, letting participants explore multiple opportunities and career paths within the same year."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ReasonRow
                  title="Equitable access"
                  body="Internships aim to provide real experience to more students—not only those in competitive programs—reducing barriers to professional development."
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 900, mt: 4, mb: 2 }}>
              Key benefits
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <BenefitCard
                  icon={<SchoolRoundedIcon />}
                  title="For Students"
                  body="Gain meaningful experience, explore diverse career paths, and build competitive skills—all with flexibility. Hands-on exposure helps resumes stand out."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <BenefitCard
                  icon={<ApartmentRoundedIcon />}
                  title="For Companies"
                  body="Tap motivated talent on scoped projects and pipelines. With the right structure, internships deliver curated, high-quality outcomes without heavy overhead."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <BenefitCard
                  icon={<SchoolOutlinedIcon />}
                  title="For Higher Ed"
                  body="Add a robust career-readiness component to academic programs, equipping graduates with professional experience that enhances employability."
                />
              </Grid>
            </Grid>
          </Box>
        </MonoCard>

        {/* “An Internship defined” block */}
        <Box sx={{ mb: { xs: 1, md: 3 } }}>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} md={5}>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: '-.01em' }}>
                An Internship
                <br />
                defined
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography color="text.secondary">
                An Internship is a structured, professional experience guided by mentorship. Our platform enables
                students to collaborate on meaningful projects with companies and build in-demand skills so they can
                develop confidence and advance their careers.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <MonoCard>
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
              sx={(t) => ({
                borderRight: { md: `1px solid ${t.palette.divider}` },
                borderBottom: `1px solid ${t.palette.divider}`,
              })}
            >
              <DefinedRow
                title="Real-world projects"
                body="Internships go beyond classroom learning, letting students work on projects that solve real business problems and impact company outcomes."
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={(t) => ({
                borderBottom: `1px solid ${t.palette.divider}`,
              })}
            >
              <DefinedRow
                title="Managed expertise"
                body="We support every aspect of the internship journey—from project goals and candidate sourcing to training and feedback—so execution is seamless."
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={(t) => ({
                borderRight: { md: `1px solid ${t.palette.divider}` },
              })}
            >
              <DefinedRow
                title="Time-saving curation"
                body="Companies receive carefully selected, high-quality project outcomes that integrate with team goals, making internships an efficient resource."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DefinedRow
                title="Proven track record"
                body="With thousands of student interns contributing to projects for top brands, our programs deliver outstanding satisfaction for students and employers."
              />
            </Grid>
          </Grid>
        </MonoCard>

        {/* CTA */}
        <GetStartedCTA />
      </Container>

      {/* Footer */}
      <FooterSection />
    </Box>
  );
}
