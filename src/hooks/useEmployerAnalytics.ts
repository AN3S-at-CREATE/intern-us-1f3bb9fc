import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useEmployerAnalytics() {
  const { user } = useAuth();

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["employer-opportunities-analytics", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["employer-applications-analytics", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const opportunityIds = opportunities?.map((o) => o.id) || [];
      if (opportunityIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("applications")
        .select("*, opportunities(title, company_name)")
        .in("opportunity_id", opportunityIds)
        .order("applied_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!opportunities,
  });

  // Posting performance
  const postingPerformance = opportunities?.map((opp) => ({
    title: opp.title.length > 20 ? opp.title.substring(0, 20) + "..." : opp.title,
    views: opp.views_count,
    applications: opp.applications_count,
    conversionRate: opp.views_count > 0 ? ((opp.applications_count / opp.views_count) * 100).toFixed(1) : "0",
  })) || [];

  // Applications over time
  const applicationsOverTime = (() => {
    const months: { month: string; applications: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-ZA", { month: "short" });
      const count = applications?.filter((a) => {
        const appDate = new Date(a.applied_at);
        return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
      }).length || 0;
      months.push({ month: monthName, applications: count });
    }
    return months;
  })();

  // Application status distribution
  const statusDistribution = (() => {
    const statuses: Record<string, { count: number; color: string }> = {
      pending: { count: 0, color: "#eab308" },
      reviewing: { count: 0, color: "#3b82f6" },
      interview: { count: 0, color: "#8b5cf6" },
      offer: { count: 0, color: "#22c55e" },
      hired: { count: 0, color: "#00E5FF" },
      rejected: { count: 0, color: "#ef4444" },
    };
    applications?.forEach((a) => {
      const status = a.status || "pending";
      if (statuses[status]) {
        statuses[status].count++;
      }
    });
    return Object.entries(statuses).map(([name, { count, color }]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count,
      color,
    }));
  })();

  // Match score quality of applicants
  const applicantQuality = (() => {
    const highQuality = applications?.filter((a) => (a.match_score || 0) >= 70).length || 0;
    const mediumQuality = applications?.filter((a) => (a.match_score || 0) >= 40 && (a.match_score || 0) < 70).length || 0;
    const lowQuality = applications?.filter((a) => (a.match_score || 0) < 40).length || 0;
    return [
      { name: "High Fit (70%+)", value: highQuality, color: "#00E5FF" },
      { name: "Medium Fit (40-69%)", value: mediumQuality, color: "#eab308" },
      { name: "Low Fit (<40%)", value: lowQuality, color: "#ef4444" },
    ];
  })();

  // Time to hire calculation (mock for demo)
  const avgTimeToHire = 14; // days

  // Summary stats
  const stats = {
    totalViews: opportunities?.reduce((acc, o) => acc + o.views_count, 0) || 0,
    totalApplications: opportunities?.reduce((acc, o) => acc + o.applications_count, 0) || 0,
    activePostings: opportunities?.filter((o) => o.is_active).length || 0,
    avgConversionRate: opportunities?.length 
      ? (opportunities.reduce((acc, o) => acc + (o.views_count > 0 ? (o.applications_count / o.views_count) * 100 : 0), 0) / opportunities.length).toFixed(1)
      : "0",
    highQualityCandidates: applications?.filter((a) => (a.match_score || 0) >= 70).length || 0,
    avgMatchScore: applications?.filter((a) => a.match_score).reduce((acc, a) => acc + (a.match_score || 0), 0) / 
      (applications?.filter((a) => a.match_score).length || 1) || 0,
  };

  return {
    opportunities,
    applications,
    postingPerformance,
    applicationsOverTime,
    statusDistribution,
    applicantQuality,
    avgTimeToHire,
    stats,
    isLoading: opportunitiesLoading || applicationsLoading,
  };
}
