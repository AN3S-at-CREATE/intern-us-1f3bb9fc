import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployerDashboardLayout } from '@/components/employer/EmployerDashboardLayout';
import { OpportunityList } from '@/components/employer/OpportunityList';
import { useEmployer } from '@/hooks/useEmployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search,
  Filter,
  Briefcase,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OpportunitiesManagement() {
  const navigate = useNavigate();
  const { opportunities, isLoading, updateOpportunity } = useEmployer();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && opp.is_active) ||
      (statusFilter === 'paused' && !opp.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateOpportunity(id, { is_active: isActive });
  };

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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/5 border border-primary/30">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-foreground">Opportunities</h1>
              <p className="text-muted-foreground">{opportunities.length} total postings</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/employer/post-opportunity')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-card/50 border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities List */}
        <OpportunityList
          opportunities={filteredOpportunities}
          onToggleActive={handleToggleActive}
          onEdit={(id) => navigate(`/employer/opportunities/${id}/edit`)}
        />
      </div>
    </EmployerDashboardLayout>
  );
}