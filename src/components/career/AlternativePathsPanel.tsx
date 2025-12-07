import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, Percent } from 'lucide-react';
import { AlternativePath } from '@/hooks/useCareerAdvisor';
import { GlassCard } from '@/components/ui/GlassCard';
import { Progress } from '@/components/ui/progress';

interface AlternativePathsPanelProps {
  paths: AlternativePath[];
  onSelectPath?: (role: string) => void;
}

export const AlternativePathsPanel = ({ paths, onSelectPath }: AlternativePathsPanelProps) => {
  const sortedPaths = [...paths].sort((a, b) => b.relevance - a.relevance);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <GitBranch className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Alternative Career Paths</h3>
          <p className="text-sm text-muted-foreground">
            Other roles that match your profile
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedPaths.map((path, index) => (
          <motion.div
            key={path.role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className="p-4 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
              onClick={() => onSelectPath?.(path.role)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {path.role}
                </h4>
                <div className="flex items-center gap-1 text-sm">
                  <Percent className="w-3 h-3 text-accent" />
                  <span className="font-medium text-accent">{path.relevance}%</span>
                </div>
              </div>

              <div className="mb-3">
                <Progress 
                  value={path.relevance} 
                  className="h-1.5"
                />
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {path.reasoning}
              </p>

              <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore this path</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
