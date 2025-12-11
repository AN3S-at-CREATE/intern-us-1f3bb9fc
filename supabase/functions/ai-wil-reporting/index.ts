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
    const { placements, reportType, institutionName, faculty, dateRange } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service configuration missing');
    }

    // Build context from placements data
    type PlacementRecord = { status?: string; risk_level?: string };

    const placementStats = {
      total: placements?.length || 0,
      placed: placements?.filter((p: PlacementRecord) => p.status === 'placed' || p.status === 'completed').length || 0,
      pending: placements?.filter((p: PlacementRecord) => p.status === 'pending').length || 0,
      atRisk: placements?.filter((p: PlacementRecord) => p.risk_level === 'high' || p.risk_level === 'medium').length || 0,
      completed: placements?.filter((p: PlacementRecord) => p.status === 'completed').length || 0,
    };

    const systemPrompt = `You are an AI WIL (Work-Integrated Learning) Reporting Assistant for South African higher education institutions. You help generate professional reports for DHET (Department of Higher Education and Training) and SETA (Sector Education and Training Authority) compliance.

Your reports should:
- Follow South African higher education reporting standards
- Include relevant statistics and metrics
- Highlight key achievements and areas of concern
- Be professional and suitable for official submissions
- Include actionable recommendations
- Consider B-BBEE and transformation goals where applicable

Institution: ${institutionName || 'Not specified'}
Faculty/Department: ${faculty || 'All faculties'}
Report Period: ${dateRange?.start || 'Not specified'} to ${dateRange?.end || 'Not specified'}`;

    let userPrompt = '';
    
    switch (reportType) {
      case 'placement_summary':
        userPrompt = `Generate a comprehensive WIL Placement Summary Report with the following data:

Total Students: ${placementStats.total}
Successfully Placed: ${placementStats.placed}
Pending Placement: ${placementStats.pending}
At-Risk Students: ${placementStats.atRisk}
Completed Placements: ${placementStats.completed}

Placement Rate: ${placementStats.total > 0 ? ((placementStats.placed / placementStats.total) * 100).toFixed(1) : 0}%

Please include:
1. Executive Summary
2. Key Performance Indicators
3. Placement Statistics Breakdown
4. Risk Analysis
5. Recommendations for Improvement
6. Next Steps`;
        break;
        
      case 'risk_assessment':
        userPrompt = `Generate a Student At-Risk Assessment Report. 

Students flagged as at-risk: ${placementStats.atRisk}
Total students being tracked: ${placementStats.total}

Please include:
1. Risk Overview
2. Common Risk Factors
3. Intervention Strategies
4. Resource Requirements
5. Timeline for Interventions
6. Success Metrics`;
        break;
        
      case 'compliance_checklist':
        userPrompt = `Generate a WIL Compliance Checklist Report for DHET/SETA submission.

Current placement data:
- Total enrollments: ${placementStats.total}
- Active placements: ${placementStats.placed}
- Completion rate: ${placementStats.total > 0 ? ((placementStats.completed / placementStats.total) * 100).toFixed(1) : 0}%

Please include:
1. Compliance Status Overview
2. Documentation Checklist
3. Outstanding Requirements
4. Submission Deadlines
5. Audit Preparation Notes`;
        break;
        
      case 'quarterly_report':
        userPrompt = `Generate a Quarterly WIL Progress Report.

Quarterly Statistics:
- Students tracked: ${placementStats.total}
- New placements: ${placementStats.placed}
- Completions: ${placementStats.completed}
- At-risk interventions needed: ${placementStats.atRisk}

Please include:
1. Quarter Highlights
2. Progress vs Targets
3. Industry Partner Engagement
4. Student Success Stories (placeholder)
5. Challenges and Solutions
6. Next Quarter Goals`;
        break;
        
      default:
        userPrompt = `Generate a general WIL status report with the following metrics:
Total Students: ${placementStats.total}
Placed: ${placementStats.placed}
Pending: ${placementStats.pending}
At-Risk: ${placementStats.atRisk}
Completed: ${placementStats.completed}`;
    }

    console.log('Generating WIL report:', reportType);

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
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || 'Unable to generate report.';

    return new Response(JSON.stringify({ 
      report,
      stats: placementStats,
      reportType,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('WIL reporting error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
