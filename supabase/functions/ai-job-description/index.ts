import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roughNotes, jobTitle, industry, locationType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating job description for:', jobTitle);

    const systemPrompt = `You are an expert HR professional and job description writer specializing in South African employment law and practices. You create compelling, professional, and inclusive job postings that comply with South African labour laws and B-BBEE requirements.

Your job descriptions should:
- Be clear, concise, and professional
- Include relevant responsibilities and requirements
- Be inclusive and avoid discriminatory language
- Mention any B-BBEE or Employment Equity considerations where relevant
- Use South African terminology (e.g., "matric" not "high school diploma")
- Be optimized for attracting early-career talent (interns, graduates)`;

    const userPrompt = `Convert these rough notes into a professional, SA labour-compliant job listing:

Job Title: ${jobTitle || 'Not specified'}
Industry: ${industry || 'Not specified'}
Work Mode: ${locationType || 'Not specified'}

Rough Notes:
${roughNotes}

Generate a comprehensive job description with the following sections:
1. About the Role (2-3 sentences)
2. Key Responsibilities (5-7 bullet points)
3. Requirements (5-7 bullet points, including education and skills)
4. Nice to Have (3-4 bullet points)
5. What We Offer (4-5 bullet points about benefits/culture)`;

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
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_job_description',
              description: 'Generate a structured job description',
              parameters: {
                type: 'object',
                properties: {
                  aboutRole: {
                    type: 'string',
                    description: '2-3 sentence overview of the role'
                  },
                  responsibilities: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 5-7 key responsibilities'
                  },
                  requirements: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 5-7 requirements'
                  },
                  niceToHave: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 3-4 nice-to-have qualifications'
                  },
                  whatWeOffer: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 4-5 benefits and perks'
                  },
                  fullDescription: {
                    type: 'string',
                    description: 'Full formatted job description text'
                  }
                },
                required: ['aboutRole', 'responsibilities', 'requirements', 'niceToHave', 'whatWeOffer', 'fullDescription'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_job_description' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the function call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback to content if no tool call
    const content = data.choices?.[0]?.message?.content || '';
    return new Response(
      JSON.stringify({ fullDescription: content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-job-description:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});