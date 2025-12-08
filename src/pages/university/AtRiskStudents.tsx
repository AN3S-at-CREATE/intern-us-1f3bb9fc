import { motion } from "framer-motion";
import { AlertTriangle, Download, Mail } from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { AtRiskStudentsList } from "@/components/university/AtRiskStudentsList";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AtRiskStudents() {
  const { placements, stats, isLoading } = useUniversity();

  const atRiskPlacements = placements.filter(
    (p) => p.risk_level === "high" || p.risk_level === "medium"
  );

  const highRiskCount = placements.filter((p) => p.risk_level === "high").length;
  const mediumRiskCount = placements.filter((p) => p.risk_level === "medium").length;

  const handleContactStudent = (placement: any) => {
    toast.info(`Opening email for ${placement.student_profile?.first_name || "student"}...`);
  };

  const handleCreateIntervention = (placement: any) => {
    toast.info("Intervention tracking feature coming soon");
  };

  if (isLoading) {
    return (
      <UniversityDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
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
              className="text-2xl lg:text-3xl font-display font-bold flex items-center gap-3"
            >
              <AlertTriangle className="h-8 w-8 text-red-400" />
              At-Risk Students
            </motion.h1>
            <p className="text-muted-foreground">
              Students requiring intervention to complete their placements
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Bulk Contact
            </Button>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-5 border-l-4 border-l-red-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">{highRiskCount}</div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">{mediumRiskCount}</div>
                <div className="text-sm text-muted-foreground">Medium Risk</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {stats.totalStudents > 0
                    ? ((atRiskPlacements.length / stats.totalStudents) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">At-Risk Rate</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Risk Factors Info */}
        <GlassCard className="p-4">
          <h3 className="font-medium mb-3">Common Risk Indicators</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
              Low Attendance
            </span>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
              Poor Performance
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm">
              No Response
            </span>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
              Supervisor Concern
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
              Deadline Risk
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
              Incomplete Docs
            </span>
          </div>
        </GlassCard>

        {/* At-Risk Students List */}
        <AtRiskStudentsList
          placements={placements}
          onContactStudent={handleContactStudent}
          onCreateIntervention={handleCreateIntervention}
        />
      </div>
    </UniversityDashboardLayout>
  );
}
