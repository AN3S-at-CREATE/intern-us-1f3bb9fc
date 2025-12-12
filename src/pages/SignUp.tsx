import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { OnboardingWizard, type OnboardingData } from "@/components/onboarding/OnboardingWizard";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const role = (searchParams.get("role") as "student" | "employer" | "university") || "student";
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: OnboardingData) => {
    setIsLoading(true);

    try {
      // 1. Create the user account
      const { error: signUpError } = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        role: role,
      });

      if (signUpError) {
        throw signUpError;
      }

      // Wait briefly for the auth state to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 2. Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Failed to get user after signup");
      }

      // 3. Save POPIA consents
      const consentPromises = Object.entries(data.consents).map(([consentType, isGranted]) =>
        supabase.from("popia_consents").insert({
          user_id: user.id,
          consent_type: consentType,
          is_granted: isGranted,
          granted_at: isGranted ? new Date().toISOString() : null,
        })
      );

      // 4. Save notification preferences
      const notificationPrefsPromise = supabase.from("notification_preferences").insert({
        user_id: user.id,
        email_enabled: data.notifications.email_enabled,
        in_app_enabled: data.notifications.in_app_enabled,
        whatsapp_enabled: data.notifications.whatsapp_enabled,
        whatsapp_number: data.notifications.whatsapp_number || null,
        opportunity_matches: data.notifications.opportunity_matches,
        application_updates: data.notifications.application_updates,
        interview_reminders: data.notifications.interview_reminders,
        community_activity: data.notifications.community_activity,
        marketing_updates: data.notifications.marketing_updates,
      });

      // Execute all saves in parallel
      await Promise.all([...consentPromises, notificationPrefsPromise]);

      toast.success("Account created successfully!");

      // Navigate to appropriate dashboard based on role
      const dashboardRoutes = {
        student: "/dashboard",
        employer: "/employer/dashboard",
        university: "/university/dashboard",
      };
      navigate(dashboardRoutes[role]);
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const message = error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-ui text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Change role
            </Link>

            <div className="flex items-center justify-center gap-2">
              <div className="p-2 rounded-xl bg-neon-gradient">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">
                Intern<span className="text-primary">US</span>
              </span>
            </div>
          </div>

          {/* Onboarding Wizard */}
          <OnboardingWizard role={role} onComplete={handleComplete} isLoading={isLoading} />

          {/* Sign In Link */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
