import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  tips: string;
}

interface ScoreResult {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
  overallFeedback: string;
}

interface FollowUpResult {
  followUpQuestion: string;
  context: string;
}

export function useAIInterview() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateQuestions = async (
    role: string,
    industry: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Question[] | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'generate_questions', role, industry, difficulty }
      });

      if (error) throw error;
      return data.questions || [];
    } catch (error: any) {
      console.error('Error generating questions:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate questions',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const scoreAnswer = async (
    question: string,
    answer: string
  ): Promise<ScoreResult | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'score_answer', question, answer }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error scoring answer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to score answer',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getFollowUp = async (
    question: string,
    answer: string
  ): Promise<FollowUpResult | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'follow_up', question, answer }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error getting follow-up:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get follow-up question',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateQuestions,
    scoreAnswer,
    getFollowUp,
  };
}
