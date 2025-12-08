import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AccountStep } from "./steps/AccountStep";
import { POPIAConsentStep } from "./steps/POPIAConsentStep";
import { NotificationPreferencesStep } from "./steps/NotificationPreferencesStep";
import { WelcomeStep } from "./steps/WelcomeStep";

export interface OnboardingData {
  // Account
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // POPIA Consents
  consents: {
    data_collection: boolean;
    profile_sharing: boolean;
    ai_processing: boolean;
    marketing_communications: boolean;
    analytics: boolean;
    third_party_sharing: boolean;
  };
  // Notification Preferences
  notifications: {
    email_enabled: boolean;
    in_app_enabled: boolean;
    whatsapp_enabled: boolean;
    whatsapp_number: string;
    opportunity_matches: boolean;
    application_updates: boolean;
    interview_reminders: boolean;
    community_activity: boolean;
    marketing_updates: boolean;
  };
}

interface OnboardingWizardProps {
  role: "student" | "employer" | "university";
  onComplete: (data: OnboardingData) => Promise<void>;
  isLoading?: boolean;
}

const steps = [
  { id: "account", title: "Create Account", description: "Set up your credentials" },
  { id: "popia", title: "Privacy Consent", description: "POPIA compliance" },
  { id: "notifications", title: "Notifications", description: "Stay informed" },
  { id: "welcome", title: "Welcome", description: "You're all set!" },
];

export function OnboardingWizard({ role, onComplete, isLoading }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    consents: {
      data_collection: false,
      profile_sharing: false,
      ai_processing: true,
      marketing_communications: false,
      analytics: true,
      third_party_sharing: false,
    },
    notifications: {
      email_enabled: true,
      in_app_enabled: true,
      whatsapp_enabled: false,
      whatsapp_number: "",
      opportunity_matches: true,
      application_updates: true,
      interview_reminders: true,
      community_activity: false,
      marketing_updates: false,
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: // Account
        return !!(
          data.firstName.trim() &&
          data.lastName.trim() &&
          data.email.trim() &&
          data.password.length >= 8
        );
      case 1: // POPIA - required consents must be checked
        return data.consents.data_collection && data.consents.profile_sharing;
      case 2: // Notifications - always can proceed
        return true;
      case 3: // Welcome
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
            >
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ${
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary text-primary shadow-neon"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-ui font-bold">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="font-heading text-xl font-bold">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground text-sm">{steps[currentStep].description}</p>
        </div>
        <Progress value={progress} className="mt-4 h-1" />
      </div>

      {/* Step Content */}
      <GlassCard className="p-8" hover={false}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && (
              <AccountStep data={data} updateData={updateData} role={role} />
            )}
            {currentStep === 1 && (
              <POPIAConsentStep data={data} updateData={updateData} />
            )}
            {currentStep === 2 && (
              <NotificationPreferencesStep data={data} updateData={updateData} />
            )}
            {currentStep === 3 && <WelcomeStep data={data} role={role} />}
          </motion.div>
        </AnimatePresence>
      </GlassCard>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <NeonButton
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </NeonButton>

        <NeonButton
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
        >
          {isLoading ? (
            "Creating Account..."
          ) : currentStep === steps.length - 1 ? (
            <>
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </NeonButton>
      </div>
    </div>
  );
}
