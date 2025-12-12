import { useNavigate } from 'react-router-dom';
import { EmployerDashboardLayout } from '@/components/employer/EmployerDashboardLayout';
import { PostOpportunityWizard } from '@/components/employer/PostOpportunityWizard';
import { useEmployer } from '@/hooks/useEmployer';
import { Briefcase } from 'lucide-react';

export default function PostOpportunity() {
  const navigate = useNavigate();
  const { createOpportunity } = useEmployer();

  const handleComplete = async (data: Record<string, unknown>) => {
    const result = await createOpportunity(data);
    if (result) {
      navigate('/employer/opportunities');
    }
  };

  return (
    <EmployerDashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/5 border border-primary/30">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-foreground">Post New Opportunity</h1>
              <p className="text-muted-foreground">Create a job posting to attract top talent</p>
            </div>
          </div>
        </div>

        {/* Wizard */}
        <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
          <PostOpportunityWizard
            onComplete={handleComplete}
            onCancel={() => navigate('/employer')}
          />
        </div>
      </div>
    </EmployerDashboardLayout>
  );
}