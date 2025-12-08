import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart, MapPin } from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";
import { RegionalLabourSignals } from "@/components/analytics/RegionalLabourSignals";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Mock data for analytics
const placementsByMonth = [
  { month: "Jan", placed: 12, pending: 8 },
  { month: "Feb", placed: 18, pending: 5 },
  { month: "Mar", placed: 25, pending: 10 },
  { month: "Apr", placed: 32, pending: 7 },
  { month: "May", placed: 28, pending: 12 },
  { month: "Jun", placed: 35, pending: 8 },
];

const industryDistribution = [
  { name: "Technology", value: 35, color: "#00E5FF" },
  { name: "Finance", value: 25, color: "#FF00D4" },
  { name: "Engineering", value: 20, color: "#C752FF" },
  { name: "Healthcare", value: 12, color: "#7C4DFF" },
  { name: "Other", value: 8, color: "#4CAF50" },
];

const timeToPlacement = [
  { week: "Week 1", students: 5 },
  { week: "Week 2", students: 12 },
  { week: "Week 3", students: 28 },
  { week: "Week 4", students: 45 },
  { week: "Week 5", students: 62 },
  { week: "Week 6", students: 78 },
  { week: "Week 7", students: 85 },
  { week: "Week 8", students: 92 },
];

const regionalData = [
  { province: "Gauteng", placements: 45, percentage: 35 },
  { province: "Western Cape", placements: 28, percentage: 22 },
  { province: "KwaZulu-Natal", placements: 22, percentage: 17 },
  { province: "Eastern Cape", placements: 15, percentage: 12 },
  { province: "Other", placements: 18, percentage: 14 },
];

export default function UniversityAnalytics() {
  const { stats, isLoading } = useUniversity();

  if (isLoading) {
    return (
      <UniversityDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </UniversityDashboardLayout>
    );
  }

  return (
    <UniversityDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-display font-bold flex items-center gap-3"
          >
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics Dashboard
          </motion.h1>
          <p className="text-muted-foreground">
            Insights and trends for WIL placements (Demo Data)
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Placements Over Time */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Placements Over Time</h2>
                <p className="text-sm text-muted-foreground">Monthly placement trends</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="placed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Industry Distribution */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/20">
                <PieChart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-semibold">Industry Distribution</h2>
                <p className="text-sm text-muted-foreground">Placements by sector</p>
              </div>
            </div>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <RechartsPie>
                  <Pie
                    data={industryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {industryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="w-40 space-y-2">
                {industryDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Time to Placement */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-semibold">Time to Placement</h2>
                <p className="text-sm text-muted-foreground">Cumulative placement curve</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeToPlacement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={{ fill: "#4CAF50" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Regional Distribution */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold">Regional Distribution</h2>
                <p className="text-sm text-muted-foreground">Placements by province</p>
              </div>
            </div>
            <div className="space-y-4">
              {regionalData.map((region) => (
                <div key={region.province}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{region.province}</span>
                    <span className="text-muted-foreground">
                      {region.placements} ({region.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Summary Stats */}
        <GlassCard className="p-6">
          <h2 className="font-semibold mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.placementRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">4.2</div>
              <div className="text-sm text-muted-foreground">Avg. Weeks to Place</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">87%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">4.5/5</div>
            <div className="text-sm text-muted-foreground">Employer Satisfaction</div>
            </div>
          </div>
        </GlassCard>

        {/* Regional Labour Signals - AI-powered demand mapping */}
        <RegionalLabourSignals />
      </div>
    </UniversityDashboardLayout>
  );
}
