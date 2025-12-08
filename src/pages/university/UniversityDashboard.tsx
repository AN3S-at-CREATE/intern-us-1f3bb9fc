import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Plus,
  Download,
  ArrowRight,
} from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { WILStatsCards } from "@/components/university/WILStatsCards";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";

export default function UniversityDashboard() {
  const { universityProfile, placements, stats, isLoading } = useUniversity();

  // Get recent at-risk students
  const atRiskStudents = placements.filter(
    (p) => p.risk_level === "high" || p.risk_level === "medium"
  ).slice(0, 3);

  // Get recent placements
  const recentPlacements = placements.slice(0, 5);

  if (isLoading) {
    return (
      <UniversityDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </UniversityDashboardLayout>
    );
  }

  return (
    <UniversityDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-display font-bold"
            >
              Welcome, {universityProfile?.institution_name || "WIL Officer"}
            </motion.h1>
            <p className="text-muted-foreground">
              WIL Management Dashboard • {new Date().toLocaleDateString("en-ZA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/university/reports">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Link>
            </Button>
            <Button asChild>
              <Link to="/university/placements">
                <Plus className="h-4 w-4 mr-2" />
                Add Placement
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <WILStatsCards stats={stats} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* At-Risk Students */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="font-semibold">At-Risk Students</h2>
                  <p className="text-sm text-muted-foreground">
                    Require immediate attention
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/university/at-risk">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            {atRiskStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No at-risk students</p>
                <p className="text-sm">All placements are progressing well</p>
              </div>
            ) : (
              <div className="space-y-3">
                {atRiskStudents.map((placement) => (
                  <motion.div
                    key={placement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      placement.risk_level === "high"
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-yellow-500/30 bg-yellow-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {placement.student_profile?.first_name || "Student"}{" "}
                          {placement.student_profile?.last_name || ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {placement.employer_name || "Placement pending"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          placement.risk_level === "high"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {placement.risk_level === "high" ? "High Risk" : "Medium Risk"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Recent Placements */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Recent Placements</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest student placements
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/university/placements">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            {recentPlacements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No placements yet</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/university/placements">Add First Placement</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPlacements.map((placement) => (
                  <motion.div
                    key={placement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {placement.student_profile?.first_name || "Student"}{" "}
                          {placement.student_profile?.last_name || ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {placement.employer_name || "TBD"} • {placement.placement_type}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          placement.status === "placed" || placement.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : placement.status === "completed"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {placement.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/university/placements">
                <Plus className="h-5 w-5" />
                <span>Add Placement</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/university/reports">
                <FileText className="h-5 w-5" />
                <span>Generate Report</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/university/at-risk">
                <AlertTriangle className="h-5 w-5" />
                <span>View At-Risk</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/university/analytics">
                <TrendingUp className="h-5 w-5" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </UniversityDashboardLayout>
  );
}
