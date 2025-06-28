import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Component Imports
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routes/ProtectedRoute';

// Page Imports
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import StudentLoginPage from './pages/auth/StudentLoginPage';
import StudentSignupPage from './pages/auth/StudentSignupPage';
import CompanyLoginPage from './pages/auth/CompanyLoginPage';
import CompanySignupPage from './pages/auth/CompanySignupPage';
import StudentDashboard from './pages/student/StudentDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PostInternshipPage from './pages/company/PostInternshipPage';
import InternshipListPage from './pages/student/InternshipListPage';
import InternshipDetailPage from './pages/student/InternshipDetailPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import ViewApplicantsPage from './pages/company/ViewApplicantsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import AdminLoginPage from './pages/auth/AdminLoginPage'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<RoleSelectionPage />} />
            <Route path="/student/login" element={<StudentLoginPage />} />
            <Route path="/student/signup" element={<StudentSignupPage />} />
            <Route path="/company/login" element={<CompanyLoginPage />} />
            <Route path="/company/signup" element={<CompanySignupPage />} />
               <Route path="/admin/login" element={<AdminLoginPage />} />
            {/* --- Protected Student Routes --- */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['students']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['students']}><MyApplicationsPage /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['students']}><StudentProfilePage /></ProtectedRoute>} />

            {/* --- Protected Company Routes --- */}
            <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['companies']}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/post-internship" element={<ProtectedRoute allowedRoles={['companies']}><PostInternshipPage /></ProtectedRoute>} />
            <Route path="/company/internship/:internshipId/applicants" element={<ProtectedRoute allowedRoles={['companies']}><ViewApplicantsPage /></ProtectedRoute>} />
            <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['companies']}><CompanyProfilePage /></ProtectedRoute>} />

            {/* --- Protected Admin Routes --- */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admins']}><AdminDashboard /></ProtectedRoute>} />

            {/* --- Shared Protected Routes --- */}
            <Route path="/internships" element={<ProtectedRoute allowedRoles={['students', 'companies', 'admins']}><InternshipListPage /></ProtectedRoute>} />
            <Route path="/internship/:id" element={<ProtectedRoute allowedRoles={['students', 'companies', 'admins']}><InternshipDetailPage /></ProtectedRoute>} />

            {/* --- Fallback Route --- */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
