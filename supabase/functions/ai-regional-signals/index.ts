import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SA_PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Mpumalanga",
  "Limpopo",
  "North West",
  "Northern Cape",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active opportunities with location data
    const { data: opportunities, error: oppError } = await supabase
      .from("opportunities")
      .select("id, title, location, industry, opportunity_type, company_name, created_at")
      .eq("is_active", true);

    if (oppError) {
      console.error("Error fetching opportunities:", oppError);
      throw oppError;
    }

    console.log(`Fetched ${opportunities?.length || 0} active opportunities`);

    // Map opportunities to provinces
    const provinceData: Record<string, {
      count: number;
      industries: Record<string, number>;
      types: Record<string, number>;
      companies: string[];
      recentGrowth: number;
    }> = {};

    // Initialize all provinces
    SA_PROVINCES.forEach(province => {
      provinceData[province] = {
        count: 0,
        industries: {},
        types: {},
        companies: [],
        recentGrowth: 0,
      };
    });

    // Process opportunities
    opportunities?.forEach((opp) => {
      const location = opp.location?.toLowerCase() || "";
      
      // Match location to province
      let matchedProvince: string | null = null;
      
      if (location.includes("johannesburg") || location.includes("pretoria") || location.includes("gauteng") || location.includes("sandton") || location.includes("midrand")) {
        matchedProvince = "Gauteng";
      } else if (location.includes("cape town") || location.includes("western cape") || location.includes("stellenbosch") || location.includes("paarl")) {
        matchedProvince = "Western Cape";
      } else if (location.includes("durban") || location.includes("kwazulu") || location.includes("pietermaritzburg") || location.includes("umhlanga")) {
        matchedProvince = "KwaZulu-Natal";
      } else if (location.includes("port elizabeth") || location.includes("gqeberha") || location.includes("east london") || location.includes("eastern cape")) {
        matchedProvince = "Eastern Cape";
      } else if (location.includes("bloemfontein") || location.includes("free state")) {
        matchedProvince = "Free State";
      } else if (location.includes("nelspruit") || location.includes("mbombela") || location.includes("mpumalanga")) {
        matchedProvince = "Mpumalanga";
      } else if (location.includes("polokwane") || location.includes("limpopo")) {
        matchedProvince = "Limpopo";
      } else if (location.includes("rustenburg") || location.includes("north west") || location.includes("mahikeng")) {
        matchedProvince = "North West";
      } else if (location.includes("kimberley") || location.includes("northern cape") || location.includes("upington")) {
        matchedProvince = "Northern Cape";
      }

      if (matchedProvince) {
        const data = provinceData[matchedProvince];
        data.count++;
        
        // Track industries
        if (opp.industry) {
          data.industries[opp.industry] = (data.industries[opp.industry] || 0) + 1;
        }
        
        // Track types
        if (opp.opportunity_type) {
          data.types[opp.opportunity_type] = (data.types[opp.opportunity_type] || 0) + 1;
        }
        
        // Track unique companies
        if (opp.company_name && !data.companies.includes(opp.company_name)) {
          data.companies.push(opp.company_name);
        }

        // Calculate recent growth (opportunities from last 30 days)
        const createdAt = new Date(opp.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (createdAt >= thirtyDaysAgo) {
          data.recentGrowth++;
        }
      }
    });

    // Calculate demand levels and insights
    const totalOpportunities = opportunities?.length || 1;
    const regionalInsights = SA_PROVINCES.map(province => {
      const data = provinceData[province];
      const percentage = (data.count / totalOpportunities) * 100;
      
      // Determine demand level
      let demandLevel: "high" | "medium" | "low" | "emerging";
      if (percentage >= 25) demandLevel = "high";
      else if (percentage >= 10) demandLevel = "medium";
      else if (data.recentGrowth >= 2) demandLevel = "emerging";
      else demandLevel = "low";

      // Get top industries
      const topIndustries = Object.entries(data.industries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      // Get top opportunity types
      const topTypes = Object.entries(data.types)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([name]) => name);

      return {
        province,
        opportunityCount: data.count,
        percentage: Math.round(percentage * 10) / 10,
        demandLevel,
        topIndustries,
        topTypes,
        activeCompanies: data.companies.length,
        recentGrowth: data.recentGrowth,
        growthTrend: data.recentGrowth > 0 ? "up" : "stable",
      };
    }).sort((a, b) => b.opportunityCount - a.opportunityCount);

    // Generate AI insights using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let aiInsights = null;

    if (!LOVABLE_API_KEY) {
      console.warn("LOVABLE_API_KEY is not configured. AI insights will be skipped.");
    } else if (opportunities && opportunities.length > 0) {
      try {
        const topProvinces = regionalInsights.slice(0, 3);
        const emergingProvinces = regionalInsights.filter(r => r.demandLevel === "emerging");
        
        const prompt = `Analyze the South African job market data and provide brief insights:
        
Top demand provinces:
${topProvinces.map(p => `- ${p.province}: ${p.opportunityCount} opportunities (${p.topIndustries.join(", ")})`).join("\n")}

${emergingProvinces.length > 0 ? `Emerging markets: ${emergingProvinces.map(p => p.province).join(", ")}` : "No emerging markets detected."}

Total opportunities: ${totalOpportunities}

Provide 3 concise insights for South African job seekers about regional opportunities, mobility, and industry trends. Focus on practical advice. Keep each insight under 30 words.`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a South African labour market analyst. Provide brief, actionable insights for job seekers." },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiInsights = aiData.choices?.[0]?.message?.content;
          console.log("AI insights generated successfully");
        }
      } catch (aiError) {
        console.error("AI insights error:", aiError);
      }
    }

    return new Response(
      JSON.stringify({
        provinces: regionalInsights,
        totalOpportunities,
        aiInsights,
        lastUpdated: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Regional signals error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
