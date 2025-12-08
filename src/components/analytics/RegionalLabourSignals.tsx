import { MapPin, TrendingUp, TrendingDown, Minus, Building2, Briefcase, Sparkles, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRegionalSignals, ProvinceData } from "@/hooks/useRegionalSignals";
import { Skeleton } from "@/components/ui/skeleton";

const getDemandBadgeVariant = (level: ProvinceData["demandLevel"]) => {
  switch (level) {
    case "high":
      return "default";
    case "medium":
      return "secondary";
    case "emerging":
      return "outline";
    default:
      return "secondary";
  }
};

const getDemandColor = (level: ProvinceData["demandLevel"]) => {
  switch (level) {
    case "high":
      return "text-primary";
    case "medium":
      return "text-accent";
    case "emerging":
      return "text-[#C752FF]";
    default:
      return "text-muted-foreground";
  }
};

const getGrowthIcon = (trend: ProvinceData["growthTrend"]) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-green-400" />;
    case "down":
      return <TrendingDown className="h-3 w-3 text-red-400" />;
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

interface ProvinceCardProps {
  province: ProvinceData;
  maxCount: number;
}

function ProvinceCard({ province, maxCount }: ProvinceCardProps) {
  const progressValue = (province.opportunityCount / maxCount) * 100;

  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className={`h-4 w-4 ${getDemandColor(province.demandLevel)}`} />
          <h4 className="font-heading font-semibold text-sm">{province.province}</h4>
        </div>
        <Badge variant={getDemandBadgeVariant(province.demandLevel)} className="text-xs capitalize">
          {province.demandLevel}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Opportunities</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{province.opportunityCount}</span>
              <span className="text-muted-foreground">({province.percentage}%)</span>
              {getGrowthIcon(province.growthTrend)}
            </div>
          </div>
          <Progress value={progressValue} className="h-1.5" />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>{province.activeCompanies} companies</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span>+{province.recentGrowth} this month</span>
          </div>
        </div>

        {province.topIndustries.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {province.topIndustries.map((industry) => (
              <Badge key={industry} variant="outline" className="text-[10px] px-1.5 py-0">
                {industry}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function RegionalLabourSignals() {
  const { data, loading, error, refetch } = useRegionalSignals();

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold">Regional Labour Signals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </GlassCard>
    );
  }

  if (!data) {
    return null;
  }

  const maxCount = Math.max(...data.provinces.map((p) => p.opportunityCount));
  const highDemandProvinces = data.provinces.filter((p) => p.demandLevel === "high");
  const emergingProvinces = data.provinces.filter((p) => p.demandLevel === "emerging");

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold">Regional Labour Signals</h3>
          <Badge variant="outline" className="text-xs">
            {data.totalOpportunities} Total
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={refetch} className="gap-1">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-2xl font-bold text-primary">{data.totalOpportunities}</div>
          <div className="text-xs text-muted-foreground">Active Opportunities</div>
        </div>
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="text-2xl font-bold text-accent">{highDemandProvinces.length}</div>
          <div className="text-xs text-muted-foreground">High Demand Regions</div>
        </div>
        <div className="p-3 rounded-lg bg-[#C752FF]/10 border border-[#C752FF]/20">
          <div className="text-2xl font-bold text-[#C752FF]">{emergingProvinces.length}</div>
          <div className="text-xs text-muted-foreground">Emerging Markets</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="text-2xl font-bold">9</div>
          <div className="text-xs text-muted-foreground">Provinces Covered</div>
        </div>
      </div>

      {/* AI Insights */}
      {data.aiInsights && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-heading font-semibold text-sm">AI Market Insights</span>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {data.aiInsights}
          </div>
        </div>
      )}

      {/* Province Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.provinces.map((province) => (
          <ProvinceCard key={province.province} province={province} maxCount={maxCount} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span>Last updated: {new Date(data.lastUpdated).toLocaleString()}</span>
        <span>Data based on active opportunities</span>
      </div>
    </GlassCard>
  );
}
