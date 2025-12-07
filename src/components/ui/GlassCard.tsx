import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: "cyan" | "magenta" | "violet" | "none";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, glow = "cyan", children, ...props }, ref) => {
    const glowStyles = {
      cyan: "before:from-primary/30 before:to-secondary/20 hover:shadow-neon",
      magenta: "before:from-secondary/30 before:to-accent/20 hover:shadow-neon-magenta",
      violet: "before:from-accent/30 before:to-primary/20",
      none: "before:from-transparent before:to-transparent",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6",
          hover && "hover-lift cursor-pointer",
          glowStyles[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };