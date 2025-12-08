import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UniversityProfile {
  id: string;
  user_id: string;
  institution_name: string;
  institution_type: string;
  faculty: string | null;
  department: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WILPlacement {
  id: string;
  student_user_id: string;
  university_user_id: string;
  employer_name: string | null;
  opportunity_id: string | null;
  placement_type: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  hours_completed: number;
  hours_required: number;
  supervisor_name: string | null;
  supervisor_email: string | null;
  assessment_score: number | null;
  employer_feedback: string | null;
  student_feedback: string | null;
  risk_level: string;
  risk_factors: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  student_profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  student_details?: {
    institution: string;
    qualification: string;
    field_of_study: string;
  };
}

export interface DashboardStats {
  totalStudents: number;
  placedStudents: number;
  pendingPlacements: number;
  atRiskStudents: number;
  completedPlacements: number;
  placementRate: number;
}

export function useUniversity() {
  const { user } = useAuth();
  const [universityProfile, setUniversityProfile] = useState<UniversityProfile | null>(null);
  const [placements, setPlacements] = useState<WILPlacement[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    placedStudents: 0,
    pendingPlacements: 0,
    atRiskStudents: 0,
    completedPlacements: 0,
    placementRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUniversityProfile = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('university_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching university profile:', error);
      return null;
    }

    setUniversityProfile(data);
    return data;
  };

  const createUniversityProfile = async (profile: Partial<UniversityProfile>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('university_profiles')
      .insert({
        user_id: user.id,
        institution_name: profile.institution_name || '',
        institution_type: profile.institution_type || 'university',
        faculty: profile.faculty,
        department: profile.department,
        contact_email: profile.contact_email,
        contact_phone: profile.contact_phone,
        address: profile.address,
        website: profile.website,
        logo_url: profile.logo_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating university profile:', error);
      toast.error('Failed to create university profile');
      return null;
    }

    setUniversityProfile(data);
    toast.success('University profile created');
    return data;
  };

  const updateUniversityProfile = async (updates: Partial<UniversityProfile>) => {
    if (!user || !universityProfile) return null;

    const { data, error } = await supabase
      .from('university_profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating university profile:', error);
      toast.error('Failed to update university profile');
      return null;
    }

    setUniversityProfile(data);
    toast.success('University profile updated');
    return data;
  };

  const fetchPlacements = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('wil_placements')
      .select('*')
      .eq('university_user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching placements:', error);
      return [];
    }

    setPlacements(data || []);
    calculateStats(data || []);
    return data || [];
  };

  const calculateStats = (placementData: WILPlacement[]) => {
    const total = placementData.length;
    const placed = placementData.filter(p => p.status === 'placed' || p.status === 'active').length;
    const pending = placementData.filter(p => p.status === 'pending').length;
    const atRisk = placementData.filter(p => p.risk_level === 'high' || p.risk_level === 'medium').length;
    const completed = placementData.filter(p => p.status === 'completed').length;

    setStats({
      totalStudents: total,
      placedStudents: placed,
      pendingPlacements: pending,
      atRiskStudents: atRisk,
      completedPlacements: completed,
      placementRate: total > 0 ? (placed / total) * 100 : 0,
    });
  };

  const createPlacement = async (placement: Partial<WILPlacement>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('wil_placements')
      .insert({
        university_user_id: user.id,
        student_user_id: placement.student_user_id,
        employer_name: placement.employer_name,
        opportunity_id: placement.opportunity_id,
        placement_type: placement.placement_type || 'internship',
        status: placement.status || 'pending',
        start_date: placement.start_date,
        end_date: placement.end_date,
        hours_required: placement.hours_required || 0,
        supervisor_name: placement.supervisor_name,
        supervisor_email: placement.supervisor_email,
        notes: placement.notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating placement:', error);
      toast.error('Failed to create placement');
      return null;
    }

    await fetchPlacements();
    toast.success('Placement created successfully');
    return data;
  };

  const updatePlacement = async (id: string, updates: Partial<WILPlacement>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('wil_placements')
      .update(updates)
      .eq('id', id)
      .eq('university_user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating placement:', error);
      toast.error('Failed to update placement');
      return null;
    }

    await fetchPlacements();
    toast.success('Placement updated');
    return data;
  };

  const generateReport = async (reportType: string, dateRange?: { start: string; end: string }) => {
    try {
      const response = await supabase.functions.invoke('ai-wil-reporting', {
        body: {
          placements,
          reportType,
          institutionName: universityProfile?.institution_name,
          faculty: universityProfile?.faculty,
          dateRange,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([fetchUniversityProfile(), fetchPlacements()])
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return {
    universityProfile,
    placements,
    stats,
    isLoading,
    fetchUniversityProfile,
    createUniversityProfile,
    updateUniversityProfile,
    fetchPlacements,
    createPlacement,
    updatePlacement,
    generateReport,
  };
}
