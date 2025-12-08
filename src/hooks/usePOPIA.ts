import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface POPIAConsent {
  id: string;
  user_id: string;
  consent_type: string;
  is_granted: boolean;
  granted_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface DataAccessRequest {
  id: string;
  user_id: string;
  request_type: string;
  status: string;
  reason: string | null;
  processed_at: string | null;
  notes: string | null;
  created_at: string;
}

export const CONSENT_TYPES = {
  data_collection: {
    label: 'Data Collection & Storage',
    description: 'Allow us to collect and store your personal information for platform functionality.',
    required: true,
  },
  profile_sharing: {
    label: 'Profile Sharing with Employers',
    description: 'Allow employers to view your profile when you apply for opportunities.',
    required: true,
  },
  ai_processing: {
    label: 'AI-Powered Features',
    description: 'Allow AI to analyze your profile for match scoring, CV enhancement, and career recommendations.',
    required: false,
  },
  marketing_communications: {
    label: 'Marketing Communications',
    description: 'Receive promotional emails about new features, opportunities, and platform updates.',
    required: false,
  },
  analytics: {
    label: 'Analytics & Improvement',
    description: 'Allow anonymized data usage to improve platform features and user experience.',
    required: false,
  },
  third_party_sharing: {
    label: 'Third-Party Integrations',
    description: 'Share data with partner services for enhanced functionality (e.g., calendar integrations).',
    required: false,
  },
};

export function usePOPIA() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: consents = [], isLoading: consentsLoading } = useQuery({
    queryKey: ['popia-consents', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('popia_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as POPIAConsent[];
    },
    enabled: !!user?.id,
  });

  const { data: dataRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['data-access-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('data_access_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DataAccessRequest[];
    },
    enabled: !!user?.id,
  });

  const getConsentStatus = (consentType: string): boolean => {
    const consent = consents.find(c => c.consent_type === consentType);
    return consent?.is_granted ?? false;
  };

  const updateConsentMutation = useMutation({
    mutationFn: async ({ consentType, isGranted }: { consentType: string; isGranted: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const existing = consents.find(c => c.consent_type === consentType);
      
      if (existing) {
        const { error } = await supabase
          .from('popia_consents')
          .update({
            is_granted: isGranted,
            granted_at: isGranted ? new Date().toISOString() : null,
            revoked_at: !isGranted ? new Date().toISOString() : null,
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('popia_consents')
          .insert({
            user_id: user.id,
            consent_type: consentType,
            is_granted: isGranted,
            granted_at: isGranted ? new Date().toISOString() : null,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popia-consents'] });
      toast({ title: 'Consent updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update consent', description: error.message, variant: 'destructive' });
    },
  });

  const submitDataRequestMutation = useMutation({
    mutationFn: async ({ requestType, reason }: { requestType: string; reason?: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('data_access_requests')
        .insert({
          user_id: user.id,
          request_type: requestType,
          reason,
          status: 'pending',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-access-requests'] });
      toast({ 
        title: 'Request submitted', 
        description: 'We will process your request within 30 days as per POPIA requirements.' 
      });
    },
    onError: (error) => {
      toast({ title: 'Failed to submit request', description: error.message, variant: 'destructive' });
    },
  });

  return {
    consents,
    consentsLoading,
    dataRequests,
    requestsLoading,
    getConsentStatus,
    updateConsent: updateConsentMutation.mutate,
    isUpdatingConsent: updateConsentMutation.isPending,
    submitDataRequest: submitDataRequestMutation.mutate,
    isSubmittingRequest: submitDataRequestMutation.isPending,
  };
}
