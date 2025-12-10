import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type EnhanceType = 'headline' | 'bio' | 'experience' | 'skills_gap' | 'ats_score' | 'full_review';

interface EnhanceContext {
  targetRole?: string;
  skills?: string[];
  industry?: string;
  biasTier?: string;
}

interface ATSResult {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
}

interface SkillsGapResult {
  highlight: string[];
  develop: string[];
  certifications: string[];
}

interface EnhanceOptions {
  institutionsToRedact?: string[];
  replacementLabel?: string;
}

const FAIRNESS_GUIDELINES = [
  'Apply neutral weighting to education regardless of institution prestige.',
  'Redact institution names prior to scoring or generating recommendations.',
  'Avoid assumptions tied to school rankings, geography, or perceived elite status.',
  'Flag outputs for human review before they are stored or actioned.',
].join(' ');

export function replaceInstitutions(
  content: string,
  institutions: string[],
  replacementLabel = '[institution redacted]'
) {
  return institutions.reduce((acc, institution) => {
    if (!institution?.trim()) return acc;
    const escaped = institution.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    return acc.replace(regex, replacementLabel);
  }, content);
}

export function useAICVEnhance() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const enhance = async (
    type: EnhanceType,
    content: string,
    context?: EnhanceContext,
    options?: EnhanceOptions
  ): Promise<string | ATSResult | SkillsGapResult | null> => {
    if (!content.trim()) {
      toast({
        title: "No content to enhance",
        description: "Please add some content first.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const sanitizedContent =
        type === 'ats_score' && options?.institutionsToRedact?.length
          ? replaceInstitutions(
              content,
              options.institutionsToRedact,
              options.replacementLabel
            )
          : content;

      const { data, error } = await supabase.functions.invoke('ai-cv-enhance', {
        body: {
          type,
          content: sanitizedContent,
          context: { ...context, fairnessGuidelines: FAIRNESS_GUIDELINES },
          metadata: {
            redactions: {
              institutions: Boolean(options?.institutionsToRedact?.length),
              replacementLabel: options?.replacementLabel,
            },
            requiresHumanReview: true,
          },
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "AI Enhancement Complete",
        description: "Your content has been enhanced.",
      });

      // Return the appropriate data based on type
      if (type === 'ats_score') {
        return data as ATSResult;
      } else if (type === 'skills_gap') {
        return data as SkillsGapResult;
      } else {
        return data.enhanced as string;
      }
    } catch (error: any) {
      console.error('AI enhance error:', error);
      toast({
        title: "Enhancement failed",
        description: error.message || "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { enhance, loading };
}
