import { WILPlacement } from "@/hooks/useUniversity";

export type RiskLevel = "low" | "medium" | "high";

export interface RiskInputs {
  completionRate: number;
  assessmentScore: number | null;
  riskFactors: string[];
  status: string;
  hasSupervisorFeedback: boolean;
  hoursOutstanding: number;
  province: string;
  institution: string;
}

export interface RiskDecision {
  placementId: string;
  level: RiskLevel;
  score: number;
  flagged: boolean;
  rationale: string[];
  inputs: RiskInputs;
}

export interface FairnessMetric {
  bucket: string;
  flagged: number;
  total: number;
  flagRate: number;
}

export interface EvaluatedPlacements {
  evaluatedPlacements: Array<WILPlacement & { riskDecision: RiskDecision }>;
  fairnessByProvince: FairnessMetric[];
  fairnessByInstitution: FairnessMetric[];
}

const provinceLookup: Record<string, string> = {
  "University of the Witwatersrand": "Gauteng",
  "University of Cape Town": "Western Cape",
  "University of Pretoria": "Gauteng",
  "University of Johannesburg": "Gauteng",
  "Stellenbosch University": "Western Cape",
  "University of KwaZulu-Natal": "KwaZulu-Natal",
  "Nelson Mandela University": "Eastern Cape",
  "North-West University": "North West",
  "Walter Sisulu University": "Eastern Cape",
  "Tshwane University of Technology": "Gauteng",
  "University of the Free State": "Free State",
  "University of South Africa": "Gauteng",
  "Rhodes University": "Eastern Cape",
};

function deriveProvince(institution?: string) {
  if (!institution) return "Unknown";
  return provinceLookup[institution] || "Unknown";
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function calculateCompletionRate(placement: WILPlacement) {
  if (!placement.hours_required || placement.hours_required === 0) return 0;
  return Math.min(100, Math.round((placement.hours_completed / placement.hours_required) * 100));
}

export function evaluatePlacementRisk(placement: WILPlacement): RiskDecision {
  const completionRate = calculateCompletionRate(placement);
  const riskFactors = Array.isArray(placement.risk_factors) ? placement.risk_factors : [];
  const rationale: string[] = [];
  let score = 10; // base signal

  if (completionRate < 50) {
    score += 30;
    rationale.push("Hours completion below 50%");
  } else if (completionRate < 75) {
    score += 15;
    rationale.push("Hours completion below 75%");
  }

  if (placement.assessment_score !== null && placement.assessment_score < 60) {
    score += 20;
    rationale.push("Assessment score under 60%");
  }

  if (placement.status === "withdrawn") {
    score += 30;
    rationale.push("Placement withdrawn");
  }

  if (placement.status === "pending") {
    score -= 5;
    rationale.push("Pending placement, risk suppressed");
  }

  riskFactors.forEach((factor) => {
    if (/attendance/i.test(factor)) {
      score += 15;
    }
    if (/health|withdrawal|failed|concern/i.test(factor)) {
      score += 20;
    }
    if (/transport|deadline|late/i.test(factor)) {
      score += 8;
    }
    rationale.push(`Signal: ${factor}`);
  });

  if (!placement.supervisor_email && placement.status === "active") {
    score += 5;
    rationale.push("Missing supervisor contact while active");
  }

  const level = scoreToLevel(score);
  const province = deriveProvince(placement.student_details?.institution);

  return {
    placementId: placement.id,
    level,
    score,
    flagged: level !== "low",
    rationale,
    inputs: {
      completionRate,
      assessmentScore: placement.assessment_score,
      riskFactors,
      status: placement.status,
      hasSupervisorFeedback: Boolean(placement.employer_feedback),
      hoursOutstanding: Math.max(0, (placement.hours_required || 0) - placement.hours_completed),
      province,
      institution: placement.student_details?.institution || "Unknown",
    },
  };
}

function buildFairnessMetrics(
  placements: Array<WILPlacement & { riskDecision: RiskDecision }>,
  key: "province" | "institution",
): FairnessMetric[] {
  const totals: Record<string, { flagged: number; total: number }> = {};

  placements.forEach((placement) => {
    const bucket = key === "province" ? placement.riskDecision.inputs.province : placement.riskDecision.inputs.institution;
    const current = totals[bucket] || { flagged: 0, total: 0 };
    const isFlagged = placement.riskDecision.flagged;

    totals[bucket] = {
      flagged: current.flagged + (isFlagged ? 1 : 0),
      total: current.total + 1,
    };
  });

  return Object.entries(totals).map(([bucket, values]) => ({
    bucket,
    flagged: values.flagged,
    total: values.total,
    flagRate: values.total > 0 ? Math.round((values.flagged / values.total) * 100) : 0,
  }));
}

export function evaluatePlacementsWithAudit(placements: WILPlacement[]): EvaluatedPlacements {
  const evaluatedPlacements = placements.map((placement) => ({
    ...placement,
    riskDecision: evaluatePlacementRisk(placement),
  }));

  const fairnessByProvince = buildFairnessMetrics(evaluatedPlacements, "province");
  const fairnessByInstitution = buildFairnessMetrics(evaluatedPlacements, "institution");

  return {
    evaluatedPlacements,
    fairnessByProvince,
    fairnessByInstitution,
  };
}
