import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmployerDashboardLayout } from '@/components/employer/EmployerDashboardLayout';
import { DashboardStats } from '@/components/employer/DashboardStats';
import { RecentApplications } from '@/components/employer/RecentApplications';
import { OpportunityList } from '@/components/employer/OpportunityList';
import { useEmployer } from '@/hooks/useEmployer';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  TrendingUp, 
  Award,
  Info,
  Loader2
} from 'lucide-react';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { 
    employerProfile, 
    opportunities, 
    applications, 
    stats, 
    isLoading,
    updateOpportunity,
    createEmployerProfile
  } = useEmployer();

  useEffect(() => {
    // Create employer profile if it doesn't exist
    if (!isLoading && !employerProfile) {
      createEmployerProfile({ company_name: 'My Company' });
    }
  }, [isLoading, employerProfile]);

  if (isLoading) {
    return (
      <EmployerDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EmployerDashboardLayout>
    );
  }

  return (
    <EmployerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">
              Welcome, {employerProfile?.company_name || 'Employer'}
            </h1>
            <p className="text-muted-foreground">Manage your opportunities and find the best talent</p>
          </div>
          <Button
            onClick={() => navigate('/employer/post-opportunity')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Quick Tips / Compliance Hints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h4 className="font-medium text-foreground text-sm">ETI Benefits</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Hiring youth aged 18-29 may qualify for Employment Tax Incentive benefits
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-accent shrink-0" />
              <div>
                <h4 className="font-medium text-foreground text-sm">B-BBEE Points</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Skills development spending can contribute to your B-BBEE scorecard
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-info/10 border border-info/30 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-info shrink-0" />
              <div>
                <h4 className="font-medium text-foreground text-sm">Section 12H</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Learnerships may qualify for additional tax deductions
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <RecentApplications 
              applications={applications}
              onViewAll={() => navigate('/employer/applicants')}
            />
          </div>

          {/* Active Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold font-heading text-foreground">Active Postings</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/employer/opportunities')}
                className="text-primary"
              >
                View All
              </Button>
            </div>

            {opportunities.filter(o => o.is_active).slice(0, 3).map((opp) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-card/80 border border-border/50"
              >
                <h4 className="font-medium text-foreground text-sm">{opp.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{opp.location}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{opp.views_count} views</span>
                  <span>{opp.applications_count} applications</span>
                </div>
              </motion.div>
            ))}

            {opportunities.filter(o => o.is_active).length === 0 && (
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                <p className="text-sm text-muted-foreground">No active postings</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => navigate('/employer/post-opportunity')}
                  className="mt-2 text-primary"
                >
                  Create your first posting
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployerDashboardLayout>
  );
}