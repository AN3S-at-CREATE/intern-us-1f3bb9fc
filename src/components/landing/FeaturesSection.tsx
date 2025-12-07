import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Brain, 
  FileText, 
  Target, 
  MessageSquare, 
  Shield, 
  BarChart3,
  Sparkles,
  Users
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Job Matching",
    description: "Our AI analyzes your profile, skills, and preferences to match you with the perfect opportunities.",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "Voice CV Builder",
    description: "Record your experience and let AI transform it into a polished, ATS-friendly CV.",
    color: "text-secondary",
  },
  {
    icon: Target,
    title: "Blind Matching",
    description: "Anti-bias hiring that evaluates candidates on skills first, before revealing identity.",
    color: "text-accent",
  },
  {
    icon: MessageSquare,
    title: "AI Interview Prep",
    description: "Practice with industry-specific questions and get real-time feedback to build confidence.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "POPIA Compliant",
    description: "Your data is protected with consent management and full audit trails.",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track applications, measure progress, and get insights to improve your success rate.",
    color: "text-accent",
  },
  {
    icon: Sparkles,
    title: "Skills Modules",
    description: "Complete bite-sized courses to boost your profile and unlock better matches.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Community Squads",
    description: "Connect with mentors and peers for accountability, support, and shared learning.",
    color: "text-secondary",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 text-secondary font-ui text-sm mb-4">
            <Brain className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Everything You Need to{" "}
            <span className="text-glow-magenta text-secondary">Land Your Dream Role</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From building your profile to acing the interview, our AI-powered tools guide you every step of the way.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.title}
              className="p-6 space-y-4"
              glow="none"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${feature.color}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}