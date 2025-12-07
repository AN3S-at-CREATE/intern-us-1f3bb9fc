import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration_minutes: number;
  skills_covered: string[] | null;
  content: any;
  thumbnail_url: string | null;
}

interface ModuleCompletion {
  id: string;
  module_id: string;
  progress_percent: number;
  completed_at: string | null;
  started_at: string;
  quiz_score: number | null;
  time_spent_minutes: number | null;
}

interface SkillGapAnalysis {
  targetRole: string;
  readinessScore: number;
  summary: string;
  skillGaps: Array<{
    skill: string;
    importance: string;
    currentLevel: string;
    requiredLevel: string;
    recommendation: string;
  }>;
  strengths: string[];
  recommendedModules: Array<{
    title: string;
    priority: string;
    reason: string;
  }>;
  careerTips: string[];
}

export function useSkillModules() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch all modules
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Module[];
    },
  });

  // Fetch user's completions
  const { data: completions = [], isLoading: completionsLoading } = useQuery({
    queryKey: ['module_completions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('module_completions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as ModuleCompletion[];
    },
    enabled: !!user?.id,
  });

  // Start or continue a module
  const startModule = useMutation({
    mutationFn: async (moduleId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const existing = completions.find(c => c.module_id === moduleId);
      
      if (existing) {
        return existing;
      }

      const { data, error } = await supabase
        .from('module_completions')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          progress_percent: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module_completions'] });
    },
    onError: (error) => {
      toast.error('Failed to start module');
      console.error(error);
    },
  });

  // Update module progress
  const updateProgress = useMutation({
    mutationFn: async ({ moduleId, progress }: { moduleId: string; progress: number }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const updateData: any = {
        progress_percent: progress,
      };

      if (progress >= 100) {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('module_completions')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['module_completions'] });
      if (data.progress_percent >= 100) {
        toast.success('Module completed! 🎉');
      }
    },
    onError: (error) => {
      toast.error('Failed to update progress');
      console.error(error);
    },
  });

  // Get module progress
  const getModuleProgress = (moduleId: string) => {
    const completion = completions.find(c => c.module_id === moduleId);
    return completion?.progress_percent || 0;
  };

  // Check if module is completed
  const isModuleCompleted = (moduleId: string) => {
    const completion = completions.find(c => c.module_id === moduleId);
    return completion?.completed_at !== null && completion?.completed_at !== undefined;
  };

  // Analyze skill gap with AI
  const analyzeSkillGap = async (targetRole: string): Promise<SkillGapAnalysis | null> => {
    if (!user?.id) {
      toast.error('Please sign in to analyze skill gaps');
      return null;
    }

    setAnalyzing(true);

    try {
      // Get user's current skills
      const { data: studentSkills } = await supabase
        .from('student_skills')
        .select('skill_id, skills(name)')
        .eq('user_id', user.id);

      const currentSkills = studentSkills?.map((s: any) => s.skills?.name).filter(Boolean) || [];
      
      // Get completed module names
      const completedModuleIds = completions
        .filter(c => c.completed_at)
        .map(c => c.module_id);
      
      const completedModuleNames = modules
        .filter(m => completedModuleIds.includes(m.id))
        .map(m => m.title);

      const response = await supabase.functions.invoke('ai-skill-gap', {
        body: {
          targetRole,
          currentSkills,
          completedModules: completedModuleNames,
        },
      });

      if (response.error) throw response.error;
      
      return response.data as SkillGapAnalysis;
    } catch (error) {
      console.error('Skill gap analysis error:', error);
      toast.error('Failed to analyze skill gap');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Calculate overall stats
  const stats = {
    totalModules: modules.length,
    completedModules: completions.filter(c => c.completed_at).length,
    inProgressModules: completions.filter(c => !c.completed_at && c.progress_percent > 0).length,
    totalSkillsLearned: [...new Set(
      modules
        .filter(m => completions.some(c => c.module_id === m.id && c.completed_at))
        .flatMap(m => m.skills_covered || [])
    )].length,
  };

  return {
    modules,
    completions,
    isLoading: modulesLoading || completionsLoading,
    startModule,
    updateProgress,
    getModuleProgress,
    isModuleCompleted,
    analyzeSkillGap,
    analyzing,
    stats,
  };
}
