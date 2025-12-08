import { Link } from "react-router-dom";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Sparkles, TrendingUp, Users, Briefcase } from "lucide-react";
import heroStudents from "@/assets/landing/hero-students-sa.jpg";
export function HeroSection() {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Hero Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
      backgroundImage: `url(${heroStudents})`
    }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 crystal-pattern opacity-25" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-float" style={{
      animationDelay: "3s"
    }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary font-ui text-sm">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Career Matching</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Finish Your Degree.{" "}
              <span className="text-glow bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Start Your Legacy.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              South Africa's premier platform connecting students with internships, WIL opportunities, vacation work, and graduate jobs through intelligent AI matching.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <NeonButton size="lg" className="w-full sm:w-auto group" asChild>
                <Link to="/get-started">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </NeonButton>
              <NeonButton variant="ghost" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/employers">
                  I'm an Employer
                </Link>
              </NeonButton>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <p className="font-heading text-3xl font-bold text-primary">25K+</p>
                <p className="text-muted-foreground text-sm">Active Students</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-3xl font-bold text-secondary">500+</p>
                <p className="text-muted-foreground text-sm">Partner Companies</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-3xl font-bold text-accent">85%</p>
                <p className="text-muted-foreground text-sm">Placement Rate</p>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
            <GlassCard className="p-8 space-y-6" hover={false}>
              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-ui">Career Readiness</p>
                  <p className="font-heading text-2xl font-bold text-foreground">78%</p>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" strokeDasharray="176" strokeDashoffset="38.72" strokeLinecap="round" />
                  </svg>
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Mini Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">New Matches</p>
                  <p className="font-heading text-xl font-bold text-foreground">12</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                  <Briefcase className="h-5 w-5 text-secondary" />
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="font-heading text-xl font-bold text-foreground">5</p>
                </div>
              </div>

              {/* Match Preview */}
              <div className="space-y-3">
                <p className="text-sm font-ui text-muted-foreground">Top Match for You</p>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="font-heading font-bold text-primary">ST</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-foreground">Software Intern</p>
                    <p className="text-sm text-muted-foreground">Standard Bank • Johannesburg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-primary">92%</p>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 p-3 rounded-xl bg-secondary/20 border border-secondary/30 backdrop-blur-sm animate-float" style={{
            animationDelay: "1s"
          }}>
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-accent/20 border border-accent/30 backdrop-blur-sm animate-float" style={{
            animationDelay: "2s"
          }}>
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>;
}