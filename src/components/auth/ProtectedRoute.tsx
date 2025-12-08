import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('student' | 'employer' | 'university' | 'admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    if (!profile) {
      // If roles are required but profile is not loaded (or doesn't exist), show error state
      // This prevents users without a profile from accessing protected routes by skipping the role check
      // and avoids infinite redirect loops if we were to redirect to a protected dashboard
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't load your profile information. This might happen if your account setup wasn't completed.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            </div>
          </div>
        </div>
      );
    }

    if (!allowedRoles.includes(profile.role)) {
      // Redirect to appropriate dashboard based on role
      const roleRedirects = {
        student: '/dashboard',
        employer: '/employer/dashboard',
        university: '/university/dashboard',
        admin: '/admin/dashboard',
      };
      return <Navigate to={roleRedirects[profile.role] || '/dashboard'} replace />;
    }
  }

  return <>{children}</>;
}
