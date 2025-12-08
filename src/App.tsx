import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataSaverProvider } from "@/contexts/DataSaverContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";

// Public pages
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import NotFound from "./pages/NotFound";
import Install from "./pages/Install";

// Auth pages
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUp from "./pages/SignUp";

// Student Dashboard pages
import Dashboard from "./pages/Dashboard";
import ProfileBuilder from "./pages/dashboard/ProfileBuilder";
import CVBuilder from "./pages/dashboard/CVBuilder";
import InterviewSimulator from "./pages/dashboard/InterviewSimulator";
import Opportunities from "./pages/dashboard/Opportunities";
import SkillModules from "./pages/dashboard/SkillModules";
import ApplicationTracker from "./pages/dashboard/ApplicationTracker";
import CommunityHub from "./pages/dashboard/CommunityHub";
import CareerAdvisor from "./pages/dashboard/CareerAdvisor";
import Events from "./pages/dashboard/Events";
import NotificationSettingsPage from "./pages/dashboard/NotificationSettings";
import POPIATrustCenter from "./pages/dashboard/POPIATrustCenter";
import StudentAnalytics from "./pages/dashboard/StudentAnalytics";

// Employer pages
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostOpportunity from "./pages/employer/PostOpportunity";
import OpportunitiesManagement from "./pages/employer/OpportunitiesManagement";
import ApplicantManagement from "./pages/employer/ApplicantManagement";
import CompanyProfile from "./pages/employer/CompanyProfile";
import EmployerAnalytics from "./pages/employer/EmployerAnalytics";

// University pages
import UniversityDashboard from "./pages/university/UniversityDashboard";
import StudentPlacements from "./pages/university/StudentPlacements";
import AtRiskStudents from "./pages/university/AtRiskStudents";
import WILReports from "./pages/university/WILReports";
import UniversityAnalytics from "./pages/university/UniversityAnalytics";
import UniversityProfile from "./pages/university/UniversityProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataSaverProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineBanner />
        <BrowserRouter>
          <AuthProvider>
          <InstallPrompt />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/install" element={<Install />} />
            
            {/* Auth Routes */}
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignInPage />} />
            
            {/* Protected Student Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProfileBuilder />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/cv-builder" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CVBuilder />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/interview" element={
              <ProtectedRoute allowedRoles={['student']}>
                <InterviewSimulator />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/opportunities" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Opportunities />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/skills" element={
              <ProtectedRoute allowedRoles={['student']}>
                <SkillModules />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/applications" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ApplicationTracker />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/community" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CommunityHub />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/career-advisor" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CareerAdvisor />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/events" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings/notifications" element={
              <ProtectedRoute allowedRoles={['student']}>
                <NotificationSettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/privacy" element={
              <ProtectedRoute allowedRoles={['student']}>
                <POPIATrustCenter />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAnalytics />
              </ProtectedRoute>
            } />

            {/* Protected Employer Dashboard Routes */}
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/post-opportunity" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostOpportunity />
              </ProtectedRoute>
            } />
            <Route path="/employer/opportunities" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <OpportunitiesManagement />
              </ProtectedRoute>
            } />
            <Route path="/employer/applicants" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ApplicantManagement />
              </ProtectedRoute>
            } />
            <Route path="/employer/company" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <CompanyProfile />
              </ProtectedRoute>
            } />
            <Route path="/employer/analytics" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerAnalytics />
              </ProtectedRoute>
            } />

            {/* Protected University Dashboard Routes */}
            <Route path="/university/dashboard" element={
              <ProtectedRoute allowedRoles={['university']}>
                <UniversityDashboard />
              </ProtectedRoute>
            } />
            <Route path="/university" element={
              <ProtectedRoute allowedRoles={['university']}>
                <UniversityDashboard />
              </ProtectedRoute>
            } />
            <Route path="/university/placements" element={
              <ProtectedRoute allowedRoles={['university']}>
                <StudentPlacements />
              </ProtectedRoute>
            } />
            <Route path="/university/at-risk" element={
              <ProtectedRoute allowedRoles={['university']}>
                <AtRiskStudents />
              </ProtectedRoute>
            } />
            <Route path="/university/reports" element={
              <ProtectedRoute allowedRoles={['university']}>
                <WILReports />
              </ProtectedRoute>
            } />
            <Route path="/university/analytics" element={
              <ProtectedRoute allowedRoles={['university']}>
                <UniversityAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/university/profile" element={
              <ProtectedRoute allowedRoles={['university']}>
                <UniversityProfile />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </DataSaverProvider>
  </QueryClientProvider>
);

export default App;
