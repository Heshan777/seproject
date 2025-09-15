import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Paper,
  Avatar,
  Stack,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const categories = ['All', 'Technology', 'Marketing', 'Design', 'Business', 'Engineering'];

const getCategoryChipColor = (category) => {
  switch (category) {
    case 'Technology':
      return 'primary';
    case 'Marketing':
      return 'secondary';
    case 'Design':
      return 'success';
    case 'Business':
      return 'info';
    case 'Engineering':
      return 'warning';
    default:
      return 'default';
  }
};

// Build a prioritized list of candidate image URLs for a job
const buildImageCandidates = (job) => {
  const direct = [job?.bannerUrl, job?.imageUrl, job?.companyLogo].filter(Boolean);

  const keyword = encodeURIComponent(
    `${job?.category || 'internship'} ${job?.title || ''} ${job?.companyName || ''}`
  );

  // 2) Unsplash featured (may be blocked on some networks)
  const unsplash = `https://source.unsplash.com/featured/640x360?${keyword}`;

  // 3) Picsum fallback seeded by job.id/title to keep it stable
  const seed = encodeURIComponent(job?.id || job?.title || 'internship');
  const picsum = `https://picsum.photos/seed/${seed}/640/360`;

  return [...direct, unsplash, picsum];
};

const InternshipListPage = () => {
  const [allInternships, setAllInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'internships'), orderBy('postedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAllInternships(jobs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const filteredInternships = useMemo(() => {
    let results = allInternships;

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      results = results.filter(
        (job) =>
          job.title?.toLowerCase().includes(s) ||
          job.companyName?.toLowerCase().includes(s) ||
          job.category?.toLowerCase().includes(s)
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter((job) => job.category === selectedCategory);
    }

    return results;
  }, [searchTerm, selectedCategory, allInternships]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  // Small helper to rotate through candidate images on error
  const handleImgError = useCallback((e) => {
    const el = e.currentTarget;
    const list = (el.dataset.candidates || '').split('|').filter(Boolean);
    let idx = Number(el.dataset.idx || 0);
    if (idx < list.length - 1) {
      idx += 1;
      el.dataset.idx = String(idx);
      el.src = list[idx];
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        py: { xs: 3, sm: 6 },
        background:
          'radial-gradient(1200px 600px at -10% 0%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 50%), radial-gradient(900px 500px at 110% 10%, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 60%), linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 50%, #F8FAFC 100%)'
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            mb: { xs: 3, sm: 5 },
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(136,136,136,0.15)',
            boxShadow:
              '0 10px 30px rgba(31,41,55,0.08), inset 0 0 1px rgba(255,255,255,0.35)'
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                Explore Opportunities
              </Typography>
              <Typography color="text.secondary">
                Find the perfect internship to kickstart your career.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Clear all filters">
                <IconButton onClick={clearFilters}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More filters (soon)">
                <span>
                  <IconButton disabled>
                    <TuneIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>

          <TextField
            fullWidth
            label="Search by title, company, or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              gap: 1,
              flexWrap: 'wrap',
              mt: 2,
              overflowX: { xs: 'auto', sm: 'visible' },
              pb: { xs: 0.5, sm: 0 },
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {categories.map((category) => {
              const color = getCategoryChipColor(category);
              return (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={color}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 999,
                    px: 0.5,
                    transition: 'all .15s ease',
                    ...(selectedCategory !== category ? { color: `${color}.main` } : {}),
                  }}
                />
              );
            })}
          </Stack>
        </Paper>

        {/* Cards Grid */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="stretch">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          ) : filteredInternships.length > 0 ? (
            filteredInternships.map((job) => {
              const candidates = buildImageCandidates(job);
              const first = candidates[0];

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={job.id} sx={{ display: 'flex' }}>
                  <Paper
                    component={RouterLink}
                    to={`/internship/${job.id}`}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      overflow: 'hidden',
                      bgcolor: 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(136,136,136,0.15)',
                      transition: 'transform .2s ease, box-shadow .2s ease',
                      boxShadow:
                        '0 10px 24px rgba(31,41,55,0.06), inset 0 0 1px rgba(255,255,255,0.6)',
                      '&:hover': { transform: 'translateY(-6px)', boxShadow: 8 }
                    }}
                  >
                    {/* Image header (16:9) using real <img> with fallbacks */}
                    <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#eaeaea' }}>
                      <img
                        src={first}
                        alt={job.title || 'Internship'}
                        onError={handleImgError}
                        data-candidates={candidates.join('|')}
                        data-idx="0"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* gradient overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.0) 100%)'
                        }}
                      />
                      {/* category chip */}
                      <Box sx={{ position: 'absolute', left: 12, bottom: 12 }}>
                        <Chip
                          label={job.category || 'Internship'}
                          color={getCategoryChipColor(job.category)}
                          size="small"
                          sx={{ bgcolor: 'rgba(135, 112, 112, 0.92)', backdropFilter: 'blur(4px)' }}
                        />
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.25, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Avatar sx={{ bgcolor: 'primary.light', fontWeight: 700, width: 32, height: 32 }}>
                          {job.companyName?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {job.companyName || 'Company'}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 900,
                          color: 'text.primary',
                          lineHeight: 1.25,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textTransform: 'capitalize',
                          minHeight: 42
                        }}
                      >
                        {job.title}
                      </Typography>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary">
                          {job.postedAt?.toDate
                            ? job.postedAt.toDate().toLocaleDateString()
                            : job.postedAt || '—'}
                        </Typography>
                        {job.location && (
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {job.location}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  p: { xs: 4, sm: 8 },
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(136,136,136,0.15)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  No Internships Found
                </Typography>
                <Typography color="text.secondary">
                  Try adjusting your search or category filters.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default InternshipListPage;
