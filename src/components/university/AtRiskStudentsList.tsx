import { motion } from "framer-motion";
import { AlertTriangle, Mail, MessageSquare, ShieldQuestion, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { WILPlacement } from "@/hooks/useUniversity";
import type { RiskDecision } from "@/lib/riskEngine";

interface EvaluatedPlacement extends WILPlacement {
  riskDecision: RiskDecision;
}

interface AtRiskStudentsListProps {
  placements: EvaluatedPlacement[];
  onContactStudent?: (placement: WILPlacement) => void;
  onCreateIntervention?: (placement: WILPlacement) => void;
}

const riskFactorLabels: Record<string, { label: string; color: string }> = {
  low_attendance: { label: "Low Attendance", color: "bg-yellow-500/20 text-yellow-400" },
  poor_performance: { label: "Poor Performance", color: "bg-red-500/20 text-red-400" },
  no_response: { label: "No Response", color: "bg-orange-500/20 text-orange-400" },
  supervisor_concern: { label: "Supervisor Concern", color: "bg-red-500/20 text-red-400" },
  deadline_risk: { label: "Deadline Risk", color: "bg-yellow-500/20 text-yellow-400" },
  incomplete_docs: { label: "Incomplete Docs", color: "bg-blue-500/20 text-blue-400" },
};

export function AtRiskStudentsList({
  placements,
  onContactStudent,
  onCreateIntervention,
}: AtRiskStudentsListProps) {
  if (placements.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
          <AlertTriangle className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No At-Risk Students Ready to View</h3>
        <p className="text-muted-foreground">
          All flagged students either opted out, appealed, or are awaiting consent.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {placements.map((placement, index) => {
        const progress = placement.hours_required > 0
          ? Math.round((placement.hours_completed / placement.hours_required) * 100)
          : 0;
        const isHighRisk = placement.riskDecision.level === "high";

        return (
          <motion.div
            key={placement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard
              className={`p-5 border-l-4 ${
                isHighRisk ? "border-l-red-500" : "border-l-yellow-500"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Student Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isHighRisk ? "bg-red-500/20" : "bg-yellow-500/20"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          isHighRisk ? "text-red-400" : "text-yellow-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {placement.student_profile?.first_name || "Student"}{" "}
                          {placement.student_profile?.last_name ||
                            placement.student_user_id.slice(0, 8)}
                        </h3>
                        <Badge
                          className={`ml-auto ${
                            isHighRisk
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {isHighRisk ? "High Risk" : "Medium Risk"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {placement.student_details?.qualification || "Qualification pending"} • {" "}
                        {placement.employer_name || "Employer TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Audit score</p>
                      <p className="font-semibold">{placement.riskDecision.score} / 100</p>
                      <p className="text-xs text-muted-foreground">{placement.riskDecision.inputs.status}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Completion</p>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="flex-1 h-2" />
                        <span>{progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {placement.hours_completed}/{placement.hours_required} hrs
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Fairness bucket</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {placement.riskDecision.inputs.province}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {placement.riskDecision.inputs.institution}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(placement.risk_factors) &&
                      placement.risk_factors.map((factor: string, i: number) => {
                        const config = riskFactorLabels[factor] || {
                          label: factor,
                          color: "bg-muted text-muted-foreground",
                        };
                        return (
                          <Badge key={i} className={config.color}>
                            {config.label}
                          </Badge>
                        );
                      })}
                  </div>

                  {/* Rationales */}
                  <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <ShieldQuestion className="h-4 w-4" />
                      Why flagged
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {placement.riskDecision.rationale.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onContactStudent?.(placement)}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onCreateIntervention?.(placement)}
                    className={
                      isHighRisk
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Intervene
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/30">
                    <Sparkles className="h-4 w-4" />
                    Inputs & rationale logged for governance.
                  </div>
                </div>
              </div>

              {/* Notes */}
              {placement.notes && (
                <div className="mt-3 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                  <strong>Notes:</strong> {placement.notes}
                </div>
              )}
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
