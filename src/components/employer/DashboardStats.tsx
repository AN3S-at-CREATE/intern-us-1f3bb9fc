import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Eye, 
  Users, 
  Clock, 
  Calendar,
  TrendingUp
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    activePostings: number;
    totalViews: number;
    totalApplications: number;
    pendingReviews: number;
    scheduledInterviews: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Active Postings',
      value: stats.activePostings,
      icon: Briefcase,
      color: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
      borderColor: 'border-primary/30',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'from-accent/20 to-accent/5',
      iconColor: 'text-accent',
      borderColor: 'border-accent/30',
    },
    {
      label: 'Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'from-secondary/20 to-secondary/5',
      iconColor: 'text-secondary',
      borderColor: 'border-secondary/30',
    },
    {
      label: 'Pending Review',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'from-warning/20 to-warning/5',
      iconColor: 'text-warning',
      borderColor: 'border-warning/30',
    },
    {
      label: 'Interviews',
      value: stats.scheduledInterviews,
      icon: Calendar,
      color: 'from-success/20 to-success/5',
      iconColor: 'text-success',
      borderColor: 'border-success/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-card/50 ${stat.iconColor}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}