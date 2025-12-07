import { GlassCard } from "@/components/ui/GlassCard";
import { 
  UserPlus, 
  FileText, 
  Target, 
  Briefcase,
  ArrowRight,
  Sparkles
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and build your profile with your education, skills, and career goals. Our AI helps you shine.",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    number: "02",
    icon: FileText,
    title: "Build Your CV",
    description: "Use our AI-powered CV builder to create an ATS-friendly resume that stands out to employers.",
    color: "secondary",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    number: "03",
    icon: Target,
    title: "Get Matched",
    description: "Our AI analyzes your profile and matches you with opportunities that fit your skills and aspirations.",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    number: "04",
    icon: Briefcase,
    title: "Land Your Role",
    description: "Apply with confidence, prepare with our interview simulator, and start your career journey.",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background elements */}
      <div className="absolute inset-0 circuit-pattern opacity-30" />
      <div className="absolute top-1/3 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent font-ui text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            How{" "}
            <span className="text-glow text-primary">Intern US</span>{" "}
            Works
          </h2>
          <p className="text-muted-foreground text-lg">
            From sign-up to your first day at work, we've simplified every step of your career journey.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-50 blur-sm" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <GlassCard className="p-6 space-y-4 h-full hover-lift">
                  {/* Step Number */}
                  <div className="flex items-center justify-between">
                    <span className={`font-heading text-4xl font-bold text-${step.color}/30`}>
                      {step.number}
                    </span>
                    <div className={`h-12 w-12 rounded-xl bg-${step.color}/20 border border-${step.color}/30 flex items-center justify-center`}>
                      <step.icon className={`h-6 w-6 text-${step.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow connector - Mobile/Tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center pt-2">
                      <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
                    </div>
                  )}
                </GlassCard>

                {/* Desktop Node */}
                <div className="hidden lg:flex absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                  <div className={`h-6 w-6 rounded-full bg-${step.color} border-4 border-background shadow-lg shadow-${step.color}/50`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
