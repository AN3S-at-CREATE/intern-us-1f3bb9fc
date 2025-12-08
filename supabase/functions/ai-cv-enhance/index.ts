import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnhanceRequest {
  type: "headline" | "bio" | "experience" | "skills_gap" | "ats_score" | "full_review";
  content: string;
  context?: {
    targetRole?: string;
    skills?: string[];
    industry?: string;
  };
}

const systemPrompts: Record<string, string> = {
  headline: `You are an expert career advisor specializing in crafting compelling professional headlines for South African students and graduates. 
Your task is to enhance the provided headline to be more impactful and memorable while remaining professional.
Keep it concise (under 120 characters), highlight unique value, and include relevant keywords for ATS systems.
Return ONLY the enhanced headline, nothing else.`,

  bio: `You are an expert CV writer specializing in helping South African students and graduates stand out.
Your task is to enhance the provided bio/summary to be more compelling, professional, and ATS-friendly.
Focus on: achievements, skills, career goals, and unique value proposition.
Keep it between 3-5 sentences. Use action words and quantify achievements where possible.
Return ONLY the enhanced bio, nothing else.`,

  experience: `You are an expert CV writer specializing in transforming work experience descriptions into powerful, ATS-optimized bullet points.
Your task is to enhance the provided experience description following these rules:
1. Start each bullet with a strong action verb
2. Quantify achievements where possible (numbers, percentages, metrics)
3. Focus on results and impact, not just responsibilities
4. Include relevant keywords for the industry
5. Keep each bullet point concise (under 100 characters)
Return the enhanced description as bullet points, each on a new line starting with "• "`,

  skills_gap: `You are a career advisor helping South African students identify skill gaps for their target roles.
Based on the provided profile and target role, identify:
1. Skills they should highlight more prominently
2. Skills they should consider developing
3. Certifications or courses that would strengthen their profile
Format as JSON with keys: highlight, develop, certifications (each an array of strings).`,

  ats_score: `You are an ATS (Applicant Tracking System) expert evaluating CVs.
Analyze the provided CV content and provide:
1. An overall ATS compatibility score (0-100)
2. Key strengths for ATS
3. Areas that need improvement
4. Specific keyword suggestions
Format as JSON with keys: score (number), strengths (array), improvements (array), keywords (array).`,

  full_review: `You are a professional CV consultant providing comprehensive feedback.
Review the provided CV content and provide actionable suggestions to improve:
1. Overall impact and first impression
2. Content clarity and conciseness  
3. ATS optimization
4. Key missing elements
5. Specific rewrites for weak sections
Be constructive and specific. Format as a clear, organized response with sections.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content, context }: EnhanceRequest = await req.json();

    if (!type || !content) {
      throw new Error("Type and content are required");
    }

    const systemPrompt = systemPrompts[type];
    if (!systemPrompt) {
      throw new Error(`Invalid enhancement type: ${type}`);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service configuration missing");
    }

    let userPrompt = content;
    if (context) {
      if (context.targetRole) {
        userPrompt += `\n\nTarget Role: ${context.targetRole}`;
      }
      if (context.skills && context.skills.length > 0) {
        userPrompt += `\n\nCurrent Skills: ${context.skills.join(", ")}`;
      }
      if (context.industry) {
        userPrompt += `\n\nIndustry: ${context.industry}`;
      }
    }

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const enhancedContent = data.choices?.[0]?.message?.content;

    if (!enhancedContent) {
      throw new Error("No content returned from AI");
    }

    // Parse JSON responses for specific types
    let result: any = { enhanced: enhancedContent };

    if (type === "skills_gap" || type === "ats_score") {
      try {
        // Extract JSON from response (in case it's wrapped in markdown)
        const jsonMatch = enhancedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        result = { enhanced: enhancedContent };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI CV Enhance error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
