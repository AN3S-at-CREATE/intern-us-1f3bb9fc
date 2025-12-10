import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const harmfulPatterns = [
  /\b(?:hate|racist|sexist|discriminate|violence|threat)\b/i,
  /\b(?:slur|derogatory|offensive language)\b/i,
  /\b(?:religion|gender|race|ethnicity) based bias\b/i,
];

function moderateContent(text: string) {
  const flaggedPattern = harmfulPatterns.find((pattern) => pattern.test(text));
  if (flaggedPattern) {
    return {
      flagged: true,
      reason: `Content flagged by moderation pattern: ${flaggedPattern}`,
    };
  }

  return {
    flagged: false,
    reason: null,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service configuration missing');
    }

    const { type, role, industry, question, answer, difficulty, metadata, biasReason } = await req.json();

    const localeHint = metadata?.locale || 'en-ZA';
    const safetyPrefix = `You must avoid any discriminatory, defamatory, or harmful content. Be unbiased, reference South African hiring norms, and keep privacy protections in mind.`;
    const localeGuidance = `Use ${localeHint} language conventions and examples relevant to South Africa. If unsure, default to clear British English suitable for South African readers.`;

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'generate_questions':
        systemPrompt = `${safetyPrefix}\n${localeGuidance}\nYou are an expert interview coach specializing in helping South African graduates prepare for job interviews. Generate relevant, realistic interview questions that avoid bias or protected characteristic assumptions.`;
        userPrompt = `Generate 5 interview questions for a ${role || 'entry-level'} position in the ${industry || 'general'} industry. Difficulty level: ${difficulty || 'intermediate'}.

Return as JSON array with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "The interview question",
      "type": "behavioral|technical|situational",
      "tips": "Brief tip for answering this question"
    }
  ]
}`;
        break;

      case 'score_answer':
        systemPrompt = `${safetyPrefix}\n${localeGuidance}\nYou are an expert interview coach. Evaluate the candidate's response objectively and provide constructive feedback. Be encouraging but honest. Avoid bias, stereotypes, or references to protected characteristics.`;
        userPrompt = `Interview Question: "${question}"

Candidate's Answer: "${answer}"

Evaluate this response and provide:
1. A score from 1-10
2. Key strengths in the answer
3. Areas for improvement
4. A sample strong answer for reference

Return as JSON:
{
  "score": 7,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "sampleAnswer": "A strong example answer...",
  "overallFeedback": "Brief encouraging overall feedback"
}`;
        break;

      case 'follow_up':
        systemPrompt = `${safetyPrefix}\n${localeGuidance}\nYou are an interviewer conducting a realistic job interview. Ask a natural follow-up question based on the candidate's response. Avoid leading or biased phrasing.`;
        userPrompt = `Original Question: "${question}"
Candidate's Answer: "${answer}"

Generate a natural follow-up question an interviewer might ask. Return as JSON:
{
  "followUpQuestion": "The follow-up question",
  "context": "Why this follow-up is relevant"
}`;
        break;

      case 'report_bias':
        console.log('Received bias report for ai-interview flow');
        console.log(JSON.stringify({
          event: 'ai_interview_bias_report',
          timestamp: new Date().toISOString(),
          reason: biasReason || 'unspecified',
          role,
          industry,
          metadata,
        }));
        return new Response(JSON.stringify({ status: 'received' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid type specified');
    }

    console.log(`Processing ${type} request for role: ${role}, industry: ${industry}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty AI response');
    }

    const moderationResult = moderateContent(content);
    if (moderationResult.flagged) {
      console.warn('AI output blocked by moderation');
      return new Response(JSON.stringify({ error: 'Response blocked by safety filters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const result = JSON.parse(jsonMatch[0]);

    if (type === 'score_answer') {
      console.log(JSON.stringify({
        event: 'ai_interview_score_audit',
        timestamp: new Date().toISOString(),
        anonymizedUser: metadata?.anonymizedUserId || 'anonymous',
        locale: metadata?.locale || 'unknown',
        timezone: metadata?.timezone || 'unknown',
        role,
        industry,
        score: result.score,
        overallFeedback: result.overallFeedback,
      }));
    }

    console.log(`Successfully processed ${type} request`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-interview function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
