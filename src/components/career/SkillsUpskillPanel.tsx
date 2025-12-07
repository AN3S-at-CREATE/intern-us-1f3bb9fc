import { motion } from 'framer-motion';
import { BookOpen, Zap, Target, ExternalLink } from 'lucide-react';
import { SkillToAcquire } from '@/hooks/useCareerAdvisor';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SkillsUpskillPanelProps {
  skills: SkillToAcquire[];
}

const priorityConfig = {
  high: { 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10', 
    borderColor: 'border-red-500/30',
    progress: 100,
    label: 'High Priority'
  },
  medium: { 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/10', 
    borderColor: 'border-yellow-500/30',
    progress: 66,
    label: 'Medium Priority'
  },
  low: { 
    color: 'text-green-400', 
    bgColor: 'bg-green-500/10', 
    borderColor: 'border-green-500/30',
    progress: 33,
    label: 'Low Priority'
  }
};

export const SkillsUpskillPanel = ({ skills }: SkillsUpskillPanelProps) => {
  const sortedSkills = [...skills].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-accent/20">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Skills to Acquire</h3>
          <p className="text-sm text-muted-foreground">
            Prioritized learning path for your career goals
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSkills.map((skill, index) => {
          const config = priorityConfig[skill.priority];
          
          return (
            <motion.div
              key={skill.skill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={`p-4 ${config.borderColor} border`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <Target className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{skill.skill}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${config.color} ${config.borderColor}`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {skill.reasoning}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Priority Level</span>
                    <span className={config.color}>{skill.priority}</span>
                  </div>
                  <Progress 
                    value={config.progress} 
                    className="h-1.5"
                  />
                </div>

                {skill.learningResources.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Recommended Resources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skill.learningResources.map((resource, i) => (
                        <Badge 
                          key={i}
                          variant="secondary"
                          className="text-xs bg-background/50 cursor-pointer hover:bg-primary/20 transition-colors"
                        >
                          {resource}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
