import { motion } from "framer-motion";
import { Users, UserCheck, Clock, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { DashboardStats } from "@/hooks/useUniversity";

interface WILStatsCardsProps {
  stats: DashboardStats;
}

export function WILStatsCards({ stats }: WILStatsCardsProps) {
  const statItems = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Placed",
      value: stats.placedStudents,
      icon: UserCheck,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Pending",
      value: stats.pendingPlacements,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "At Risk",
      value: stats.atRiskStudents,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      label: "Completed",
      value: stats.completedPlacements,
      icon: CheckCircle2,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Placement Rate",
      value: `${stats.placementRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-4 text-center">
            <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
