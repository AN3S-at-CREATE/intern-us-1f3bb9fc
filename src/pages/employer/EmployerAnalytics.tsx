import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Eye,
  Clock,
  Target
} from "lucide-react";
import { EmployerDashboardLayout } from "@/components/employer/EmployerDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEmployerAnalytics } from "@/hooks/useEmployerAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { AIAvatar } from "@/components/ui/AIAvatar";
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
  Legend,
} from "recharts";

export default function EmployerAnalytics() {
  const {
    postingPerformance,
    applicationsOverTime,
    statusDistribution,
    applicantQuality,
    avgTimeToHire,
    stats,
    isLoading,
  } = useEmployerAnalytics();

  if (isLoading) {
    return (
      <EmployerDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </EmployerDashboardLayout>
    );
  }

  return (
    <EmployerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-heading font-bold flex items-center gap-3"
          >
            <BarChart3 className="h-8 w-8 text-primary" />
            Hiring Analytics
          </motion.h1>
          <p className="text-muted-foreground">
            Track your recruitment performance and candidate quality
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.totalViews}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-secondary">{stats.totalApplications}</div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.activePostings}</div>
            <div className="text-sm text-muted-foreground">Active Postings</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.avgConversionRate}%</div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">{stats.highQualityCandidates}</div>
            <div className="text-sm text-muted-foreground">High Fit Candidates</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">{avgTimeToHire}d</div>
            <div className="text-sm text-muted-foreground">Avg Time to Hire</div>
          </GlassCard>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Applications Over Time */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Applications Over Time</h2>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationsOverTime}>
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
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Application Status Distribution */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/20">
                <PieChart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-semibold">Application Status</h2>
                <p className="text-sm text-muted-foreground">Current pipeline</p>
              </div>
            </div>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <RechartsPie>
                  <Pie
                    data={statusDistribution.filter(s => s.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusDistribution.filter(s => s.value > 0).map((entry, index) => (
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
                {statusDistribution.filter(s => s.value > 0).map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Candidate Quality */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Target className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-semibold">Candidate Quality</h2>
                <p className="text-sm text-muted-foreground">By AI match score</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicantQuality} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {applicantQuality.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Posting Performance */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold">Posting Performance</h2>
                <p className="text-sm text-muted-foreground">Views vs Applications</p>
              </div>
            </div>
            <div className="h-64">
              {postingPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={postingPerformance.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="title" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="applications" fill="hsl(var(--secondary))" name="Applications" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Post opportunities to see performance</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Insights */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <AIAvatar emotion="idea" size="md" />
            <div>
              <h2 className="font-semibold">AI Insights</h2>
              <p className="text-sm text-muted-foreground">Recommendations for better hiring</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">🎯 Candidate Quality</h3>
              <p className="text-sm text-muted-foreground">
                {stats.highQualityCandidates > 0
                  ? `${stats.highQualityCandidates} high-quality candidates (70%+ match) are in your pipeline.`
                  : "Add more detailed job requirements to attract better-matched candidates."}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">📈 Conversion Tips</h3>
              <p className="text-sm text-muted-foreground">
                {parseFloat(stats.avgConversionRate) > 5
                  ? "Your conversion rate is healthy. Consider featuring top-performing postings."
                  : "Improve job descriptions with AI assistance to increase application rates."}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">⏱️ Speed Matters</h3>
              <p className="text-sm text-muted-foreground">
                Average time to hire is {avgTimeToHire} days. Top candidates often accept offers within 2 weeks.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </EmployerDashboardLayout>
  );
}
