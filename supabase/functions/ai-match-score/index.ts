import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const normalizeProvince = (province?: string | null): string | null => {
  if (!province) return null;
  const map: Record<string, string> = {
    'gp': 'Gauteng',
    'gauteng': 'Gauteng',
    'wc': 'Western Cape',
    'western cape': 'Western Cape',
    'kzn': 'KwaZulu-Natal',
    'kwazulu natal': 'KwaZulu-Natal',
    'kwa zulu natal': 'KwaZulu-Natal',
    'ec': 'Eastern Cape',
    'eastern cape': 'Eastern Cape',
    'nc': 'Northern Cape',
    'northern cape': 'Northern Cape',
    'nw': 'North West',
    'north west': 'North West',
    'fs': 'Free State',
    'free state': 'Free State',
    'lp': 'Limpopo',
    'limpopo': 'Limpopo',
    'mp': 'Mpumalanga',
    'mpumalanga': 'Mpumalanga',
  };
  const key = province.toLowerCase().trim();
  return map[key] || province.trim();
};

const normalizeLanguages = (languages?: string[] | string | null): string[] => {
  if (!languages) return [];
  const map: Record<string, string> = {
    'english': 'English',
    'isizulu': 'isiZulu',
    'zulu': 'isiZulu',
    'isixhosa': 'isiXhosa',
    'xhosa': 'isiXhosa',
    'afrikaans': 'Afrikaans',
    'sesotho': 'Sesotho',
    'setswana': 'Setswana',
    'sepedi': 'Sepedi',
    'tshivenda': 'Tshivenda',
    'xitsonga': 'Xitsonga',
    'siswati': 'SiSwati',
    'swati': 'SiSwati',
    'isindebele': 'isiNdebele',
    'ndebele': 'isiNdebele',
  };
  const list = Array.isArray(languages) ? languages : languages.split(',');
  return list
    .map((lang) => lang.trim())
    .filter(Boolean)
    .map((lang) => map[lang.toLowerCase()] || lang)
    .filter((lang, index, arr) => arr.indexOf(lang) === index);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service configuration missing');
    }

    const supabaseClient = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : null;

    const requestBody = await req.json();
    const { studentProfile, opportunity, normalizedDemographics, featureLog, biasAssessment, blindMatchEnforced } = requestBody;

    const resolvedDemographics = normalizedDemographics || {
      province: normalizeProvince(studentProfile?.location),
      languages: normalizeLanguages(studentProfile?.languages || studentProfile?.language),
      genderProxy: studentProfile?.gender ?? null,
    };

    const resolvedFeatureLog = featureLog || {
      removedFields: [],
      normalized: resolvedDemographics,
      blindMatchEnforced: Boolean(blindMatchEnforced),
      notes: ['No client feature log provided'],
    };

    const biasFlags = biasAssessment?.flags || [];
    if (!blindMatchEnforced) biasFlags.push('blind_match_disabled');
    const resolvedBiasAssessment = {
      risk: biasAssessment?.risk || (biasFlags.length >= 2 ? 'high' : biasFlags.length === 1 ? 'medium' : 'low'),
      flags: biasFlags,
      dimensions: resolvedDemographics,
    };

    const systemPrompt = `You are an AI career matching expert. Analyze the compatibility between a student's profile and a job opportunity. Be encouraging but realistic. Respect blind matching by not inferring personal identifiers.`;

    const demographicContext = `Normalized demographics:\n- Province: ${resolvedDemographics.province || 'Not specified'}\n- Languages: ${resolvedDemographics.languages?.join(', ') || 'Not specified'}\n- Gender proxy: ${resolvedDemographics.genderProxy || 'Not specified'}\n- Blind match enforced: ${blindMatchEnforced ? 'Yes' : 'No'}`;

    const userPrompt = `Analyze the match between this student and opportunity:\n\nSTUDENT PROFILE:\n- Field of Study: ${studentProfile.field_of_study || 'Not specified'}\n- Qualification: ${studentProfile.qualification || 'Not specified'}\n- Institution: ${studentProfile.institution || 'Not specified'}\n- Location: ${studentProfile.location || 'Not specified'}\n- Skills: ${studentProfile.skills?.join(', ') || 'Not specified'}\n- Experience: ${studentProfile.experience || 'Not specified'}\n- Headline: ${studentProfile.headline || 'Not specified'}\n\n${demographicContext}\n\nOPPORTUNITY:\n- Title: ${opportunity.title}\n- Company: ${blindMatchEnforced ? 'Hidden for blind match' : opportunity.company_name}\n- Industry: ${opportunity.industry}\n- Required Fields: ${opportunity.field_of_study?.join(', ') || 'Any'}\n- Location: ${opportunity.location}\n- Type: ${opportunity.opportunity_type}\n- Requirements: ${opportunity.requirements || 'Not specified'}\n\nCalculate a match score (0-100) and provide reasons. Return as JSON:\n{\n  "score": 75,\n  "reasons": ["Reason 1", "Reason 2", "Reason 3"],\n  "missingSkills": ["Skill 1", "Skill 2"],\n  "recommendation": "Brief recommendation for the student"\n}`;

    console.log(`Calculating match score for opportunity: ${opportunity.title}`);
    console.log('Feature log before scoring', JSON.stringify(resolvedFeatureLog));

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
    const content = data.choices[0]?.message?.content || '';

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const result = JSON.parse(jsonMatch[0]);
    const responseBody = {
      ...result,
      biasAssessment: resolvedBiasAssessment,
      normalizedDemographics: resolvedDemographics,
      featureLog: resolvedFeatureLog,
    };

    console.log(`Match score calculated: ${result.score}`);

    if (supabaseClient) {
      await supabaseClient.from('ai_match_audits').insert({
        student_id: studentProfile?.user_id || null,
        opportunity_id: opportunity.id,
        blind_match_enforced: Boolean(blindMatchEnforced),
        province: resolvedDemographics.province,
        languages: resolvedDemographics.languages,
        gender_proxy: resolvedDemographics.genderProxy,
        feature_log: resolvedFeatureLog,
        bias_assessment: resolvedBiasAssessment,
        match_score: result.score,
        decision_notes: result.recommendation || null,
      });
    }

    return new Response(JSON.stringify(responseBody), {
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
