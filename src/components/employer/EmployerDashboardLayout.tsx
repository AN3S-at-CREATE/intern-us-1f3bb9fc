import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Bell,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmployerDashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/employer', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/employer/opportunities', icon: Briefcase, label: 'Opportunities' },
  { path: '/employer/applicants', icon: Users, label: 'Applicants' },
  { path: '/employer/company', icon: Building2, label: 'Company Profile' },
];

export function EmployerDashboardLayout({ children }: EmployerDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}` 
    : user?.email?.substring(0, 2).toUpperCase() || 'E';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between bg-card/95 backdrop-blur-md border-b border-border/50">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-foreground">Employer Portal</span>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[10px] flex items-center justify-center text-secondary-foreground">3</span>
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-sidebar-border">
          <Link to="/employer" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading font-bold text-sidebar-foreground">Employer</span>
              <span className="block text-xs text-muted-foreground">Portal</span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Post Opportunity CTA */}
        <div className="p-4">
          <Button 
            onClick={() => navigate('/employer/post-opportunity')}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/30" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent transition-colors">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary/20 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {profile?.first_name || 'Employer'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/employer/company')}>
                <Building2 className="h-4 w-4 mr-2" />
                Company Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/employer/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}