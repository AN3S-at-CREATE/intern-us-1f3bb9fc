import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Building2, Lightbulb, BarChart3 } from 'lucide-react';
import { IndustryInsights } from '@/hooks/useCareerAdvisor';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';

interface IndustryInsightsPanelProps {
  insights: IndustryInsights;
}

const demandConfig = {
  high: { color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'High Demand' },
  medium: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'Medium Demand' },
  low: { color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Low Demand' }
};

const trendConfig = {
  growing: { icon: TrendingUp, color: 'text-green-400', label: 'Growing' },
  stable: { icon: Minus, color: 'text-yellow-400', label: 'Stable' },
  declining: { icon: TrendingDown, color: 'text-red-400', label: 'Declining' }
};

export const IndustryInsightsPanel = ({ insights }: IndustryInsightsPanelProps) => {
  const demand = demandConfig[insights.demandLevel];
  const trend = trendConfig[insights.growthTrend];
  const TrendIcon = trend.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-secondary/20">
          <BarChart3 className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Industry Insights</h3>
          <p className="text-sm text-muted-foreground">
            South African market analysis
          </p>
        </div>
      </div>

      {/* Demand & Trend Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="p-4 text-center">
            <div className={`inline-flex p-3 rounded-full ${demand.bgColor} mb-3`}>
              <BarChart3 className={`w-6 h-6 ${demand.color}`} />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Market Demand</p>
            <p className={`font-bold ${demand.color}`}>{demand.label}</p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4 text-center">
            <div className={`inline-flex p-3 rounded-full bg-accent/20 mb-3`}>
              <TrendIcon className={`w-6 h-6 ${trend.color}`} />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Growth Trend</p>
            <p className={`font-bold ${trend.color}`}>{trend.label}</p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Top Employers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Top Employers in SA</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.topEmployers.map((employer, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="bg-primary/10 border-primary/30 text-primary"
              >
                {employer}
              </Badge>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-accent" />
            <h4 className="font-semibold text-foreground">Key Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </GlassCard>
      </motion.div>
    </div>
  );
};
