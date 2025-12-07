import { Link } from "react-router-dom";
import { NeonButton } from "@/components/ui/NeonButton";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto space-y-8">
          {/* Icon */}
          <div className="inline-flex p-4 rounded-2xl bg-neon-gradient shadow-neon animate-glow-pulse">
            <Zap className="h-10 w-10 text-primary-foreground" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Start Your{" "}
              <span className="text-glow bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Career Journey?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Join thousands of South African students already using Intern US to land their dream opportunities.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-started">
              <NeonButton size="lg" className="w-full sm:w-auto group">
                Create Free Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </NeonButton>
            </Link>
            <Link to="/demo">
              <NeonButton variant="ghost" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </NeonButton>
            </Link>
          </div>

          {/* Trust badges */}
          <p className="text-muted-foreground text-sm">
            No credit card required • POPIA compliant • Free forever for students
          </p>
        </div>
      </div>
    </section>
  );
}