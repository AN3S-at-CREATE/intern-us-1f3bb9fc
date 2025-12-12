import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_logo_url: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  description: string | null;
  location: string | null;
  bbbee_level: string | null;
  eti_eligible: boolean;
  is_verified: boolean;
  contact_email: string | null;
  contact_phone: string | null;
}

interface Opportunity {
  id: string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  location_type: string;
  opportunity_type: string;
  industry: string;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  application_deadline: string | null;
  ai_generated?: boolean;
  ai_review_status?: 'pending' | 'flagged' | 'approved';
  policy_flags?: string[];
  ee_status?: 'pass' | 'warn';
}

interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: string;
  match_score: number | null;
  match_reasons: string[] | null;
  applied_at: string;
  cover_letter: string | null;
  notes: string | null;
  opportunity?: Opportunity;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  student_profile?: {
    institution: string | null;
    field_of_study: string | null;
    headline: string | null;
    location: string | null;
  };
}

interface DashboardStats {
  activePostings: number;
  totalViews: number;
  totalApplications: number;
  pendingReviews: number;
  scheduledInterviews: number;
}

export function useEmployer() {
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activePostings: 0,
    totalViews: 0,
    totalApplications: 0,
    pendingReviews: 0,
    scheduledInterviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEmployerProfile = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('employer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching employer profile:', error);
      return null;
    }

    setEmployerProfile(data);
    return data;
  };

  const createEmployerProfile = async (profile: Partial<EmployerProfile>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('employer_profiles')
      .insert({
        user_id: user.id,
        company_name: profile.company_name || 'My Company',
        ...profile,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to create profile', variant: 'destructive' });
      return null;
    }

    setEmployerProfile(data);
    return data;
  };

  const updateEmployerProfile = async (updates: Partial<EmployerProfile>) => {
    if (!user || !employerProfile) return;

    const { data, error } = await supabase
      .from('employer_profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
      return;
    }

    setEmployerProfile(data);
    toast({ title: 'Profile updated successfully' });
  };

  const fetchOpportunities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching opportunities:', error);
      return;
    }

    const enriched = (data || []).map(item => ({
      ...item,
      ai_generated: item.ai_generated ?? false,
      ai_review_status: item.ai_review_status ?? 'approved',
      policy_flags: item.policy_flags ?? [],
      ee_status: item.ee_status ?? 'pass',
    }));

    setOpportunities(enriched);
    
    // Calculate stats
    const active = data?.filter(o => o.is_active) || [];
    setStats(prev => ({
      ...prev,
      activePostings: active.length,
      totalViews: data?.reduce((sum, o) => sum + (o.views_count || 0), 0) || 0,
      totalApplications: data?.reduce((sum, o) => sum + (o.applications_count || 0), 0) || 0,
    }));
  };

  const fetchApplications = async (opportunityId?: string) => {
    if (!user) return;

    // Get applications for employer's opportunities
    const myOpportunityIds = opportunities.map(o => o.id);
    if (myOpportunityIds.length === 0) return;

    let query = supabase
      .from('applications')
      .select('*')
      .in('opportunity_id', myOpportunityIds)
      .order('applied_at', { ascending: false });

    if (opportunityId) {
      query = query.eq('opportunity_id', opportunityId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return;
    }

    // Map applications with opportunity data
    const appsWithData: Application[] = (data || []).map(app => ({
      ...app,
      opportunity: opportunities.find(o => o.id === app.opportunity_id),
    }));
    
    setApplications(appsWithData);
    
    // Update pending reviews count
    const pending = appsWithData.filter(a => a.status === 'pending' || a.status === 'reviewed');
    const interviews = appsWithData.filter(a => a.status === 'interview');
    
    setStats(prev => ({
      ...prev,
      pendingReviews: pending.length,
      scheduledInterviews: interviews.length,
    }));
  };

  const createOpportunity = async (opportunity: Record<string, any>) => {
    if (!user) return;

    const reviewMeta = {
      ai_generated: opportunity.ai_generated ?? false,
      ai_review_status: opportunity.ai_review_status ?? 'approved',
      policy_flags: opportunity.policy_flags ?? [],
      ee_status: opportunity.ee_status ?? 'pass',
    };

    const { data, error } = await supabase
      .from('opportunities')
      .insert({
        employer_id: user.id,
        company_name: employerProfile?.company_name || 'Company',
        company_logo_url: employerProfile?.company_logo_url,
        title: opportunity.title,
        description: opportunity.description,
        location: opportunity.location,
        location_type: opportunity.location_type,
        opportunity_type: opportunity.opportunity_type,
        industry: opportunity.industry,
        requirements: opportunity.requirements,
        responsibilities: opportunity.responsibilities,
        stipend_min: opportunity.stipend_min,
        stipend_max: opportunity.stipend_max,
        duration_months: opportunity.duration_months,
        start_date: opportunity.start_date,
        application_deadline: opportunity.application_deadline,
        field_of_study: opportunity.field_of_study,
        min_qualification: opportunity.min_qualification,
        is_featured: opportunity.is_featured || false,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to create opportunity', description: error.message, variant: 'destructive' });
      return null;
    }

    toast({ title: 'Opportunity posted successfully!' });
    if (data) {
      setOpportunities(prev => [{ ...data, ...reviewMeta }, ...prev]);
    }
    return data ? { ...data, ...reviewMeta } : null;
  };

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    const { error } = await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Failed to update opportunity', variant: 'destructive' });
      return;
    }

    toast({ title: 'Opportunity updated' });
    await fetchOpportunities();
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ 
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (error) {
      toast({ title: 'Failed to update application', variant: 'destructive' });
      return;
    }

    toast({ title: `Application ${status}` });
    await fetchApplications();
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchEmployerProfile();
      await fetchOpportunities();
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (opportunities.length > 0) {
      fetchApplications();
    }
  }, [opportunities]);

  return {
    employerProfile,
    opportunities,
    applications,
    stats,
    isLoading,
    fetchEmployerProfile,
    createEmployerProfile,
    updateEmployerProfile,
    fetchOpportunities,
    fetchApplications,
    createOpportunity,
    updateOpportunity,
    updateApplicationStatus,
  };
}