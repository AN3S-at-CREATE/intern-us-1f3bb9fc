import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { GraduationCap, Building2, School, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Build your profile, get matched with opportunities, and launch your career with AI-powered tools designed for South African graduates.",
    features: ["AI CV Builder", "Smart Job Matching", "Skills Modules", "Interview Prep"],
    href: "/get-started?role=student",
    glow: "cyan" as const,
    gradient: "from-primary to-accent",
  },
  {
    icon: Building2,
    title: "Employers",
    description: "Find pre-screened, work-ready candidates. Post opportunities and let our AI match you with the best talent from across South Africa.",
    features: ["Talent Dashboard", "Blind Matching", "B-BBEE Tracking", "Candidate Ranking"],
    href: "/get-started?role=employer",
    glow: "magenta" as const,
    gradient: "from-secondary to-neon-purple",
  },
  {
    icon: School,
    title: "Universities",
    description: "Manage WIL placements, track student outcomes, and meet compliance requirements with our comprehensive institutional dashboard.",
    features: ["Placement Tracking", "DHET Reporting", "Faculty Analytics", "Risk Alerts"],
    href: "/get-started?role=university",
    glow: "violet" as const,
    gradient: "from-accent to-primary",
  },
];

export function RolesSection() {
  return (
    <section className="py-24 relative" id="features">
      {/* Background */}
      <div className="absolute inset-0 circuit-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            One Platform.{" "}
            <span className="text-glow text-primary">Three Powerful Portals.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're a student seeking opportunities, an employer hunting for talent, or a university managing placements — we've got you covered.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <GlassCard
              key={role.title}
              glow={role.glow}
              className="p-8 space-y-6 group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.gradient} shadow-neon`}>
                <role.icon className="h-8 w-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {role.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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

              {/* CTA */}
              <Link to={role.href}>
                <NeonButton 
                  variant={role.glow === "cyan" ? "default" : "ghost"} 
                  className="w-full group/btn"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </NeonButton>
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}