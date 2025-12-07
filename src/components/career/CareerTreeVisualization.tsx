import { motion } from 'framer-motion';
import { Briefcase, Clock, TrendingUp, Coins } from 'lucide-react';
import { PathwayStep } from '@/hooks/useCareerAdvisor';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';

interface CareerTreeVisualizationProps {
  steps: PathwayStep[];
  currentPosition: string;
  targetPosition: string;
}

export const CareerTreeVisualization = ({ 
  steps, 
  currentPosition, 
  targetPosition 
}: CareerTreeVisualizationProps) => {
  return (
    <div className="relative py-8">
      {/* Connection Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary" />
      
      {/* Start Node */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative mb-8 pl-16"
      >
        <div className="absolute left-6 top-4 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary))]" />
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Position</p>
              <p className="font-semibold text-foreground">{currentPosition}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Pathway Steps */}
      {steps.map((step, index) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className="relative mb-6 pl-16"
        >
          <div 
            className={`absolute left-6 top-6 w-4 h-4 rounded-full ${
              index === steps.length - 1 
                ? 'bg-secondary shadow-[0_0_15px_hsl(var(--secondary))]' 
                : 'bg-accent shadow-[0_0_10px_hsl(var(--accent))]'
            }`} 
          />
          
          <GlassCard 
            className={`p-5 transition-all duration-300 hover:translate-x-2 ${
              index === steps.length - 1 ? 'border-secondary/50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <Badge variant="outline" className="mb-2 text-xs">
                  Step {step.step}
                </Badge>
                <h4 className="font-bold text-lg text-foreground">{step.role}</h4>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">{step.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">{step.salaryRange}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Key Skills Required:</p>
              <div className="flex flex-wrap gap-2">
                {step.keySkills.map((skill, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary border-primary/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}

      {/* Target Node */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: steps.length * 0.15 }}
        className="relative pl-16"
      >
        <div className="absolute left-5 top-4 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_hsl(var(--primary))]">
          <TrendingUp className="w-4 h-4 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <GlassCard className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/30 to-secondary/30">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-primary">Target Position</p>
              <p className="font-bold text-lg text-foreground">{targetPosition}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
