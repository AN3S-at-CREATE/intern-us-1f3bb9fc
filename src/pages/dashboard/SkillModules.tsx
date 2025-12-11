import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSkillModules, type Module, type SkillGapAnalysis, type Lesson } from '@/hooks/useSkillModules';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Zap, 
  Search,
  Play,
  CheckCircle2,
  TrendingUp,
  Award,
  Brain,
  Loader2,
  ChevronRight,
  Star
} from 'lucide-react';

const categoryColors: Record<string, string> = {
  'Soft Skills': 'bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30',
  'Technical': 'bg-primary/20 text-primary border-primary/30',
  'Career': 'bg-accent-violet/20 text-accent-violet border-accent-violet/30',
  'Life Skills': 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
};

const difficultyColors: Record<string, string> = {
  'beginner': 'bg-emerald-500/20 text-emerald-400',
  'intermediate': 'bg-amber-500/20 text-amber-400',
  'advanced': 'bg-red-500/20 text-red-400',
};

export default function SkillModules() {
  const { 
    modules, 
    isLoading, 
    startModule, 
    updateProgress,
    getModuleProgress, 
    isModuleCompleted,
    analyzeSkillGap,
    analyzing,
    stats 
  } = useSkillModules();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showSkillGap, setShowSkillGap] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapAnalysis | null>(null);

  const categories = ['all', ...new Set(modules.map(m => m.category))];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.skills_covered?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleStartModule = async (module: Module) => {
    await startModule.mutateAsync(module.id);
    setSelectedModule(module);
  };

  const handleCompleteModule = async () => {
    if (selectedModule) {
      await updateProgress.mutateAsync({ moduleId: selectedModule.id, progress: 100 });
      setSelectedModule(null);
    }
  };

  const handleAnalyzeSkillGap = async () => {
    if (!targetRole.trim()) return;
    const analysis = await analyzeSkillGap(targetRole);
    if (analysis) {
      setSkillGapAnalysis(analysis);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Skills Modules</h1>
            <p className="text-muted-foreground mt-1">
              Microlearning modules to boost your career readiness
            </p>
          </div>
          <NeonButton onClick={() => setShowSkillGap(true)}>
            <Brain className="w-4 h-4 mr-2" />
            AI Skill Gap Analysis
          </NeonButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalModules}</p>
                <p className="text-xs text-muted-foreground">Total Modules</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedModules}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgressModules}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-magenta/20">
                <Award className="w-5 h-5 text-accent-magenta" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSkillsLearned}</p>
                <p className="text-xs text-muted-foreground">Skills Learned</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Search and Filter */}
        <GlassCard className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search modules or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-background/50">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="capitalize">
                    {cat === 'all' ? 'All' : cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </GlassCard>

        {/* Modules Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredModules.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No modules found matching your criteria</p>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => {
              const progress = getModuleProgress(module.id);
              const completed = isModuleCompleted(module.id);

              return (
                <GlassCard 
                  key={module.id} 
                  className="p-5 hover:border-primary/50 transition-all group cursor-pointer"
                  onClick={() => handleStartModule(module)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={categoryColors[module.category] || 'bg-muted'}>
                      {module.category}
                    </Badge>
                    {completed && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.duration_minutes} min
                    </span>
                    <Badge className={difficultyColors[module.difficulty] || ''} variant="outline">
                      {module.difficulty}
                    </Badge>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {module.skills_covered?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded-full bg-background/50 text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  {progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}

                  {progress === 0 && (
                    <div className="flex items-center justify-end text-primary text-sm font-medium">
                      Start Learning
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Module Learning Dialog */}
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedModule?.title}</DialogTitle>
              <DialogDescription>{selectedModule?.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Module Meta */}
              <div className="flex flex-wrap gap-3">
                <Badge className={categoryColors[selectedModule?.category] || ''}>
                  {selectedModule?.category}
                </Badge>
                <Badge className={difficultyColors[selectedModule?.difficulty] || ''} variant="outline">
                  {selectedModule?.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {selectedModule?.duration_minutes} minutes
                </span>
              </div>

              {/* Skills Covered */}
              <div>
                <h4 className="text-sm font-medium mb-2">Skills You'll Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModule?.skills_covered?.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
                      <Zap className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Lessons Preview */}
              {selectedModule?.content?.lessons && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Lessons</h4>
                  <div className="space-y-2">
                    {selectedModule.content.lessons.map((lesson: Lesson, idx: number) => (
                      <GlassCard key={idx} className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.content}</p>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              {selectedModule && getModuleProgress(selectedModule.id) > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Progress</span>
                    <span className="text-primary">{getModuleProgress(selectedModule.id)}%</span>
                  </div>
                  <Progress value={getModuleProgress(selectedModule.id)} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {isModuleCompleted(selectedModule?.id) ? (
                  <NeonButton className="flex-1" variant="secondary">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </NeonButton>
                ) : (
                  <NeonButton 
                    className="flex-1" 
                    onClick={handleCompleteModule}
                    disabled={updateProgress.isPending}
                  >
                    {updateProgress.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {getModuleProgress(selectedModule?.id) > 0 ? 'Mark as Complete' : 'Start Module'}
                  </NeonButton>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Skill Gap Analysis Dialog */}
        <Dialog open={showSkillGap} onOpenChange={setShowSkillGap}>
          <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Skill Gap Analysis
              </DialogTitle>
              <DialogDescription>
                Enter your target role to get personalized skill recommendations
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pr-4">
                {/* Role Input */}
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g., Software Developer, Marketing Manager, Data Analyst..."
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="flex-1 bg-background/50"
                  />
                  <NeonButton 
                    onClick={handleAnalyzeSkillGap} 
                    disabled={analyzing || !targetRole.trim()}
                  >
                    {analyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Analyze'
                    )}
                  </NeonButton>
                </div>

                {/* Analysis Results */}
                {skillGapAnalysis && (
                  <div className="space-y-6">
                    {/* Readiness Score */}
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Role Readiness</h3>
                          <p className="text-sm text-muted-foreground">{skillGapAnalysis.targetRole}</p>
                        </div>
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="6"
                              className="text-muted/30"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="6"
                              strokeDasharray={`${skillGapAnalysis.readinessScore * 2.2} 220`}
                              className="text-primary"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                            {skillGapAnalysis.readinessScore}%
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{skillGapAnalysis.summary}</p>
                    </GlassCard>

                    {/* Strengths */}
                    {skillGapAnalysis.strengths?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400" />
                          Your Strengths
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skillGapAnalysis.strengths.map((strength: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-emerald-500/10 text-emerald-400">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skill Gaps */}
                    {skillGapAnalysis?.skillGaps?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-accent-magenta" />
                          Skills to Develop
                        </h4>
                        <div className="space-y-3">
                          {skillGapAnalysis.skillGaps.map((gap, idx) => (
                            <GlassCard key={idx} className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium">{gap.skill}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {gap.currentLevel} → {gap.requiredLevel}
                                  </p>
                                </div>
                                <Badge className={
                                  gap.importance === 'critical' ? 'bg-red-500/20 text-red-400' :
                                  gap.importance === 'high' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-muted text-muted-foreground'
                                }>
                                  {gap.importance}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Modules */}
                    {skillGapAnalysis?.recommendedModules?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          Recommended Modules
                        </h4>
                        <div className="space-y-2">
                          {skillGapAnalysis.recommendedModules.map((rec, idx) => (
                            <GlassCard key={idx} className="p-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{rec.title}</p>
                                <p className="text-xs text-muted-foreground">{rec.reason}</p>
                              </div>
                              <Badge variant="outline" className={
                                rec.priority === 'high' ? 'border-red-500/50 text-red-400' :
                                rec.priority === 'medium' ? 'border-amber-500/50 text-amber-400' :
                                'border-muted-foreground/50'
                              }>
                                {rec.priority}
                              </Badge>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Career Tips */}
                    {skillGapAnalysis.careerTips?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-accent-violet" />
                          Career Tips
                        </h4>
                        <div className="space-y-2">
                          {skillGapAnalysis.careerTips.map((tip: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
