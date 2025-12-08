import { Switch } from "@/components/ui/switch";
import { Shield, AlertCircle, Database, Users, Sparkles, Mail, BarChart3, Share2 } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface POPIAConsentStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

const consentItems = [
  {
    key: "data_collection" as const,
    icon: Database,
    label: "Data Collection & Storage",
    description: "Allow us to collect and store your personal information for platform functionality.",
    required: true,
  },
  {
    key: "profile_sharing" as const,
    icon: Users,
    label: "Profile Sharing with Employers",
    description: "Allow employers to view your profile when you apply for opportunities.",
    required: true,
  },
  {
    key: "ai_processing" as const,
    icon: Sparkles,
    label: "AI-Powered Features",
    description: "Allow AI to analyze your profile for match scoring, CV enhancement, and career recommendations.",
    required: false,
  },
  {
    key: "marketing_communications" as const,
    icon: Mail,
    label: "Marketing Communications",
    description: "Receive promotional emails about new features, opportunities, and platform updates.",
    required: false,
  },
  {
    key: "analytics" as const,
    icon: BarChart3,
    label: "Analytics & Improvement",
    description: "Allow anonymized data usage to improve platform features and user experience.",
    required: false,
  },
  {
    key: "third_party_sharing" as const,
    icon: Share2,
    label: "Third-Party Integrations",
    description: "Share data with partner services for enhanced functionality (e.g., calendar integrations).",
    required: false,
  },
];

export function POPIAConsentStep({ data, updateData }: POPIAConsentStepProps) {
  const handleConsentChange = (key: keyof typeof data.consents, value: boolean) => {
    updateData({
      consents: {
        ...data.consents,
        [key]: value,
      },
    });
  };

  const requiredConsentsGiven = data.consents.data_collection && data.consents.profile_sharing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-ui font-semibold text-sm">POPIA Compliance</h3>
          <p className="text-muted-foreground text-xs mt-1">
            In accordance with South Africa's Protection of Personal Information Act, we need your
            consent to process your data. You can change these preferences anytime in your Privacy
            Center.
          </p>
        </div>
      </div>

      {/* Required Consents Alert */}
      {!requiredConsentsGiven && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive text-xs">
            The first two consents are required to use the platform.
          </p>
        </div>
      )}

      {/* Consent Items */}
      <div className="space-y-4">
        {consentItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors ${
              data.consents[item.key]
                ? "bg-primary/5 border-primary/30"
                : "bg-muted/30 border-border/50"
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <item.icon
                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  data.consents[item.key] ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-ui text-sm font-medium">{item.label}</span>
                  {item.required && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/20 text-destructive">
                      REQUIRED
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
              </div>
            </div>
            <Switch
              checked={data.consents[item.key]}
              onCheckedChange={(checked) => handleConsentChange(item.key, checked)}
              disabled={item.required && data.consents[item.key]}
            />
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <p className="text-muted-foreground text-xs text-center">
        You can withdraw consent at any time through the Privacy Center in your account settings.
      </p>
    </div>
  );
}
