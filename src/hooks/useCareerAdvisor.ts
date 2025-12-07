import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PathwayStep {
  step: number;
  role: string;
  description: string;
  duration: string;
  keySkills: string[];
  salaryRange: string;
}

export interface SkillToAcquire {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  learningResources: string[];
}

export interface IndustryInsights {
  demandLevel: 'high' | 'medium' | 'low';
  growthTrend: 'growing' | 'stable' | 'declining';
  topEmployers: string[];
  recommendations: string[];
}

export interface AlternativePath {
  role: string;
  relevance: number;
  reasoning: string;
}

export interface CareerAdvice {
  careerPath: {
    currentPosition: string;
    targetPosition: string;
    estimatedTimeYears: number;
    confidenceScore: number;
  };
  pathwaySteps: PathwayStep[];
  skillsToAcquire: SkillToAcquire[];
  industryInsights: IndustryInsights;
  alternativePaths: AlternativePath[];
}

interface CareerAdvisorInput {
  currentRole?: string;
  targetRole: string;
  skills?: string[];
  experience?: string;
  education?: string;
  fieldOfStudy?: string;
}

export const useCareerAdvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<CareerAdvice | null>(null);
  const { toast } = useToast();

  const getCareerAdvice = async (input: CareerAdvisorInput): Promise<CareerAdvice | null> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-advisor', {
        body: input
      });

      if (error) {
        console.error('Career advisor error:', error);
        toast({
          title: "Failed to get career advice",
          description: error.message || "Please try again later",
          variant: "destructive"
        });
        return null;
      }

      if (data.error) {
        toast({
          title: "Career Advisor Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      setAdvice(data);
      return data;
    } catch (err) {
      console.error('Career advisor error:', err);
      toast({
        title: "Error",
        description: "Failed to connect to career advisor",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAdvice = () => {
    setAdvice(null);
  };

  return {
    isLoading,
    advice,
    getCareerAdvice,
    clearAdvice
  };
};
