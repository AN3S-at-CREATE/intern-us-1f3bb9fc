import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmployerDashboardLayout } from '@/components/employer/EmployerDashboardLayout';
import { ApplicantCard } from '@/components/employer/ApplicantCard';
import { useEmployer } from '@/hooks/useEmployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  Users,
  Loader2,
  Eye,
  EyeOff,
  SortAsc,
  Star
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ApplicantManagement() {
  const [searchParams] = useSearchParams();
  const opportunityFilter = searchParams.get('opportunity');
  
  const { opportunities, applications, isLoading, updateApplicationStatus } = useEmployer();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [opportunityId, setOpportunityId] = useState(opportunityFilter || 'all');
  const [sortBy, setSortBy] = useState('date');
  const [blindMatchMode, setBlindMatchMode] = useState(false);

  const filteredApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      // Search filter
      const searchLower = search.toLowerCase();
      const nameMatch = `${app.profile?.first_name || ''} ${app.profile?.last_name || ''}`.toLowerCase().includes(searchLower);
      const institutionMatch = app.student_profile?.institution?.toLowerCase().includes(searchLower);
      
      // Status filter
      const statusMatch = statusFilter === 'all' || app.status === statusFilter;
      
      // Opportunity filter
      const oppMatch = opportunityId === 'all' || app.opportunity_id === opportunityId;
      
      return (nameMatch || institutionMatch || !search) && statusMatch && oppMatch;
    });

    // Sort
    if (sortBy === 'score') {
      filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    } else {
      filtered.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());
    }

    return filtered;
  }, [applications, search, statusFilter, opportunityId, sortBy]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: applications.length,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

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
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-foreground">Applicants</h1>
              <p className="text-muted-foreground">{applications.length} total applications</p>
            </div>
          </div>

          {/* Blind Match Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-2">
              {blindMatchMode ? <EyeOff className="h-4 w-4 text-accent" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm font-medium text-foreground">Blind Review</span>
            </div>
            <Switch 
              checked={blindMatchMode} 
              onCheckedChange={setBlindMatchMode}
              className="data-[state=checked]:bg-accent"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status 
                ? 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30' 
                : 'border-border/50'
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {statusCounts[status] || 0}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants..."
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          
          <Select value={opportunityId} onValueChange={setOpportunityId}>
            <SelectTrigger className="w-60 bg-card/50 border-border/50">
              <SelectValue placeholder="All Opportunities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Opportunities</SelectItem>
              {opportunities.map(opp => (
                <SelectItem key={opp.id} value={opp.id}>{opp.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-card/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">
                <span className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Latest First
                </span>
              </SelectItem>
              <SelectItem value="score">
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Best Match
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Top Matches Banner */}
        {sortBy === 'score' && filteredApplications.some(a => a.match_score && a.match_score >= 80) && (
          <div className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3">
            <Star className="h-5 w-5 text-success" />
            <div>
              <h4 className="font-medium text-success">AI-Ranked Top Matches</h4>
              <p className="text-sm text-muted-foreground">
                Candidates with 80%+ match score are highlighted based on skills, experience, and qualifications
              </p>
            </div>
          </div>
        )}

        {/* Applicants List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No applicants found</h3>
            <p className="text-muted-foreground">
              {applications.length === 0 
                ? 'Post an opportunity to start receiving applications'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <ApplicantCard
                key={app.id}
                application={app}
                onUpdateStatus={updateApplicationStatus}
                blindMatchMode={blindMatchMode}
              />
            ))}
          </div>
        )}
      </div>
    </EmployerDashboardLayout>
  );
}