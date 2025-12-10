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

interface AnonymizedMetadata {
  anonymizedUserId?: string;
  locale?: string;
  timezone?: string;
}

async function hashIdentifier(identifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(identifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function getAnonymizedMetadata(): Promise<AnonymizedMetadata> {
  try {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    const anonymizedUserId = userId ? await hashIdentifier(userId) : undefined;
    const locale = navigator.language || 'en-ZA';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return { anonymizedUserId, locale, timezone };
  } catch (error) {
    console.error('Failed to resolve anonymized metadata', error);
    return {};
  }
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
      const metadata = await getAnonymizedMetadata();
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'generate_questions', role, industry, difficulty, metadata }
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
      const metadata = await getAnonymizedMetadata();
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'score_answer', question, answer, metadata }
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
      const metadata = await getAnonymizedMetadata();
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'follow_up', question, answer, metadata }
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
    reportBias: async (role: string, industry: string, reason: string) => {
      const metadata = await getAnonymizedMetadata();
      const { error } = await supabase.functions.invoke('ai-interview', {
        body: { type: 'report_bias', role, industry, biasReason: reason, metadata }
      });

      if (error) {
        console.error('Error reporting bias:', error);
        toast({
          title: 'Error',
          description: 'Could not submit bias report',
          variant: 'destructive',
        });
        return { success: false };
      }

      toast({
        title: 'Thank you',
        description: 'We have paused AI responses and logged your report for review.',
      });
      return { success: true };
    }
  };
}
