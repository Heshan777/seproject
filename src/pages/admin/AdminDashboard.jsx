import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Skeleton,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Link,
  Divider,
  Grow,
  CardActionArea,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const normalizeUrl = (u) => (!u ? '' : /^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`);
const fmtDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : ts;
  try { return new Date(d).toLocaleDateString(); } catch { return '—'; }
};

const AdminDashboard = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selected, setSelected] = useState(null); // { type:'company'|'student', data:{} }
  const db = getFirestore();

  useEffect(() => {
    setLoading(true);
    const qs = [
      query(collection(db, 'companies'), where('verificationStatus', '==', 'pending')),
      collection(db, 'companies'),
      collection(db, 'students'),
    ];
    const unsubs = qs.map((q, i) =>
      onSnapshot(
        q,
        (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (i === 0) setPendingCompanies(data);
          if (i === 1) setAllCompanies(data);
          if (i === 2) setAllStudents(data);
        },
        () => {}
      )
    );
    const t = setTimeout(() => setLoading(false), 500);
    return () => { unsubs.forEach((u) => u()); clearTimeout(t); };
  }, [db]);

  useEffect(() => { setSelected(null); }, [currentTab]);

  useEffect(() => {
    if (loading) return;
    if (currentTab === 0 && pendingCompanies.length === 0) {
      if (allCompanies.length) setCurrentTab(1);
      else if (allStudents.length) setCurrentTab(2);
    }
  }, [loading, currentTab, pendingCompanies.length, allCompanies.length, allStudents.length]);

  const handleVerification = async (e, companyId, status) => {
    e.stopPropagation();
    try { await updateDoc(doc(db, 'companies', companyId), { verificationStatus: status }); } catch {}
  };
  const handleDelete = async (e, userId, userType) => {
    e.stopPropagation();
    if (window.confirm(`Delete this ${userType.slice(0, -1)} permanently?`)) {
      try { await deleteDoc(doc(db, userType, userId)); } catch { alert(`Failed to delete ${userType}.`); }
    }
  };

  const scrollToLists = () => {
    const el = document.getElementById('admin-lists');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpToTab = (index) => {
    setCurrentTab(index);
    if (index === 0 && pendingCompanies.length) setSelected({ type: 'company', data: pendingCompanies[0] });
    else if (index === 1 && allCompanies.length) setSelected({ type: 'company', data: allCompanies[0] });
    else if (index === 2 && allStudents.length) setSelected({ type: 'student', data: allStudents[0] });
    else setSelected(null);
    setTimeout(scrollToLists, 0);
  };

  const totalPending = pendingCompanies.length;
  const totalCompanies = allCompanies.length;
  const totalStudents = allStudents.length;

  const tableHeaders =
    currentTab === 2
      ? ['Student Name', 'Email', 'Actions']
      : currentTab === 1
      ? ['Company Name', 'Email', 'Status', 'Actions']
      : ['Company Name', 'Email', 'Actions'];

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)', py: 5 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1A2027' }}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Manage platform approvals, view details, and monitor key metrics.
        </Typography>

        {/* CLICKABLE STATS */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<HourglassTopOutlinedIcon color="warning" />}
              title="Pending Approvals"
              value={totalPending}
              loading={loading}
              onClick={() => jumpToTab(0)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<BusinessOutlinedIcon color="primary" />}
              title="Total Companies"
              value={totalCompanies}
              loading={loading}
              onClick={() => jumpToTab(1)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<SchoolOutlinedIcon color="secondary" />}
              title="Total Students"
              value={totalStudents}
              loading={loading}
              onClick={() => jumpToTab(2)}
            />
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden' }} id="admin-lists">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={(_e, v) => setCurrentTab(v)}>
              <Tab label={`Pending Approvals (${totalPending})`} />
              <Tab label={`All Companies (${totalCompanies})`} />
              <Tab label={`All Students (${totalStudents})`} />
            </Tabs>
          </Box>

          <Grid container>
            <Grid item xs={12} md={selected ? 8 : 12} sx={{ transition: 'width .2s ease' }}>
              <TabPanel value={currentTab} index={0}>
                <ClickableTable
                  headers={tableHeaders}
                  loading={loading}
                  users={pendingCompanies}
                  renderRow={(rows) =>
                    rows.map((company) => (
                      <TableRow
                        key={company.id}
                        hover
                        onClick={() => setSelected({ type: 'company', data: company })}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'primary.light' }}>{(company.companyName || 'C')[0]}</Avatar>
                            <Typography sx={{ fontWeight: 'bold' }}>{company.companyName || '—'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell><Typography color="text.secondary">{company.email || '—'}</Typography></TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button variant="contained" color="error" size="small" onClick={(e) => handleVerification(e, company.id, 'rejected')} startIcon={<CancelOutlinedIcon />}>Reject</Button>
                            <Button variant="contained" color="success" size="small" onClick={(e) => handleVerification(e, company.id, 'approved')} startIcon={<CheckCircleOutlineIcon />}>Approve</Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                />
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <ClickableTable
                  headers={tableHeaders}
                  loading={loading}
                  users={allCompanies}
                  renderRow={(rows) =>
                    rows.map((company) => (
                      <TableRow
                        key={company.id}
                        hover
                        onClick={() => setSelected({ type: 'company', data: company })}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'primary.light' }}>{(company.companyName || 'C')[0]}</Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 'bold' }}>{company.companyName || '—'}</Typography>
                              {company.website && (
                                <Link href={normalizeUrl(company.website)} target="_blank" rel="noopener noreferrer" underline="hover" variant="body2" color="text.secondary">
                                  {company.website}
                                </Link>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell><Typography color="text.secondary">{company.email || company.contactEmail || '—'}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={company.verificationStatus || 'N/A'}
                            size="small"
                            color={
                              company.verificationStatus === 'approved'
                                ? 'success'
                                : company.verificationStatus === 'pending'
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete Company">
                            <IconButton size="small" color="error" onClick={(e) => handleDelete(e, company.id, 'companies')}>
                              <DeleteForeverIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                />
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <ClickableTable
                  headers={tableHeaders}
                  loading={loading}
                  users={allStudents}
                  renderRow={(rows) =>
                    rows.map((student) => (
                      <TableRow
                        key={student.id}
                        hover
                        onClick={() => setSelected({ type: 'student', data: student })}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'secondary.light' }}>{(student.fullName || student.email || 'S')[0]}</Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 'bold' }}>{student.fullName || '—'}</Typography>
                              {student.education && <Typography variant="body2" color="text.secondary">{student.education}</Typography>}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell><Typography color="text.secondary">{student.email || '—'}</Typography></TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete Student">
                            <IconButton size="small" color="error" onClick={(e) => handleDelete(e, student.id, 'students')}>
                              <DeleteForeverIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                />
              </TabPanel>
            </Grid>

            <Grid item xs={12} md={4} sx={{ borderLeft: { md: selected ? '1px solid #eee' : 'none' } }}>
              <Grow in={Boolean(selected)} mountOnEnter unmountOnExit>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  {selected && (
                    <DetailsCard type={selected.type} data={selected.data} onClose={() => setSelected(null)} />
                  )}
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

const ClickableTable = ({ users, loading, headers, renderRow }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((h) => (
            <TableCell key={h} align={h === 'Actions' ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>
              {h}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {headers.map((h) => <TableCell key={h}><Skeleton /></TableCell>)}
            </TableRow>
          ))
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={headers.length} align="center" sx={{ py: 5 }}>
              <Typography color="text.secondary">No data to display in this section.</Typography>
            </TableCell>
          </TableRow>
        ) : (
          renderRow(users)
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const StatCard = ({ icon, title, value, loading, onClick }) => (
  <Card elevation={3} sx={{ borderRadius: '16px' }}>
    <CardActionArea onClick={onClick} sx={{ p: 1.5, borderRadius: '16px' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {React.cloneElement(icon, { sx: { fontSize: 40, mb: 1 } })}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {loading ? <Skeleton width="40%" sx={{ mx: 'auto' }} /> : value}
        </Typography>
        <Typography color="text.secondary">{title}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const DetailsCard = ({ type, data, onClose }) => {
  const isCompany = type === 'company';

  const social = useMemo(() => {
    const out = [];
    const add = (cond, label, url, icon) => cond && out.push({ label, url: normalizeUrl(url), icon });
    add(!!data.website, 'Website', data.website, <LanguageIcon />);
    add(!!data.linkedin, 'LinkedIn', data.linkedin, <LinkedInIcon />);
    if (isCompany) {
      add(!!data.facebook, 'Facebook', data.facebook, <FacebookIcon />);
      add(!!data.twitter, 'Twitter/X', data.twitter, <TwitterIcon />);
      add(!!data.instagram, 'Instagram', data.instagram, <InstagramIcon />);
      add(!!data.youtube, 'YouTube', data.youtube, <YouTubeIcon />);
    } else {
      add(!!data.github, 'GitHub', data.github, <GitHubIcon />);
    }
    return out;
  }, [data, isCompany]);

  return (
    <Card elevation={4} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.light' }}>
              {(isCompany ? data.companyName : data.fullName || data.email || 'U')?.[0]}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>
                {isCompany ? data.companyName || '—' : data.fullName || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">{data.email || '—'}</Typography>
            </Box>
          </Stack>
          <Button variant="text" onClick={onClose}>Close</Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {isCompany ? (
          <Stack spacing={1.5}>
            <Field label="Status">
              <Chip
                size="small"
                label={data.verificationStatus || 'N/A'}
                color={
                  data.verificationStatus === 'approved'
                    ? 'success'
                    : data.verificationStatus === 'pending'
                    ? 'warning'
                    : 'error'
                }
              />
            </Field>
            <Field label="Website">
              {data.website ? <Link href={normalizeUrl(data.website)} target="_blank" rel="noopener noreferrer">{data.website}</Link> : '—'}
            </Field>
            <Field label="Contact Email">
              {data.contactEmail ? <Link href={`mailto:${data.contactEmail}`}>{data.contactEmail}</Link> : '—'}
            </Field>
            <Field label="Description">{data.description || '—'}</Field>
            <Field label="Created">{fmtDate(data.createdAt)}</Field>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Field label="Education">{data.education || '—'}</Field>
            <Field label="Skills">
              {data.skills ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {`${data.skills}`.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                    <Chip key={s} label={s} variant="outlined" />
                  ))}
                </Stack>
              ) : '—'}
            </Field>
            <Field label="Website">
              {data.website ? <Link href={normalizeUrl(data.website)} target="_blank" rel="noopener noreferrer">{data.website}</Link> : '—'}
            </Field>
            <Field label="LinkedIn">
              {data.linkedin ? <Link href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">{data.linkedin}</Link> : '—'}
            </Field>
            <Field label="GitHub">
              {data.github ? <Link href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer">{data.github}</Link> : '—'}
            </Field>
            <Field label="Resume">
              {data.resumeUrl ? <Link href={data.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume (PDF)</Link> : '—'}
            </Field>
            <Field label="Created">{fmtDate(data.createdAt)}</Field>
          </Stack>
        )}

        {social.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Social Links</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {social.map((s) => (
                <Tooltip title={s.label} key={s.label}>
                  <IconButton component={Link} href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Field = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
      {label}
    </Typography>
    <Typography sx={{ mt: 0.5 }}>{children}</Typography>
  </Box>
);

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
    {value === index && <Box>{children}</Box>}
  </div>
);

export default AdminDashboard;
