import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Opportunity {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  description: string;
  requirements: string | null;
  location: string;
  location_type: string;
  opportunity_type: string;
  industry: string;
  field_of_study: string[] | null;
  stipend_min: number | null;
  stipend_max: number | null;
  duration_months: number | null;
  application_deadline: string | null;
  is_featured: boolean;
  created_at: string;
}

interface Filters {
  search: string;
  industry: string;
  location: string;
  opportunityType: string;
  locationType: string;
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const fetchOpportunities = useCallback(async (filters: Filters) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry);
      }
      if (filters.opportunityType && filters.opportunityType !== 'all') {
        query = query.eq('opportunity_type', filters.opportunityType);
      }
      if (filters.locationType && filters.locationType !== 'all') {
        query = query.eq('location_type', filters.locationType);
      }
      if (filters.location && filters.location !== 'all') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      const [savedRes, appliedRes] = await Promise.all([
        supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', user.id),
        supabase.from('applications').select('opportunity_id').eq('user_id', user.id)
      ]);

      if (savedRes.data) {
        setSavedIds(new Set(savedRes.data.map(s => s.opportunity_id)));
      }
      if (appliedRes.data) {
        setAppliedIds(new Set(appliedRes.data.map(a => a.opportunity_id)));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [user]);

  const toggleSave = async (opportunityId: string) => {
    if (!user) return;

    const isSaved = savedIds.has(opportunityId);
    
    if (isSaved) {
      await supabase
        .from('saved_opportunities')
        .delete()
        .eq('opportunity_id', opportunityId)
        .eq('user_id', user.id);
      setSavedIds(prev => {
        const next = new Set(prev);
        next.delete(opportunityId);
        return next;
      });
    } else {
      await supabase
        .from('saved_opportunities')
        .insert({ opportunity_id: opportunityId, user_id: user.id });
      setSavedIds(prev => new Set(prev).add(opportunityId));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return {
    opportunities,
    isLoading,
    savedIds,
    appliedIds,
    fetchOpportunities,
    toggleSave,
    refetch: fetchUserData,
  };
}
