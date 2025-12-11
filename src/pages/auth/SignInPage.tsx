import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import logoDark from '@/assets/intern-us-logo-dark.svg';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seedingUsers, setSeedingUsers] = useState(false);
  
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Determine redirect based on role
  const getRedirectPath = (userProfile: typeof profile) => {
    if (!userProfile) return '/dashboard';
    switch (userProfile.role) {
      case 'employer':
        return '/employer/dashboard';
      case 'university':
        return '/university/dashboard';
      case 'admin':
      case 'student':
      default:
        return '/dashboard';
    }
  };

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);

    if (error) {
      setLoading(false);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Wait briefly for profile to load
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Fetch the profile to determine redirect
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setLoading(false);
      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });
      
      const redirectPath = from || getRedirectPath(userProfile);
      navigate(redirectPath, { replace: true });
    } else {
      setLoading(false);
      navigate('/dashboard', { replace: true });
    }
  };

  // Seed demo admin users
  const seedAdminUsers = async () => {
    setSeedingUsers(true);
    const adminEmail = "admin@veralogix-group.org";
    const adminPassword = "admin";
    
    const usersToCreate = [
      { email: adminEmail, role: "student" as const, firstName: "Student", lastName: "Admin" },
      { email: `employer.${adminEmail}`, role: "employer" as const, firstName: "Employer", lastName: "Admin" },
      { email: `university.${adminEmail}`, role: "university" as const, firstName: "University", lastName: "Admin" },
    ];

    for (const userData of usersToCreate) {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: adminPassword,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error && !error.message.includes('already registered')) {
        console.error(`Error creating ${userData.role} user:`, error);
      }
    }

    setSeedingUsers(false);
    toast({
      title: "Demo accounts created!",
      description: "Use admin@veralogix-group.org (student), employer.admin@... (employer), or university.admin@... (university) with password 'admin'",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-card via-muted to-card items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 crystal-pattern opacity-30" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="font-heading text-4xl font-bold text-foreground text-glow">
            Welcome Back
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Continue your journey to finding the perfect opportunity
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <img src={logoDark} alt="Intern US" className="h-8" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground">
                Sign in to your account
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-input border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full btn-neon" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={seedAdminUsers}
              disabled={seedingUsers}
            >
              {seedingUsers ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating demo accounts...
                </>
              ) : (
                'Create Demo Accounts'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
