import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import NotFound from "./pages/NotFound";

// Auth pages
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import ProfileBuilder from "./pages/dashboard/ProfileBuilder";
import CVBuilder from "./pages/dashboard/CVBuilder";
import InterviewSimulator from "./pages/dashboard/InterviewSimulator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/get-started" element={<GetStarted />} />
            
            {/* Auth Routes */}
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
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
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
