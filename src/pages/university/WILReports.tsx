import { motion } from "framer-motion";
import { FileText, History, Download } from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { WILReportGenerator } from "@/components/university/WILReportGenerator";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";

export default function WILReports() {
  const { generateReport, isLoading, stats } = useUniversity();

  if (isLoading) {
    return (
      <UniversityDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
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
              <FileText className="h-8 w-8 text-primary" />
              WIL Reports
            </motion.h1>
            <p className="text-muted-foreground">
              Generate AI-powered reports for DHET/SETA compliance
            </p>
          </div>
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            Report History
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.placementRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Placement Rate</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.completedPlacements}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.atRiskStudents}</div>
            <div className="text-sm text-muted-foreground">At Risk</div>
          </GlassCard>
        </div>

        {/* Report Generator */}
        <WILReportGenerator onGenerateReport={generateReport} />

        {/* Report Templates Info */}
        <GlassCard className="p-6">
          <h2 className="font-semibold mb-4">Available Report Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-border/50">
              <h3 className="font-medium text-primary">Placement Summary</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive overview with KPIs, statistics, and recommendations
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border/50">
              <h3 className="font-medium text-yellow-400">Risk Assessment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                At-risk student analysis with intervention strategies
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border/50">
              <h3 className="font-medium text-green-400">Compliance Checklist</h3>
              <p className="text-sm text-muted-foreground mt-1">
                DHET/SETA submission requirements and documentation
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border/50">
              <h3 className="font-medium text-purple-400">Quarterly Report</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Period progress, achievements, and goals
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </UniversityDashboardLayout>
  );
}
