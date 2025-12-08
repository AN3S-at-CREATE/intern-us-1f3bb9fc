import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ClipboardList,
  Users,
  Compass,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import logoDark from '@/assets/intern-us-logo-dark.svg';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const studentNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'My Profile', href: '/dashboard/profile' },
  { icon: FileText, label: 'CV Builder', href: '/dashboard/cv-builder', badge: 'AI' },
  { icon: Briefcase, label: 'Opportunities', href: '/dashboard/opportunities' },
  { icon: ClipboardList, label: 'Applications', href: '/dashboard/applications' },
  { icon: Calendar, label: 'Events', href: '/dashboard/events' },
  { icon: GraduationCap, label: 'Skills', href: '/dashboard/skills' },
  { icon: Users, label: 'Community', href: '/dashboard/community' },
  { icon: Compass, label: 'Career Advisor', href: '/dashboard/career-advisor', badge: 'AI' },
  { icon: MessageSquare, label: 'Interview Prep', href: '/dashboard/interview', badge: 'AI' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
          isActive 
            ? "bg-primary/10 text-primary border border-primary/30" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        <span className="font-ui text-sm">{item.label}</span>
        {item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary/20 text-secondary border border-secondary/30">
            {item.badge}
          </span>
        )}
        {isActive && (
          <ChevronRight className="ml-auto h-4 w-4 text-primary" />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-full px-4">
          <Link to="/">
            <img src={logoDark} alt="Intern US" className="h-8" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 border-r border-border/50 bg-sidebar transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
            <Link to="/">
              <img src={logoDark} alt="Intern US" className="h-8" />
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-neon-gradient flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">
                  {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ui font-semibold text-foreground truncate">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Welcome!'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-1">
              {studentNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </ScrollArea>

          {/* AI Assistant Card */}
          <div className="p-4 border-t border-sidebar-border">
            <Link to="/dashboard/career-advisor" className="block">
              <div className="glass-card p-4 relative overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
                <Sparkles className="h-6 w-6 text-secondary mb-2" />
                <h4 className="font-ui font-semibold text-foreground text-sm">AI Career Advisor</h4>
                <p className="text-xs text-muted-foreground mt-1">Get personalized career guidance</p>
                <Button size="sm" className="mt-3 w-full btn-neon text-xs">
                  Get Started
                </Button>
              </div>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
