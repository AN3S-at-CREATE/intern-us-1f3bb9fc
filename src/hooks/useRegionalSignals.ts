import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProvinceData {
  province: string;
  opportunityCount: number;
  percentage: number;
  demandLevel: "high" | "medium" | "low" | "emerging";
  topIndustries: string[];
  topTypes: string[];
  activeCompanies: number;
  recentGrowth: number;
  growthTrend: "up" | "stable" | "down";
}

export interface RegionalSignalsData {
  provinces: ProvinceData[];
  totalOpportunities: number;
  aiInsights: string | null;
  lastUpdated: string;
}

// Demo data for when no real data exists
const generateDemoData = (): RegionalSignalsData => ({
  provinces: [
    {
      province: "Gauteng",
      opportunityCount: 156,
      percentage: 42.3,
      demandLevel: "high",
      topIndustries: ["Technology", "Finance", "Manufacturing"],
      topTypes: ["internship", "graduate"],
      activeCompanies: 45,
      recentGrowth: 23,
      growthTrend: "up",
    },
    {
      province: "Western Cape",
      opportunityCount: 89,
      percentage: 24.1,
      demandLevel: "high",
      topIndustries: ["Technology", "Tourism", "Retail"],
      topTypes: ["internship", "wil"],
      activeCompanies: 32,
      recentGrowth: 15,
      growthTrend: "up",
    },
    {
      province: "KwaZulu-Natal",
      opportunityCount: 52,
      percentage: 14.1,
      demandLevel: "medium",
      topIndustries: ["Manufacturing", "Logistics", "Agriculture"],
      topTypes: ["internship", "learnerships"],
      activeCompanies: 18,
      recentGrowth: 8,
      growthTrend: "up",
    },
    {
      province: "Eastern Cape",
      opportunityCount: 28,
      percentage: 7.6,
      demandLevel: "medium",
      topIndustries: ["Automotive", "Agriculture", "Education"],
      topTypes: ["wil", "internship"],
      activeCompanies: 12,
      recentGrowth: 5,
      growthTrend: "stable",
    },
    {
      province: "Free State",
      opportunityCount: 15,
      percentage: 4.1,
      demandLevel: "low",
      topIndustries: ["Mining", "Agriculture", "Education"],
      topTypes: ["internship"],
      activeCompanies: 7,
      recentGrowth: 3,
      growthTrend: "stable",
    },
    {
      province: "Mpumalanga",
      opportunityCount: 12,
      percentage: 3.3,
      demandLevel: "emerging",
      topIndustries: ["Mining", "Energy", "Agriculture"],
      topTypes: ["learnerships", "internship"],
      activeCompanies: 5,
      recentGrowth: 4,
      growthTrend: "up",
    },
    {
      province: "Limpopo",
      opportunityCount: 8,
      percentage: 2.2,
      demandLevel: "emerging",
      topIndustries: ["Mining", "Agriculture", "Government"],
      topTypes: ["internship", "graduate"],
      activeCompanies: 4,
      recentGrowth: 3,
      growthTrend: "up",
    },
    {
      province: "North West",
      opportunityCount: 5,
      percentage: 1.4,
      demandLevel: "low",
      topIndustries: ["Mining", "Agriculture"],
      topTypes: ["learnerships"],
      activeCompanies: 3,
      recentGrowth: 1,
      growthTrend: "stable",
    },
    {
      province: "Northern Cape",
      opportunityCount: 4,
      percentage: 1.1,
      demandLevel: "low",
      topIndustries: ["Mining", "Renewable Energy"],
      topTypes: ["internship"],
      activeCompanies: 2,
      recentGrowth: 2,
      growthTrend: "up",
    },
  ],
  totalOpportunities: 369,
  aiInsights: `**Regional Mobility Matters**: Gauteng and Western Cape hold 66% of opportunities—consider relocation or remote options for best chances.

**Tech Dominates Urban Centers**: Technology roles lead in Johannesburg and Cape Town. Students in rural areas should prioritize digital skills training.

**Emerging Opportunities**: Mpumalanga and Limpopo show growth in mining and energy sectors—ideal for engineering and environmental science graduates.`,
  lastUpdated: new Date().toISOString(),
});

export function useRegionalSignals() {
  const [data, setData] = useState<RegionalSignalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionalSignals = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "ai-regional-signals"
      );

      if (functionError) {
        console.error("Edge function error:", functionError);
        // Fall back to demo data
        setData(generateDemoData());
      } else if (functionData && functionData.provinces?.length > 0) {
        setData(functionData);
      } else {
        // No real data, use demo
        setData(generateDemoData());
      }
    } catch (err) {
      console.error("Error fetching regional signals:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch regional data");
      // Fall back to demo data on error
      setData(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionalSignals();
  }, []);

  return { data, loading, error, refetch: fetchRegionalSignals };
}
