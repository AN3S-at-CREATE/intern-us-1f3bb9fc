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
    const { targetRole, currentSkills, completedModules } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing skill gap for role:", targetRole);
    console.log("Current skills:", currentSkills);
    console.log("Completed modules:", completedModules);

    const systemPrompt = `You are an AI career advisor for South African students and graduates. 
    Analyze skill gaps based on target roles and provide personalized learning recommendations.
    Consider the South African job market context and industry trends.
    Be encouraging but honest about areas that need improvement.`;

    const userPrompt = `Analyze the skill gap for someone targeting this role: "${targetRole}"

Current Skills: ${currentSkills?.length > 0 ? currentSkills.join(', ') : 'None specified'}
Completed Learning Modules: ${completedModules?.length > 0 ? completedModules.join(', ') : 'None completed'}

Provide a comprehensive skill gap analysis in the following JSON format:
{
  "targetRole": "the target role",
  "readinessScore": <number 0-100>,
  "summary": "2-3 sentence summary of their readiness",
  "skillGaps": [
    {
      "skill": "skill name",
      "importance": "critical|high|medium|low",
      "currentLevel": "none|beginner|intermediate|advanced",
      "requiredLevel": "beginner|intermediate|advanced|expert",
      "recommendation": "specific action to improve this skill"
    }
  ],
  "strengths": ["list of current strengths relevant to the role"],
  "recommendedModules": [
    {
      "title": "suggested module title",
      "priority": "high|medium|low",
      "reason": "why this module would help"
    }
  ],
  "careerTips": ["3-4 actionable career tips for this role in South Africa"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log("Skill gap analysis complete:", analysis.readinessScore);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-skill-gap function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
