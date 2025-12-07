import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { GraduationCap, Building2, School, ArrowRight, ArrowLeft, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "student" | "employer" | "university" | null;

const roles = [
  {
    id: "student" as const,
    icon: GraduationCap,
    title: "I'm a Student",
    description: "Looking for internships, WIL opportunities, vacation work, or graduate positions.",
    features: ["Build your profile", "Get AI job matches", "Track applications", "Develop skills"],
    gradient: "from-primary to-accent",
    glow: "cyan" as const,
  },
  {
    id: "employer" as const,
    icon: Building2,
    title: "I'm an Employer",
    description: "Looking to hire talented students and graduates for roles at my company.",
    features: ["Post opportunities", "AI candidate matching", "Blind hiring mode", "Track conversions"],
    gradient: "from-secondary to-neon-purple",
    glow: "magenta" as const,
  },
  {
    id: "university" as const,
    icon: School,
    title: "I'm from a University",
    description: "Managing WIL placements, tracking student outcomes, and meeting compliance.",
    features: ["Placement dashboard", "Faculty analytics", "DHET reporting", "Risk monitoring"],
    gradient: "from-accent to-primary",
    glow: "violet" as const,
  },
];

const GetStarted = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedRole = searchParams.get("role") as Role;
  const [selectedRole, setSelectedRole] = useState<Role>(preselectedRole);

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/signup?role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-ui text-sm mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              Let's Get You{" "}
              <span className="text-glow text-primary">Started</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Select your role to create an account tailored to your needs.
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {roles.map((role) => (
              <GlassCard
                key={role.id}
                glow={role.glow}
                className={cn(
                  "p-8 space-y-6 cursor-pointer transition-all duration-300",
                  selectedRole === role.id && "ring-2 ring-primary shadow-neon-lg"
                )}
                onClick={() => setSelectedRole(role.id)}
              >
                {/* Selection indicator */}
                <div className="flex items-start justify-between">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.gradient} shadow-neon`}>
                    <role.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedRole === role.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedRole === role.id && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center space-y-4">
            <NeonButton
              size="lg"
              disabled={!selectedRole}
              onClick={handleContinue}
              className="group"
            >
              Continue
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </NeonButton>
            
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;