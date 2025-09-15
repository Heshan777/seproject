import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Stack,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

// --- Demo data (swap with API/Firestore later) ---
const FEATURED = {
  id: 'write-first-resume',
  title:
    'How to Write Your First Resume: A Step-by-Step Guide for College Students + Free Downloadable Resume Template',
  category: 'Job Search & Interview Prep',
  date: 'May 22, 2025',
  excerpt:
    "Writing your first resume can feel daunting, but breaking it down into clear steps ensures you’re highlighting your unique potential as a college student.",
  image:
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
};

const POSTS = [
  {
    id: 'nail-virtual-interview',
    title: '7 Tips to Nail Your Virtual Internship Interview',
    excerpt:
      'From lighting and audio to concise storytelling, here’s how to stand out on video.',
    date: 'May 10, 2025',
    category: 'Interview',
    image:
      'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'portfolio-mini-projects',
    title: 'Portfolio Mini-Projects: 5 Ideas You Can Build in a Weekend',
    excerpt:
      'Small, focused projects demonstrate your skills better than long descriptions.',
    date: 'Apr 29, 2025',
    category: 'Projects',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'cold-email-template',
    title: 'Cold Email Template That Actually Gets Replies',
    excerpt:
      'Personalization beats spray-and-pray. Use this framework to reach hiring managers.',
    date: 'Apr 17, 2025',
    category: 'Networking',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'first-week-checklist',
    title: 'First-Week Internship Checklist',
    excerpt:
      'Get set up fast, align expectations, and make a strong first impression.',
    date: 'Apr 1, 2025',
    category: 'Onboarding',
    image:
      'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'feedback-like-a-pro',
    title: 'How to Ask for Feedback (and Grow Faster)',
    excerpt:
      'A simple cadence for requesting and applying feedback that builds trust.',
    date: 'Mar 22, 2025',
    category: 'Career Growth',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'linkedin-101',
    title: 'LinkedIn 101: Make Your Profile Recruiter-Ready',
    excerpt:
      'Quick wins to upgrade your headline, summary, and featured section.',
    date: 'Mar 5, 2025',
    category: 'Branding',
    image:
      'https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?q=80&w=1200&auto=format&fit=crop',
  },
];

// --- Components ---
function FeaturedPost({ post }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: '1px solid rgba(2,6,23,.08)',
        bgcolor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: { xs: 260, sm: 360, md: 420 },
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={post.image}
              alt={post.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Stack spacing={1.75} justifyContent="center">
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Featured Article
            </Typography>

            <Chip
              label={post.category}
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 700,
                bgcolor: '#16a34a',
                color: '#fff',
                borderRadius: '999px',
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: '-.01em',
                fontFamily: `'Georgia','Times New Roman',serif`,
                lineHeight: 1.15,
              }}
            >
              {post.title}
            </Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {post.date.toUpperCase ? post.date.toUpperCase() : post.date}
            </Typography>

            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              {post.excerpt}
            </Typography>

            <Button
              component={RouterLink}
              to={`/student/vlog/${post.id}`}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                alignSelf: 'flex-start',
                borderRadius: 1.25,
                px: 2.25,
                py: 1.1,
                fontWeight: 800,
                bgcolor: '#111827',
                '&:hover': { bgcolor: '#000' },
              }}
            >
              Read More
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

function PostCard({ post }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid rgba(2,6,23,.08)',
        bgcolor: '#fff',
      }}
    >
      <CardActionArea component={RouterLink} to={`/student/vlog/${post.id}`} sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          image={post.image}
          alt={post.title}
          sx={{ height: 180, objectFit: 'cover' }}
        />
        <CardContent sx={{ p: 2.25 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: '#EEF2FF',
                color: '#4338CA',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {post.category[0]}
            </Avatar>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {post.category}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              • {post.date}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.2 }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// --- Page ---
export default function StudentVlog() {
  return (
    <Box sx={{ bgcolor: '#F7FAFC', minHeight: 'calc(100vh - 64px)', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="baseline" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '.12em' }}>
            Student Vlog
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-.02em' }}>
            Stories, Guides & Real-World Tips
          </Typography>
        </Stack>

        {/* Featured */}
        <FeaturedPost post={FEATURED} />

        {/* Post grid */}
        <Box sx={{ mt: { xs: 3, md: 5 } }}>
          <Grid container spacing={3}>
            {POSTS.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <PostCard post={p} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Bottom callout (optional) */}
        <Paper
          elevation={0}
          sx={{
            mt: { xs: 4, md: 6 },
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: '1px solid rgba(2,6,23,.08)',
            bgcolor: '#fff',
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                Want to share your story?
              </Typography>
              <Typography color="text.secondary">
                Submit your internship experience, tips, or project breakdowns to help other students succeed.
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                sx={{ fontWeight: 800, borderRadius: 1.25 }}
              >
                Pitch a Post
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
