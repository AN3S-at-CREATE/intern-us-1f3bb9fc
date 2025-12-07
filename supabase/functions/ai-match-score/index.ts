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

    const { studentProfile, opportunity } = await req.json();

    const systemPrompt = `You are an AI career matching expert. Analyze the compatibility between a student's profile and a job opportunity. Be encouraging but realistic.`;
    
    const userPrompt = `Analyze the match between this student and opportunity:

STUDENT PROFILE:
- Field of Study: ${studentProfile.field_of_study || 'Not specified'}
- Qualification: ${studentProfile.qualification || 'Not specified'}
- Institution: ${studentProfile.institution || 'Not specified'}
- Location: ${studentProfile.location || 'Not specified'}
- Skills: ${studentProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${studentProfile.experience || 'Not specified'}
- Headline: ${studentProfile.headline || 'Not specified'}

OPPORTUNITY:
- Title: ${opportunity.title}
- Company: ${opportunity.company_name}
- Industry: ${opportunity.industry}
- Required Fields: ${opportunity.field_of_study?.join(', ') || 'Any'}
- Location: ${opportunity.location}
- Type: ${opportunity.opportunity_type}
- Requirements: ${opportunity.requirements || 'Not specified'}

Calculate a match score (0-100) and provide reasons. Return as JSON:
{
  "score": 75,
  "reasons": ["Reason 1", "Reason 2", "Reason 3"],
  "missingSkills": ["Skill 1", "Skill 2"],
  "recommendation": "Brief recommendation for the student"
}`;

    console.log(`Calculating match score for opportunity: ${opportunity.title}`);

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
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log(`Match score calculated: ${result.score}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-match-score function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
