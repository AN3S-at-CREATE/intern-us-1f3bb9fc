import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileCheck, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  Target,
  Users,
  Award,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface StudentProfile {
  profile_completeness: number;
  headline: string | null;
  institution: string | null;
  field_of_study: string | null;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('student_profiles')
        .select('profile_completeness, headline, institution, field_of_study')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setStudentProfile(data);
      }
      setLoading(false);
    };

    fetchStudentProfile();
  }, [user]);

  const stats = [
    { 
      label: 'Applications', 
      value: '0', 
      change: '+0 this week',
      icon: FileCheck,
      color: 'primary' as const
    },
    { 
      label: 'Profile Views', 
      value: '0', 
      change: '+0 this week',
      icon: Users,
      color: 'secondary' as const
    },
    { 
      label: 'Match Score', 
      value: '—', 
      change: 'Complete profile',
      icon: Target,
      color: 'accent' as const
    },
    { 
      label: 'Interviews', 
      value: '0', 
      change: 'Scheduled',
      icon: Clock,
      color: 'success' as const
    },
  ];

  const quickActions = [
    { label: 'Complete Profile', href: '/dashboard/profile', icon: Zap, description: 'Boost your visibility' },
    { label: 'Build Your CV', href: '/dashboard/cv-builder', icon: Sparkles, description: 'AI-powered builder' },
    { label: 'Browse Jobs', href: '/dashboard/opportunities', icon: Briefcase, description: 'Find opportunities' },
    { label: 'Practice Interviews', href: '/dashboard/interview', icon: Award, description: 'AI mock interviews' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
              {getGreeting()}, {profile?.first_name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {studentProfile?.headline || "Let's build your career today"}
            </p>
          </div>
          <Link to="/dashboard/opportunities">
            <Button className="btn-neon">
              <Briefcase className="h-4 w-4 mr-2" />
              Find Opportunities
            </Button>
          </Link>
        </div>

        {/* Profile Completion Alert */}
        {(studentProfile?.profile_completeness ?? 0) < 80 && (
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-warning/20 rounded-full blur-3xl" />
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-warning" />
                  <h3 className="font-heading font-semibold text-foreground">Complete Your Profile</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Profiles with 80%+ completion get 3x more views from employers
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={studentProfile?.profile_completeness ?? 0} className="flex-1 h-2" />
                  <span className="font-ui font-semibold text-foreground text-sm">
                    {studentProfile?.profile_completeness ?? 0}%
                  </span>
                </div>
              </div>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="whitespace-nowrap">
                  Complete Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5 hover-lift">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
              <p className="text-xs text-primary mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <div className="glass-card p-5 hover-lift group cursor-pointer h-full">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-ui font-semibold text-foreground mt-4">{action.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Match Suggestions */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <h2 className="font-heading font-semibold text-foreground">AI Job Matches</h2>
              </div>
              <Link to="/dashboard/opportunities">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-ui font-semibold text-foreground">No Matches Yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                Complete your profile and add skills to get AI-powered job recommendations
              </p>
              <Link to="/dashboard/profile">
                <Button className="mt-4" variant="outline">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent" />
              <h2 className="font-heading font-semibold text-foreground">Skill Insights</h2>
            </div>
            
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">
                Add skills to see personalized learning recommendations
              </p>
              <Link to="/dashboard/skills">
                <Button size="sm" className="mt-4" variant="outline">
                  Add Skills
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Your activity will appear here once you start applying
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
