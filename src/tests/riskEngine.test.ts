import { describe, expect, it } from "vitest";
import { evaluatePlacementRisk, evaluatePlacementsWithAudit } from "@/lib/riskEngine";
import type { WILPlacement } from "@/hooks/useUniversity";

const basePlacement: Omit<WILPlacement, "id"> = {
  student_user_id: "student-1",
  university_user_id: "uni-1",
  employer_name: "Employer",
  opportunity_id: null,
  placement_type: "internship",
  status: "active",
  start_date: "2024-01-01",
  end_date: "2024-06-01",
  hours_completed: 120,
  hours_required: 480,
  supervisor_name: "",
  supervisor_email: "",
  assessment_score: 55,
  employer_feedback: null,
  student_feedback: null,
  risk_level: "low",
  risk_factors: [],
  notes: null,
  created_at: "2024-01-01",
  updated_at: "2024-01-02",
  student_profile: { first_name: "Test", last_name: "Student", email: "test@example.com" },
  student_details: { institution: "University of Cape Town", qualification: "", field_of_study: "" },
};

describe("riskEngine", () => {
  it("escalates risk when completion and assessments are low", () => {
    const placement: WILPlacement = {
      ...basePlacement,
      id: "p1",
      risk_factors: ["Attendance below 70%", "Supervisor concern"],
    };

    const result = evaluatePlacementRisk(placement);
    expect(result.level).toBe("high");
    expect(result.rationale.some((item) => item.includes("Hours completion"))).toBe(true);
    expect(result.flagged).toBe(true);
  });

  it("records fairness metrics by province and institution", () => {
    const placements: WILPlacement[] = [
      {
        ...basePlacement,
        id: "p1",
        risk_factors: ["Attendance below 70%"],
      },
      {
        ...basePlacement,
        id: "p2",
        student_details: {
          institution: "University of the Witwatersrand",
          qualification: "",
          field_of_study: "",
        },
        risk_factors: [],
        assessment_score: 80,
        hours_completed: 400,
        risk_level: "low",
      },
    ];

    const { fairnessByProvince, fairnessByInstitution, evaluatedPlacements } = evaluatePlacementsWithAudit(placements);

    const westernCape = fairnessByProvince.find((metric) => metric.bucket === "Western Cape");
    const gauteng = fairnessByProvince.find((metric) => metric.bucket === "Gauteng");

    expect(westernCape?.flagged).toBe(1);
    expect(gauteng?.flagged).toBe(0);
    expect(evaluatedPlacements.length).toBe(2);

    const uctMetric = fairnessByInstitution.find((metric) => metric.bucket === "University of Cape Town");
    expect(uctMetric?.flagged).toBe(1);
  });
});
