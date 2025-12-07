import { useState, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { KanbanColumn } from '@/components/applications/KanbanColumn';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { ApplicationDetailDialog } from '@/components/applications/ApplicationDetailDialog';
import { ReminderPanel } from '@/components/applications/ReminderPanel';
import { useApplications, ApplicationWithOpportunity, ApplicationStatus } from '@/hooks/useApplications';

export default function ApplicationTracker() {
  const {
    applications,
    applicationsByStatus,
    upcomingReminders,
    isLoading,
    updateStatus,
    updateNotes,
    updateInterviewDate,
    withdrawApplication,
    STATUS_ORDER
  } = useApplications();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithOpportunity | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [draggedApplicationId, setDraggedApplicationId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(null);

  // Filter applications by search
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.opportunity?.title?.toLowerCase().includes(query) ||
      app.opportunity?.company_name?.toLowerCase().includes(query)
    );
  });

  const filteredByStatus = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = filteredApplications.filter(app => app.status === status);
    return acc;
  }, {} as Record<ApplicationStatus, ApplicationWithOpportunity[]>);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, applicationId: string) => {
    setDraggedApplicationId(applicationId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, newStatus: ApplicationStatus) => {
    e.preventDefault();
    if (draggedApplicationId) {
      updateStatus({ applicationId: draggedApplicationId, newStatus });
    }
    setDraggedApplicationId(null);
    setDragOverStatus(null);
  }, [draggedApplicationId, updateStatus]);

  const handleColumnDragEnter = useCallback((status: ApplicationStatus) => {
    setDragOverStatus(status);
  }, []);

  const handleViewDetails = (application: ApplicationWithOpportunity) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleWithdraw = (applicationId: string) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      withdrawApplication(applicationId);
    }
  };

  // Stats
  const totalApplications = applications.length;
  const activeApplications = applications.filter(a => !['rejected', 'hired'].includes(a.status)).length;
  const interviewCount = applicationsByStatus.interview?.length || 0;
  const offerCount = (applicationsByStatus.offer?.length || 0) + (applicationsByStatus.hired?.length || 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Application Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your applications from saved to hired
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalApplications}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeApplications}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{interviewCount}</p>
                <p className="text-xs text-muted-foreground">Interviews</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{offerCount}</p>
                <p className="text-xs text-muted-foreground">Offers</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Kanban Board / List View */}
          <div className="xl:col-span-3">
            {isLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {STATUS_ORDER.map((status) => (
                  <div key={status} className="min-w-[280px] space-y-3">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : viewMode === 'kanban' ? (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {STATUS_ORDER.map((status) => (
                    <div
                      key={status}
                      onDragEnter={() => handleColumnDragEnter(status)}
                      onDragLeave={() => setDragOverStatus(null)}
                    >
                      <KanbanColumn
                        status={status}
                        applications={filteredByStatus[status] || []}
                        onStatusChange={(appId, newStatus) => updateStatus({ applicationId: appId, newStatus })}
                        onViewDetails={handleViewDetails}
                        onWithdraw={handleWithdraw}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        isDragOver={dragOverStatus === status}
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="space-y-3">
                {filteredApplications.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <p className="text-muted-foreground">No applications found</p>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredApplications.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onStatusChange={(appId, newStatus) => updateStatus({ applicationId: appId, newStatus })}
                        onViewDetails={handleViewDetails}
                        onWithdraw={handleWithdraw}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && applications.length === 0 && (
              <GlassCard className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring opportunities and submit your first application!
                </p>
                <Button asChild>
                  <a href="/dashboard/opportunities">Browse Opportunities</a>
                </Button>
              </GlassCard>
            )}
          </div>

          {/* Sidebar - Reminders */}
          <div className="xl:col-span-1">
            <ReminderPanel 
              reminders={upcomingReminders}
              onViewApplication={handleViewDetails}
            />
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <ApplicationDetailDialog
        application={selectedApplication}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdateNotes={(appId, notes) => updateNotes({ applicationId: appId, notes })}
        onUpdateInterviewDate={(appId, date) => updateInterviewDate({ applicationId: appId, interviewDate: date })}
        onUpdateStatus={(appId, status, note) => updateStatus({ applicationId: appId, newStatus: status, note })}
        statusOrder={STATUS_ORDER}
      />
    </DashboardLayout>
  );
}
