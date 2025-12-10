import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Download, Mail, Scale, ShieldCheck } from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { AtRiskStudentsList } from "@/components/university/AtRiskStudentsList";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { evaluatePlacementsWithAudit } from "@/lib/riskEngine";

type GovernanceStatus = {
  consented: boolean;
  optedOut: boolean;
  appealStatus: "none" | "pending" | "approved" | "rejected";
  appealNote?: string;
};

export default function AtRiskStudents() {
  const { placements, stats, isLoading } = useUniversity();

  const { evaluatedPlacements, fairnessByProvince, fairnessByInstitution } = useMemo(
    () => evaluatePlacementsWithAudit(placements),
    [placements]
  );

  const flaggedPlacements = evaluatedPlacements.filter((p) => p.riskDecision.flagged);

  const [governanceState, setGovernanceState] = useState<Record<string, GovernanceStatus>>({});

  useEffect(() => {
    setGovernanceState((prev) => {
      const next = { ...prev };
      flaggedPlacements.forEach((placement) => {
        if (!next[placement.id]) {
          next[placement.id] = {
            consented: false,
            optedOut: false,
            appealStatus: "none",
            appealNote: "",
          };
        }
      });
      return next;
    });
  }, [flaggedPlacements]);

  const updateGovernance = (id: string, updates: Partial<GovernanceStatus>) => {
    setGovernanceState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }));
  };

  const visiblePlacements = flaggedPlacements.filter((placement) => {
    const state = governanceState[placement.id];
    if (!state) return false;
    if (!state.consented) return false;
    if (state.optedOut) return false;
    if (state.appealStatus === "pending") return false;
    return true;
  });

  const highRiskCount = visiblePlacements.filter((p) => p.riskDecision.level === "high").length;
  const mediumRiskCount = visiblePlacements.filter((p) => p.riskDecision.level === "medium").length;
  const suppressedCount = flaggedPlacements.length - visiblePlacements.length;
  const provinceMetrics = useMemo(
    () => [...fairnessByProvince].sort((a, b) => b.flagRate - a.flagRate),
    [fairnessByProvince]
  );
  const institutionMetrics = useMemo(
    () => [...fairnessByInstitution].sort((a, b) => b.flagRate - a.flagRate),
    [fairnessByInstitution]
  );

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
              Transparent rules + ML audit with consent, opt-out, and fairness controls
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-5 border-l-4 border-l-red-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">{highRiskCount}</div>
                <div className="text-sm text-muted-foreground">High Risk (consented)</div>
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
                <div className="text-sm text-muted-foreground">Medium Risk (consented)</div>
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
                    ? ((visiblePlacements.length / stats.totalStudents) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Visible At-Risk Rate</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-l-4 border-l-slate-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-500/20">
                <ShieldCheck className="h-6 w-6 text-slate-300" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-200">{suppressedCount}</div>
                <div className="text-sm text-muted-foreground">Hidden (consent/appeal)</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Consent + Appeals Gate */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Governance gate: consent, opt-out, appeals
              </h3>
              <p className="text-sm text-muted-foreground">
                Flags surface only after consent is captured, opt-outs respected, and appeals cleared.
              </p>
            </div>
            <Badge variant="outline">
              {visiblePlacements.length}/{flaggedPlacements.length} visible
            </Badge>
          </div>

          {flaggedPlacements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No flagged students right now.</p>
          ) : (
            <div className="space-y-3">
              {flaggedPlacements.map((placement) => {
                const state = governanceState[placement.id];
                return (
                  <div
                    key={placement.id}
                    className="grid md:grid-cols-4 gap-3 p-3 rounded-lg border border-border/50"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{placement.student_profile?.first_name || "Student"} {placement.student_profile?.last_name || ""}</p>
                      <p className="text-xs text-muted-foreground">
                        {placement.riskDecision.level.toUpperCase()} • {placement.riskDecision.inputs.province}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Consent to AI/rules engine</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={state?.consented || false}
                          onCheckedChange={(checked) => updateGovernance(placement.id, { consented: checked })}
                        />
                        <span className="text-xs text-muted-foreground">{state?.consented ? "Captured" : "Pending"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Opt-out respected</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={state?.optedOut || false}
                          onCheckedChange={(checked) => updateGovernance(placement.id, { optedOut: checked })}
                        />
                        <span className="text-xs text-muted-foreground">{state?.optedOut ? "Hidden" : "Visible when consented"}</span>
                      </div>
                      {state?.optedOut && (
                        <Input
                          placeholder="Opt-out reason"
                          value={state.appealNote || ""}
                          onChange={(e) => updateGovernance(placement.id, { appealNote: e.target.value })}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Appeal status</Label>
                      <Select
                        value={state?.appealStatus || "none"}
                        onValueChange={(value) => updateGovernance(placement.id, { appealStatus: value as GovernanceStatus["appealStatus"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Appeal status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No appeal</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      {state?.appealStatus !== "none" && (
                        <Textarea
                          placeholder="Appeal notes"
                          className="h-16"
                          value={state.appealNote || ""}
                          onChange={(e) => updateGovernance(placement.id, { appealNote: e.target.value })}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Fairness Metrics */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Scale className="h-5 w-5" /> Fairness metrics (flag share)
            </h3>
            <p className="text-xs text-muted-foreground">Recorded by province and institution</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Province</p>
              <div className="space-y-2">
                {provinceMetrics.map((metric) => (
                  <div key={metric.bucket} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{metric.bucket}</p>
                      <p className="text-xs text-muted-foreground">{metric.flagged}/{metric.total} flagged</p>
                    </div>
                    <Badge variant="outline">{metric.flagRate}%</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Institution</p>
              <div className="space-y-2">
                {institutionMetrics.map((metric) => (
                  <div key={metric.bucket} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{metric.bucket}</p>
                      <p className="text-xs text-muted-foreground">{metric.flagged}/{metric.total} flagged</p>
                    </div>
                    <Badge variant="outline">{metric.flagRate}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Risk Factors Info */}
        <GlassCard className="p-4">
          <h3 className="font-medium mb-3">Signals captured by rules + ML explainer</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
              Attendance & hours progression
            </span>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
              Assessment under 60%
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm">
              Supervisor concerns
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
              Missing paperwork/contact
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
              Province/institution fairness buckets
            </span>
          </div>
        </GlassCard>

        {/* At-Risk Students List */}
        <AtRiskStudentsList
          placements={visiblePlacements}
          onContactStudent={handleContactStudent}
          onCreateIntervention={handleCreateIntervention}
        />
      </div>
    </UniversityDashboardLayout>
  );
}
