import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Target, 
  Briefcase, 
  GraduationCap,
  Sparkles 
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useStudentAnalytics } from "@/hooks/useStudentAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
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
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

const COLORS = ["#00E5FF", "#FF00D4", "#C752FF", "#7C4DFF", "#4CAF50", "#eab308"];

export default function StudentAnalytics() {
  const {
    applicationFunnel,
    applicationsOverTime,
    matchScoreDistribution,
    skillsByCategory,
    moduleProgress,
    avgMatchScore,
    isLoading,
  } = useStudentAnalytics();

  const funnelData = [
    { name: "Saved", value: applicationFunnel.saved, fill: "#7C4DFF" },
    { name: "Applied", value: applicationFunnel.applied, fill: "#C752FF" },
    { name: "Reviewed", value: applicationFunnel.reviewed, fill: "#FF00D4" },
    { name: "Interview", value: applicationFunnel.interview, fill: "#00E5FF" },
    { name: "Offer", value: applicationFunnel.offer, fill: "#22c55e" },
    { name: "Hired", value: applicationFunnel.hired, fill: "#4CAF50" },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-heading font-bold flex items-center gap-3"
          >
            <BarChart3 className="h-8 w-8 text-primary" />
            Your Analytics
          </motion.h1>
          <p className="text-muted-foreground">
            Track your career journey and progress
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {applicationFunnel.applied + applicationFunnel.saved}
            </div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-secondary">
              {avgMatchScore.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Match Score</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400">
              {moduleProgress.completed}
            </div>
            <div className="text-sm text-muted-foreground">Modules Completed</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">
              {skillsByCategory.reduce((acc, s) => acc + s.value, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Skills Added</div>
          </GlassCard>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Application Funnel */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Application Funnel</h2>
                <p className="text-sm text-muted-foreground">Your application journey</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                    <LabelList position="center" fill="hsl(var(--foreground))" stroke="none" dataKey="value" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Applications Over Time */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/20">
                <TrendingUp className="h-5 w-5 text-secondary" />
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

          {/* Match Score Distribution */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Sparkles className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-semibold">Match Score Distribution</h2>
                <p className="text-sm text-muted-foreground">Quality of your matches</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matchScoreDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="range" type="category" stroke="hsl(var(--muted-foreground))" width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {matchScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Skills by Category */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <GraduationCap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold">Skills by Category</h2>
                <p className="text-sm text-muted-foreground">Your skill distribution</p>
              </div>
            </div>
            <div className="h-64 flex items-center">
              {skillsByCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="60%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={skillsByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {skillsByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                    {skillsByCategory.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-muted-foreground truncate">{item.name}</span>
                        <span className="ml-auto font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full text-center text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add skills to see your distribution</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Module Progress */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/20">
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Learning Progress</h2>
              <p className="text-sm text-muted-foreground">Skills modules completion</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{moduleProgress.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{moduleProgress.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground">{moduleProgress.notStarted}</div>
              <div className="text-sm text-muted-foreground">Not Started</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{moduleProgress.avgScore.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Avg Quiz Score</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
