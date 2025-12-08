import { Sparkles, CheckCircle2, GraduationCap, Building2, School } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface WelcomeStepProps {
  data: OnboardingData;
  role: "student" | "employer" | "university";
}

const roleInfo = {
  student: {
    icon: GraduationCap,
    title: "Welcome to Your Career Journey!",
    features: [
      "Complete your profile to get AI-matched opportunities",
      "Build a standout CV with AI assistance",
      "Track your applications in one place",
      "Develop skills with micro-learning modules",
    ],
  },
  employer: {
    icon: Building2,
    title: "Welcome to Your Hiring Hub!",
    features: [
      "Post opportunities and reach qualified candidates",
      "Use AI to find your best matches",
      "Track your recruitment pipeline",
      "Connect with top South African talent",
    ],
  },
  university: {
    icon: School,
    title: "Welcome to Your WIL Dashboard!",
    features: [
      "Track student placements in real-time",
      "Generate DHET-compliant reports",
      "Monitor at-risk students",
      "Access faculty-level analytics",
    ],
  },
};

export function WelcomeStep({ data, role }: WelcomeStepProps) {
  const info = roleInfo[role];

  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h3 className="font-heading text-2xl font-bold">
          {info.title}
        </h3>
        <p className="text-muted-foreground">
          Hi <span className="text-primary font-semibold">{data.firstName}</span>! Your account is
          ready. Here's what you can do next:
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-3 text-left max-w-md mx-auto">
        {info.features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* Consent Summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Privacy Preferences Saved:</span> You've
          enabled {Object.values(data.consents).filter(Boolean).length} of 6 consent options and{" "}
          {Object.values(data.notifications).filter((v) => v === true).length} notification types.
          You can update these anytime in Settings.
        </p>
      </div>
    </div>
  );
}
