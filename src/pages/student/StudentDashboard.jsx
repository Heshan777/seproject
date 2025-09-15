// src/pages/student/StudentDashboard.jsx
import React, { useMemo } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  Chip,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha, darken } from "@mui/material/styles";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const StudentDashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const userName = useMemo(() => {
    const n = user?.fullName || user?.displayName || user?.email || "User";
    return typeof n === "string" ? n : "User";
  }, [user]);

  const moreJobs = [
    {
      id: "g1",
      title: "Inter Full Stack Dev",
      company: "microsoft",
      category: "Technology",
      date: "8/26/2025",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g2",
      title: "Front End Developer",
      company: "microsoft",
      category: "Technology",
      date: "7/22/2025",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g3",
      title: "Back End Developer",
      company: "microsoft",
      category: "Technology",
      date: "6/28/2025",
      image:
        "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g4",
      title: "Software Quality Assurance",
      company: "oracle",
      category: "Design",
      date: "6/25/2025",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g5",
      title: "Project Manager",
      company: "oracle",
      category: "Business",
      date: "6/24/2025",
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g6",
      title: "Cyber Security Intern",
      company: "oracle",
      category: "Engineering",
      date: "6/20/2025",
      image:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "g7",
      title: "Graphic Design",
      company: "oracle",
      category: "Design",
      date: "6/18/2025",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  const pageBg =
    `radial-gradient(1000px 500px at -10% -10%, ${alpha(
      theme.palette.text.primary,
      0.06
    )} 0%, transparent 50%),` +
    `radial-gradient(900px 400px at 110% -10%, ${alpha(
      theme.palette.text.primary,
      0.04
    )} 0%, transparent 55%),` +
    `linear-gradient(180deg, ${
      theme.palette.background.default
    } 0%, ${
      theme.palette.mode === "light"
        ? "#F5F7FA"
        : darken(theme.palette.background.default, 0.06)
    } 100%)`;

  return (
    <>
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          py: { xs: 4, sm: 6 },
          background: pageBg,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Hero userName={userName} />
          <FeaturesGrid />
          <InternshipGrid jobs={moreJobs} />
        </Container>

        {/* Right floating actions */}
        <Stack
          spacing={1.5}
          sx={{
            position: "fixed",
            top: "50%",
            right: { xs: 12, md: 24 },
            transform: "translateY(-50%)",
            zIndex: 1200,
          }}
        >
          {/* INSTANT NAV: Edit Profile */}
          <Tooltip title="Edit Profile">
            <IconButton
              onClick={() => navigate("/student/profile")}
              sx={{
                width: 58,
                height: 58,
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: 4,
                "&:hover": { bgcolor: "#222" },
              }}
            >
              <PersonRoundedIcon />
            </IconButton>
          </Tooltip>

          {/* INSTANT NAV: Active Applications */}
          <Tooltip title="Active Applications">
            <IconButton
              onClick={() => navigate("/my-applications")}
              sx={{
                width: 58,
                height: 58,
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: 4,
                "&:hover": { bgcolor: "#222" },
              }}
            >
              <ArticleOutlinedIcon />
            </IconButton>
          </Tooltip>

          {/* INSTANT NAV: Role Selection */}
          <Tooltip title="Role Selection">
            <IconButton
              onClick={() => navigate("/role-selection")}
              sx={{
                width: 58,
                height: 58,
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: 4,
                "&:hover": { bgcolor: "#222" },
              }}
            >
              <HomeRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
};

/* ---------- Hero ---------- */
const Hero = ({ userName }) => {
  const theme = useTheme();
  const gradient = `linear-gradient(135deg, ${
    theme.palette.mode === "light" ? "#E8EEFF" : "#1e2235"
  } 0%, ${theme.palette.mode === "light" ? "#ECE8F9" : "#2c253b"} 100%)`;

  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        borderRadius: 4,
        p: { xs: 4, sm: 6 },
        mb: { xs: 4, sm: 6 },
        textAlign: "center",
        background: gradient,
        border: "1px solid",
        borderColor:
          theme.palette.mode === "light"
            ? alpha("#5E6AD2", 0.15)
            : alpha("#fff", 0.08),
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
          mb: 2,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        }}
      >
        Take the next step in your career
      </Typography>
      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 880,
          mx: "auto",
          mb: 3,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          lineHeight: 1.6,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        }}
      >
        {userName ? `${userName}, ` : ""}build real-world skills through
        meaningful projects, structured training, and community support — with
        personalization to help you grow.
      </Typography>
      <Button
        component={RouterLink}
        to="/internships"
        variant="contained"
        size="large"
        sx={{
          borderRadius: 3,
          fontWeight: 700,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
        }}
      >
        Start application
      </Button>
    </MotionPaper>
  );
};

/* ---------- Features ---------- */
const FeaturesGrid = () => (
  <Grid container spacing={3} sx={{ mb: { xs: 4, sm: 6 } }}>
    {[
      {
        icon: <SchoolOutlinedIcon />,
        title: "Structured training",
        desc: "Guided learning and real-world projects",
      },
      {
        icon: <ChecklistRtlOutlinedIcon />,
        title: "Resume-building",
        desc: "Pro-ready portfolio milestones",
      },
      {
        icon: <GroupsOutlinedIcon />,
        title: "Community",
        desc: "Mentorship and peer networking",
      },
      {
        icon: <VideoCameraFrontOutlinedIcon />,
        title: "Live sessions",
        desc: "Weekly talks & webinars",
      },
    ].map((f) => (
      <Grid item xs={12} sm={6} md={3} key={f.title}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              bgcolor: "action.hover",
              mb: 2,
            }}
          >
            {f.icon}
          </Box>
          <Typography fontWeight={800} sx={{ mb: 1, fontSize: "1.1rem" }}>
            {f.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {f.desc}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

/* ---------- Internships (non-clickable, uniform) ---------- */
const InternshipGrid = ({ jobs }) => (
  <Box sx={{ my: { xs: 4, sm: 6 } }}>
    <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
      Explore more internships
    </Typography>
    <Grid container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              height: 320,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="160"
                image={job.image}
                alt={job.title}
                sx={{ objectFit: "cover" }}
              />
              <Chip
                size="small"
                label={job.category}
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "background.paper",
                  fontWeight: 600,
                }}
              />
            </Box>
            <CardContent sx={{ flex: 1 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Avatar sx={{ width: 28, height: 28, bgcolor: "#000", color: "#fff" }}>
                  {job.company[0].toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {job.company}
                </Typography>
              </Stack>
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: "1rem" }}>
                {job.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {job.date}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default StudentDashboard;
