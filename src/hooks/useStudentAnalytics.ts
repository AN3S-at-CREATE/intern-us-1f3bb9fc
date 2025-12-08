import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useStudentAnalytics() {
  const { user } = useAuth();

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["student-applications-analytics", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("applications")
        .select("*, opportunities(title, company_name)")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: moduleCompletions, isLoading: modulesLoading } = useQuery({
    queryKey: ["student-module-completions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("module_completions")
        .select("*, modules(title, category, skills_covered)")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: studentSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ["student-skills-analytics", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("student_skills")
        .select("*, skills(name, category)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate application funnel
  const applicationFunnel = {
    saved: applications?.filter((a) => a.status === "saved").length || 0,
    applied: applications?.filter((a) => a.status === "pending" || a.status === "applied").length || 0,
    reviewed: applications?.filter((a) => a.status === "reviewing" || a.status === "reviewed").length || 0,
    interview: applications?.filter((a) => a.status === "interview").length || 0,
    offer: applications?.filter((a) => a.status === "offer").length || 0,
    hired: applications?.filter((a) => a.status === "hired").length || 0,
  };

  // Calculate applications over time (last 6 months)
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

  // Calculate match score distribution
  const matchScoreDistribution = (() => {
    const ranges = [
      { range: "0-20%", count: 0, color: "#ef4444" },
      { range: "21-40%", count: 0, color: "#f97316" },
      { range: "41-60%", count: 0, color: "#eab308" },
      { range: "61-80%", count: 0, color: "#22c55e" },
      { range: "81-100%", count: 0, color: "#00E5FF" },
    ];
    applications?.forEach((a) => {
      const score = a.match_score || 0;
      if (score <= 20) ranges[0].count++;
      else if (score <= 40) ranges[1].count++;
      else if (score <= 60) ranges[2].count++;
      else if (score <= 80) ranges[3].count++;
      else ranges[4].count++;
    });
    return ranges;
  })();

  // Skills by category
  const skillsByCategory = (() => {
    const categories: Record<string, number> = {};
    studentSkills?.forEach((ss) => {
      const category = ss.skills?.category || "Other";
      categories[category] = (categories[category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  })();

  // Module progress
  const moduleProgress = {
    completed: moduleCompletions?.filter((m) => m.completed_at).length || 0,
    inProgress: moduleCompletions?.filter((m) => !m.completed_at && m.progress_percent > 0).length || 0,
    notStarted: moduleCompletions?.filter((m) => m.progress_percent === 0).length || 0,
    avgScore: moduleCompletions?.filter((m) => m.quiz_score).reduce((acc, m) => acc + (m.quiz_score || 0), 0) / 
      (moduleCompletions?.filter((m) => m.quiz_score).length || 1) || 0,
  };

  // Average match score
  const avgMatchScore = applications?.filter((a) => a.match_score)
    .reduce((acc, a) => acc + (a.match_score || 0), 0) / 
    (applications?.filter((a) => a.match_score).length || 1) || 0;

  return {
    applications,
    moduleCompletions,
    studentSkills,
    applicationFunnel,
    applicationsOverTime,
    matchScoreDistribution,
    skillsByCategory,
    moduleProgress,
    avgMatchScore,
    isLoading: applicationsLoading || modulesLoading || skillsLoading,
  };
}
