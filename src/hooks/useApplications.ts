import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type ApplicationStatus = 'saved' | 'applied' | 'reviewed' | 'interview' | 'offer' | 'hired' | 'rejected';

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
}

export interface ApplicationWithOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  cover_letter: string | null;
  match_score: number | null;
  match_reasons: string[] | null;
  notes: string | null;
  interview_date: string | null;
  status_history: StatusHistoryEntry[];
  opportunity: {
    id: string;
    title: string;
    company_name: string;
    company_logo_url: string | null;
    location: string;
    location_type: string;
    opportunity_type: string;
    stipend_min: number | null;
    stipend_max: number | null;
    application_deadline: string | null;
  } | null;
}

const STATUS_ORDER: ApplicationStatus[] = ['saved', 'applied', 'reviewed', 'interview', 'offer', 'hired'];

export function useApplications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities(
            id,
            title,
            company_name,
            company_logo_url,
            location,
            location_type,
            opportunity_type,
            stipend_min,
            stipend_max,
            application_deadline
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(app => ({
        ...app,
        status: app.status as ApplicationStatus,
        status_history: (app.status_history as unknown as StatusHistoryEntry[]) || []
      })) as ApplicationWithOpportunity[];
    },
    enabled: !!user?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      applicationId, 
      newStatus, 
      note 
    }: { 
      applicationId: string; 
      newStatus: ApplicationStatus; 
      note?: string;
    }) => {
      const app = applications.find(a => a.id === applicationId);
      if (!app) throw new Error('Application not found');

      const newHistoryEntry: StatusHistoryEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note
      };

      const updatedHistory = [...(app.status_history || []), newHistoryEntry];

      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          status_history: updatedHistory as unknown as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update status', description: error.message, variant: 'destructive' });
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes: string }) => {
      const { error } = await supabase
        .from('applications')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Notes saved' });
    },
    onError: (error) => {
      toast({ title: 'Failed to save notes', description: error.message, variant: 'destructive' });
    }
  });

  const updateInterviewDateMutation = useMutation({
    mutationFn: async ({ applicationId, interviewDate }: { applicationId: string; interviewDate: string | null }) => {
      const { error } = await supabase
        .from('applications')
        .update({ interview_date: interviewDate, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Interview date updated' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update interview date', description: error.message, variant: 'destructive' });
    }
  });

  const withdrawApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const app = applications.find(a => a.id === applicationId);
      if (!app) throw new Error('Application not found');

      const newHistoryEntry: StatusHistoryEntry = {
        status: 'rejected',
        timestamp: new Date().toISOString(),
        note: 'Application withdrawn by candidate'
      };

      const updatedHistory = [...(app.status_history || []), newHistoryEntry];

      const { error } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          status_history: updatedHistory as unknown as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({ title: 'Application withdrawn' });
    },
    onError: (error) => {
      toast({ title: 'Failed to withdraw application', description: error.message, variant: 'destructive' });
    }
  });

  // Group applications by status for Kanban view
  const applicationsByStatus = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = applications.filter(app => app.status === status);
    return acc;
  }, {} as Record<ApplicationStatus, ApplicationWithOpportunity[]>);

  // Get upcoming reminders (interviews in next 7 days, deadlines)
  const upcomingReminders = applications
    .filter(app => {
      if (app.interview_date) {
        const interviewDate = new Date(app.interview_date);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return interviewDate >= now && interviewDate <= weekFromNow;
      }
      return false;
    })
    .sort((a, b) => new Date(a.interview_date!).getTime() - new Date(b.interview_date!).getTime());

  return {
    applications,
    applicationsByStatus,
    upcomingReminders,
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    updateNotes: updateNotesMutation.mutate,
    updateInterviewDate: updateInterviewDateMutation.mutate,
    withdrawApplication: withdrawApplicationMutation.mutate,
    isUpdating: updateStatusMutation.isPending || updateNotesMutation.isPending || updateInterviewDateMutation.isPending,
    STATUS_ORDER
  };
}
