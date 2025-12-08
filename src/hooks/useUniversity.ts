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

    // If no real placements, use demo data for showcase
    if (!data || data.length === 0) {
      const demoData = generateDemoPlacementData();
      setPlacements(demoData);
      calculateStats(demoData);
      return demoData;
    }

    setPlacements(data || []);
    calculateStats(data || []);
    return data || [];
  };

  // Generate demo placement data for universities without real data
  const generateDemoPlacementData = (): WILPlacement[] => {
    const baseDate = new Date();
    return [
      // Completed placements
      {
        id: 'demo-1',
        student_user_id: 'demo-student-1',
        university_user_id: user?.id || '',
        employer_name: 'Standard Bank',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'completed',
        start_date: '2024-01-15',
        end_date: '2024-06-15',
        hours_required: 480,
        hours_completed: 480,
        supervisor_name: 'Thandi Molefe',
        supervisor_email: 'thandi.molefe@standardbank.co.za',
        assessment_score: 85,
        employer_feedback: 'Outstanding work ethic and quick learner.',
        student_feedback: 'Excellent learning experience.',
        risk_level: 'low',
        risk_factors: [],
        notes: 'IT Department - Johannesburg',
        created_at: '2024-01-10',
        updated_at: '2024-06-15',
        student_profile: { first_name: 'Thabo', last_name: 'Mokoena', email: 'thabo@student.wits.ac.za' },
        student_details: { institution: 'University of the Witwatersrand', qualification: 'BSc IT', field_of_study: 'Information Technology' },
      },
      {
        id: 'demo-2',
        student_user_id: 'demo-student-2',
        university_user_id: user?.id || '',
        employer_name: 'Vodacom',
        opportunity_id: null,
        placement_type: 'wil',
        status: 'completed',
        start_date: '2024-02-01',
        end_date: '2024-07-31',
        hours_required: 520,
        hours_completed: 520,
        supervisor_name: 'Sipho Ndlovu',
        supervisor_email: 'sipho.ndlovu@vodacom.co.za',
        assessment_score: 92,
        employer_feedback: 'Exceptional technical skills.',
        student_feedback: 'Amazing mentorship.',
        risk_level: 'low',
        risk_factors: [],
        notes: 'Network Operations - Cape Town',
        created_at: '2024-01-25',
        updated_at: '2024-07-31',
        student_profile: { first_name: 'Naledi', last_name: 'Sithole', email: 'naledi@student.uct.ac.za' },
        student_details: { institution: 'University of Cape Town', qualification: 'BSc Computer Science', field_of_study: 'Computer Science' },
      },
      {
        id: 'demo-3',
        student_user_id: 'demo-student-3',
        university_user_id: user?.id || '',
        employer_name: 'Discovery Health',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'completed',
        start_date: '2024-03-01',
        end_date: '2024-08-31',
        hours_required: 480,
        hours_completed: 475,
        supervisor_name: 'Lerato Khumalo',
        supervisor_email: 'lerato.k@discovery.co.za',
        assessment_score: 78,
        employer_feedback: 'Reliable and shows initiative.',
        student_feedback: 'Good experience overall.',
        risk_level: 'low',
        risk_factors: [],
        notes: 'Claims Processing - Sandton',
        created_at: '2024-02-20',
        updated_at: '2024-08-31',
        student_profile: { first_name: 'Lungile', last_name: 'Dlamini', email: 'lungile@student.up.ac.za' },
        student_details: { institution: 'University of Pretoria', qualification: 'BCom Healthcare', field_of_study: 'Healthcare Management' },
      },
      {
        id: 'demo-4',
        student_user_id: 'demo-student-4',
        university_user_id: user?.id || '',
        employer_name: 'Sasol',
        opportunity_id: null,
        placement_type: 'learnership',
        status: 'completed',
        start_date: '2024-01-08',
        end_date: '2024-12-08',
        hours_required: 960,
        hours_completed: 960,
        supervisor_name: 'Johan van der Merwe',
        supervisor_email: 'jvandermerwe@sasol.com',
        assessment_score: 88,
        employer_feedback: 'Strong analytical skills.',
        student_feedback: 'Challenging but rewarding.',
        risk_level: 'low',
        risk_factors: [],
        notes: 'Chemical Engineering - Secunda',
        created_at: '2024-01-02',
        updated_at: '2024-12-08',
        student_profile: { first_name: 'John', last_name: 'Smith', email: 'john@student.nwu.ac.za' },
        student_details: { institution: 'North-West University', qualification: 'BEng Chemical', field_of_study: 'Chemical Engineering' },
      },
      // Active placements
      {
        id: 'demo-5',
        student_user_id: 'demo-student-5',
        university_user_id: user?.id || '',
        employer_name: 'MTN South Africa',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'active',
        start_date: '2024-09-01',
        end_date: '2025-02-28',
        hours_required: 480,
        hours_completed: 320,
        supervisor_name: 'Nomsa Dlamini',
        supervisor_email: 'nomsa.dlamini@mtn.co.za',
        assessment_score: null,
        employer_feedback: 'Making good progress.',
        student_feedback: null,
        risk_level: 'low',
        risk_factors: [],
        notes: 'Digital Marketing - Johannesburg',
        created_at: '2024-08-25',
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Zinhle', last_name: 'Nkosi', email: 'zinhle@student.ukzn.ac.za' },
        student_details: { institution: 'University of KwaZulu-Natal', qualification: 'BCom Marketing', field_of_study: 'Marketing' },
      },
      {
        id: 'demo-6',
        student_user_id: 'demo-student-6',
        university_user_id: user?.id || '',
        employer_name: 'Eskom',
        opportunity_id: null,
        placement_type: 'wil',
        status: 'active',
        start_date: '2024-08-15',
        end_date: '2025-02-15',
        hours_required: 520,
        hours_completed: 280,
        supervisor_name: 'Pieter Botha',
        supervisor_email: 'pbotha@eskom.co.za',
        assessment_score: null,
        employer_feedback: 'Student adjusting to workplace.',
        student_feedback: null,
        risk_level: 'medium',
        risk_factors: ['Attendance below 90%', 'Skill gaps identified'],
        notes: 'Power Systems - Megawatt Park',
        created_at: '2024-08-10',
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Siphelele', last_name: 'Mthembu', email: 'siphelele@student.uj.ac.za' },
        student_details: { institution: 'University of Johannesburg', qualification: 'BEng Electrical', field_of_study: 'Electrical Engineering' },
      },
      {
        id: 'demo-7',
        student_user_id: 'demo-student-7',
        university_user_id: user?.id || '',
        employer_name: 'Nedbank',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'active',
        start_date: '2024-10-01',
        end_date: '2025-03-31',
        hours_required: 480,
        hours_completed: 180,
        supervisor_name: 'Ayanda Nkosi',
        supervisor_email: 'ayanda.nkosi@nedbank.co.za',
        assessment_score: null,
        employer_feedback: 'Excellent communication skills.',
        student_feedback: null,
        risk_level: 'low',
        risk_factors: [],
        notes: 'Digital Banking - Sandton',
        created_at: '2024-09-25',
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Jessica', last_name: 'Wilson', email: 'jessica@student.sun.ac.za' },
        student_details: { institution: 'Stellenbosch University', qualification: 'BCom Finance', field_of_study: 'Finance' },
      },
      // At-risk placements
      {
        id: 'demo-8',
        student_user_id: 'demo-student-8',
        university_user_id: user?.id || '',
        employer_name: 'Transnet',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'active',
        start_date: '2024-07-01',
        end_date: '2024-12-31',
        hours_required: 480,
        hours_completed: 180,
        supervisor_name: 'Bongani Sithole',
        supervisor_email: 'bsithole@transnet.net',
        assessment_score: null,
        employer_feedback: 'Supervisor concerns about commitment.',
        student_feedback: null,
        risk_level: 'high',
        risk_factors: ['Attendance below 70%', 'Missing assignments', 'Personal challenges'],
        notes: 'Logistics - Durban',
        created_at: '2024-06-25',
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Buhle', last_name: 'Ngwenya', email: 'buhle@student.cput.ac.za' },
        student_details: { institution: 'Cape Peninsula University of Technology', qualification: 'Diploma Logistics', field_of_study: 'Logistics' },
      },
      {
        id: 'demo-9',
        student_user_id: 'demo-student-9',
        university_user_id: user?.id || '',
        employer_name: 'Old Mutual',
        opportunity_id: null,
        placement_type: 'wil',
        status: 'active',
        start_date: '2024-08-01',
        end_date: '2025-01-31',
        hours_required: 520,
        hours_completed: 160,
        supervisor_name: 'Michelle van Wyk',
        supervisor_email: 'mvanwyk@oldmutual.com',
        assessment_score: null,
        employer_feedback: 'WIL coordinator intervention required.',
        student_feedback: null,
        risk_level: 'high',
        risk_factors: ['Skills assessment failed', 'Low engagement', 'Considering withdrawal'],
        notes: 'Actuarial Science - Pinelands',
        created_at: '2024-07-25',
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Mohammed', last_name: 'Patel', email: 'mohammed@student.ufs.ac.za' },
        student_details: { institution: 'University of the Free State', qualification: 'BSc Actuarial', field_of_study: 'Actuarial Science' },
      },
      {
        id: 'demo-10',
        student_user_id: 'demo-student-10',
        university_user_id: user?.id || '',
        employer_name: 'Woolworths',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'active',
        start_date: '2024-09-01',
        end_date: '2025-02-28',
        hours_required: 480,
        hours_completed: 120,
        supervisor_name: 'David Mokoena',
        supervisor_email: 'dmokoena@woolworths.co.za',
        assessment_score: null,
        employer_feedback: 'Student struggling with commute.',
        student_feedback: null,
        risk_level: 'medium',
        risk_factors: ['Transport challenges', 'Late submissions'],
        notes: 'Buying Department - Cape Town',
        created_at: '2024-08-25',
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Precious', last_name: 'Mahlangu', email: 'precious@student.tut.ac.za' },
        student_details: { institution: 'Tshwane University of Technology', qualification: 'BTech Fashion', field_of_study: 'Fashion Design' },
      },
      // Pending placements
      {
        id: 'demo-11',
        student_user_id: 'demo-student-11',
        university_user_id: user?.id || '',
        employer_name: 'Clicks Group',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'pending',
        start_date: '2025-01-15',
        end_date: '2025-06-15',
        hours_required: 480,
        hours_completed: 0,
        supervisor_name: 'Fatima Patel',
        supervisor_email: 'fpatel@clicks.co.za',
        assessment_score: null,
        employer_feedback: null,
        student_feedback: null,
        risk_level: 'low',
        risk_factors: [],
        notes: 'Pharmacy - Pretoria',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Emma', last_name: 'Botha', email: 'emma@student.ru.ac.za' },
        student_details: { institution: 'Rhodes University', qualification: 'BPharm', field_of_study: 'Pharmacy' },
      },
      {
        id: 'demo-12',
        student_user_id: 'demo-student-12',
        university_user_id: user?.id || '',
        employer_name: 'Capitec Bank',
        opportunity_id: null,
        placement_type: 'wil',
        status: 'pending',
        start_date: '2025-02-01',
        end_date: '2025-07-31',
        hours_required: 520,
        hours_completed: 0,
        supervisor_name: 'Thabiso Mabaso',
        supervisor_email: 'tmabaso@capitecbank.co.za',
        assessment_score: null,
        employer_feedback: null,
        student_feedback: null,
        risk_level: 'low',
        risk_factors: [],
        notes: 'Software Development - Stellenbosch',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Lebogang', last_name: 'Moloi', email: 'lebogang@student.nmmu.ac.za' },
        student_details: { institution: 'Nelson Mandela University', qualification: 'BSc IT', field_of_study: 'Software Development' },
      },
      {
        id: 'demo-13',
        student_user_id: 'demo-student-13',
        university_user_id: user?.id || '',
        employer_name: 'Sanlam',
        opportunity_id: null,
        placement_type: 'learnership',
        status: 'pending',
        start_date: '2025-01-08',
        end_date: '2025-12-08',
        hours_required: 960,
        hours_completed: 0,
        supervisor_name: 'Lindiwe Zulu',
        supervisor_email: 'lzulu@sanlam.co.za',
        assessment_score: null,
        employer_feedback: null,
        student_feedback: null,
        risk_level: 'low',
        risk_factors: [],
        notes: 'Insurance Operations - Bellville',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_profile: { first_name: 'Sarah', last_name: 'van Rooyen', email: 'sarah@student.unisa.ac.za' },
        student_details: { institution: 'University of South Africa', qualification: 'BCom Insurance', field_of_study: 'Insurance' },
      },
      // Withdrawn
      {
        id: 'demo-14',
        student_user_id: 'demo-student-14',
        university_user_id: user?.id || '',
        employer_name: 'Shoprite',
        opportunity_id: null,
        placement_type: 'internship',
        status: 'withdrawn',
        start_date: '2024-06-01',
        end_date: '2024-11-30',
        hours_required: 480,
        hours_completed: 120,
        supervisor_name: 'Johannes Pretorius',
        supervisor_email: 'jpretorius@shoprite.co.za',
        assessment_score: null,
        employer_feedback: 'Regret losing this student.',
        student_feedback: 'Could not complete due to family relocation.',
        risk_level: 'high',
        risk_factors: ['Health issues', 'Relocated to another province'],
        notes: 'Retail Management - Brackenfell',
        created_at: '2024-05-25',
        updated_at: '2024-08-15',
        student_profile: { first_name: 'Khaya', last_name: 'Mdluli', email: 'khaya@student.wsu.ac.za' },
        student_details: { institution: 'Walter Sisulu University', qualification: 'BCom Retail', field_of_study: 'Retail Management' },
      },
    ];
  };

  const calculateStats = (placementData: WILPlacement[]) => {
    const total = placementData.length;
    const active = placementData.filter(p => p.status === 'active').length;
    const completed = placementData.filter(p => p.status === 'completed').length;
    const pending = placementData.filter(p => p.status === 'pending').length;
    const atRisk = placementData.filter(p => p.risk_level === 'high' || p.risk_level === 'medium').length;
    const placed = active + completed; // Both active and completed count as "placed"

    setStats({
      totalStudents: total,
      placedStudents: placed,
      pendingPlacements: pending,
      atRiskStudents: atRisk,
      completedPlacements: completed,
      placementRate: total > 0 ? ((placed + pending) / total) * 100 : 0,
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
