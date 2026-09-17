import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { LoadingSkeleton } from '../components/ui/Feedback';
import { ProtectedRoute, RoleProtectedRoute } from './ProtectedRoute';

const LandingPage = lazy(() => import('../pages/public/LandingPage').then((m) => ({ default: m.LandingPage })));
const PublicJobsPage = lazy(() => import('../pages/public/PublicJobsPage').then((m) => ({ default: m.PublicJobsPage })));
const PublicJobDetailsPage = lazy(() => import('../pages/public/PublicJobDetailsPage').then((m) => ({ default: m.PublicJobDetailsPage })));
const CompaniesPage = lazy(() => import('../pages/public/CompaniesPage').then((m) => ({ default: m.CompaniesPage })));
const AboutPage = lazy(() => import('../pages/public/AboutPage').then((m) => ({ default: m.AboutPage })));
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard').then((m) => ({ default: m.CandidateDashboard })));
const CandidateJobsPage = lazy(() => import('../pages/candidate/CandidateJobsPage').then((m) => ({ default: m.CandidateJobsPage })));
const JobDetailsPage = lazy(() => import('../pages/candidate/JobDetailsPage').then((m) => ({ default: m.JobDetailsPage })));
const CandidateApplicationsPage = lazy(() => import('../pages/candidate/CandidateApplicationsPage').then((m) => ({ default: m.CandidateApplicationsPage })));
const ApplicationDetailsPage = lazy(() => import('../pages/candidate/ApplicationDetailsPage').then((m) => ({ default: m.ApplicationDetailsPage })));
const CandidateProfilePage = lazy(() => import('../pages/candidate/CandidateProfilePage').then((m) => ({ default: m.CandidateProfilePage })));
const RecruiterDashboard = lazy(() => import('../pages/recruiter/RecruiterDashboard').then((m) => ({ default: m.RecruiterDashboard })));
const RecruiterJobsPage = lazy(() => import('../pages/recruiter/RecruiterJobsPage').then((m) => ({ default: m.RecruiterJobsPage })));
const RecruiterJobFormPage = lazy(() => import('../pages/recruiter/RecruiterJobFormPage').then((m) => ({ default: m.RecruiterJobFormPage })));
const RecruiterApplicationsPage = lazy(() => import('../pages/recruiter/RecruiterApplicationsPage').then((m) => ({ default: m.RecruiterApplicationsPage })));
const RecruiterInboxPage = lazy(() => import('../pages/recruiter/RecruiterInboxPage').then((m) => ({ default: m.RecruiterInboxPage })));
const RecruiterProfilePage = lazy(() => import('../pages/recruiter/RecruiterProfilePage').then((m) => ({ default: m.RecruiterProfilePage })));
const ErrorPage = lazy(() => import('../pages/system/ErrorPage').then((m) => ({ default: m.ErrorPage })));
const ForbiddenPage = lazy(() => import('../pages/system/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })));
const NotFoundPage = lazy(() => import('../pages/system/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function Fallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <LoadingSkeleton rows={3} />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<PublicJobsPage />} />
          <Route path="/jobs/:id" element={<PublicJobDetailsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/500" element={<ErrorPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleProtectedRoute role="CANDIDATE" />}>
            <Route element={<AppLayout />}>
              <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate/jobs" element={<CandidateJobsPage />} />
              <Route path="/candidate/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
              <Route path="/candidate/applications/:id" element={<ApplicationDetailsPage />} />
              <Route path="/candidate/profile" element={<CandidateProfilePage />} />
            </Route>
          </Route>

          <Route element={<RoleProtectedRoute role="RECRUITER" />}>
            <Route element={<AppLayout />}>
              <Route path="/recruiter" element={<Navigate to="/recruiter/dashboard" replace />} />
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
              <Route path="/recruiter/jobs/new" element={<RecruiterJobFormPage />} />
              <Route path="/recruiter/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/recruiter/jobs/:id/edit" element={<RecruiterJobFormPage />} />
              <Route path="/recruiter/jobs/:id/applications" element={<RecruiterApplicationsPage />} />
              <Route path="/recruiter/applications" element={<RecruiterInboxPage />} />
              <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
