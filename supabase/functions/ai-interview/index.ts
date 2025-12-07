import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { type, role, industry, question, answer, difficulty } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'generate_questions':
        systemPrompt = `You are an expert interview coach specializing in helping South African graduates prepare for job interviews. Generate relevant, realistic interview questions.`;
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
        systemPrompt = `You are an expert interview coach. Evaluate the candidate's response objectively and provide constructive feedback. Be encouraging but honest.`;
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
        systemPrompt = `You are an interviewer conducting a realistic job interview. Ask a natural follow-up question based on the candidate's response.`;
        userPrompt = `Original Question: "${question}"
Candidate's Answer: "${answer}"

Generate a natural follow-up question an interviewer might ask. Return as JSON:
{
  "followUpQuestion": "The follow-up question",
  "context": "Why this follow-up is relevant"
}`;
        break;

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

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const result = JSON.parse(jsonMatch[0]);
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
