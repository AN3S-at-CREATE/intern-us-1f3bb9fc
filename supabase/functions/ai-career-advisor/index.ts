import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { currentRole, targetRole, skills, experience, education, fieldOfStudy } = await req.json();

    if (!targetRole) {
      return new Response(
        JSON.stringify({ error: 'Target role is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an AI Career Path Advisor specializing in South African job market trends, especially for graduates and interns. Provide practical, actionable career guidance.

Your responses must be in valid JSON format with this exact structure:
{
  "careerPath": {
    "currentPosition": "string - current role or 'Entry Level'",
    "targetPosition": "string - the goal role",
    "estimatedTimeYears": number - realistic years to reach goal,
    "confidenceScore": number - 0 to 100 confidence level
  },
  "pathwaySteps": [
    {
      "step": number,
      "role": "string - job title",
      "description": "string - brief role description",
      "duration": "string - e.g., '1-2 years'",
      "keySkills": ["skill1", "skill2", "skill3"],
      "salaryRange": "string - South African Rand range"
    }
  ],
  "skillsToAcquire": [
    {
      "skill": "string - skill name",
      "priority": "high" | "medium" | "low",
      "reasoning": "string - why this skill matters",
      "learningResources": ["resource1", "resource2"]
    }
  ],
  "industryInsights": {
    "demandLevel": "high" | "medium" | "low",
    "growthTrend": "growing" | "stable" | "declining",
    "topEmployers": ["company1", "company2", "company3"],
    "recommendations": ["insight1", "insight2"]
  },
  "alternativePaths": [
    {
      "role": "string - alternative career option",
      "relevance": number - 0 to 100,
      "reasoning": "string - why consider this path"
    }
  ]
}`;

    const userPrompt = `Analyze career path for:
- Current Role: ${currentRole || 'Entry Level / Student'}
- Target Role: ${targetRole}
- Current Skills: ${skills?.join(', ') || 'None specified'}
- Experience: ${experience || 'None'}
- Education: ${education || 'Not specified'}
- Field of Study: ${fieldOfStudy || 'Not specified'}

Provide a comprehensive career path analysis with realistic South African market context, including:
1. Clear pathway steps from current position to target role
2. Skills gap analysis with prioritized learning recommendations
3. Industry insights and demand levels
4. Alternative career paths to consider`;

    console.log('Calling Lovable AI Gateway for career advice...');
    
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'Empty AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let careerAdvice;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        careerAdvice = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw content:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse career advice' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully generated career advice');
    
    return new Response(
      JSON.stringify(careerAdvice),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-career-advisor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
