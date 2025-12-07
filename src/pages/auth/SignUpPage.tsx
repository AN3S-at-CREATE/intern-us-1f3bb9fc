import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import logoDark from '@/assets/intern-us-logo-dark.svg';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: 'student',
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSuccess(true);
      toast({
        title: "Account created!",
        description: "Welcome to Intern US. Redirecting to your dashboard...",
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Welcome aboard! 🎉</h2>
          <p className="text-muted-foreground mt-2">Redirecting you to your dashboard...</p>
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
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
                Create your account
              </h1>
              <p className="text-muted-foreground mt-2">
                Start your journey to landing your dream internship
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="bg-input border-border"
                />
              </div>

              <Button type="submit" className="w-full btn-neon" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-card via-muted to-card items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 crystal-pattern opacity-30" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="font-heading text-4xl font-bold text-foreground text-glow">
            Launch Your Career
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Join thousands of students who've found their dream opportunities through Intern US
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="glass-card p-4">
              <p className="font-heading text-2xl font-bold text-primary">5K+</p>
              <p className="text-xs text-muted-foreground mt-1">Students</p>
            </div>
            <div className="glass-card p-4">
              <p className="font-heading text-2xl font-bold text-secondary">500+</p>
              <p className="text-xs text-muted-foreground mt-1">Companies</p>
            </div>
            <div className="glass-card p-4">
              <p className="font-heading text-2xl font-bold text-accent">92%</p>
              <p className="text-xs text-muted-foreground mt-1">Placement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
