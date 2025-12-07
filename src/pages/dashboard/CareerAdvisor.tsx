import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gauge, Clock, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCareerAdvisor } from '@/hooks/useCareerAdvisor';
import { CareerAdvisorForm } from '@/components/career/CareerAdvisorForm';
import { CareerTreeVisualization } from '@/components/career/CareerTreeVisualization';
import { SkillsUpskillPanel } from '@/components/career/SkillsUpskillPanel';
import { IndustryInsightsPanel } from '@/components/career/IndustryInsightsPanel';
import { AlternativePathsPanel } from '@/components/career/AlternativePathsPanel';

const CareerAdvisor = () => {
  const { isLoading, advice, getCareerAdvice, clearAdvice } = useCareerAdvisor();
  const [activeTab, setActiveTab] = useState('pathway');

  const handleSubmit = async (data: {
    currentRole?: string;
    targetRole: string;
    skills?: string[];
    experience?: string;
    education?: string;
    fieldOfStudy?: string;
  }) => {
    await getCareerAdvice(data);
  };

  const handleExploreAlternative = (role: string) => {
    clearAdvice();
    // The form will be shown, user can modify and submit with new target
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              AI Career Path Advisor
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover your personalized career journey
            </p>
          </div>
          {advice && (
            <NeonButton 
              variant="outline" 
              size="sm"
              onClick={clearAdvice}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Analysis
            </NeonButton>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!advice ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CareerAdvisorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {advice.careerPath.currentPosition} → {advice.careerPath.targetPosition}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your personalized career pathway
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-2xl font-bold text-foreground">
                          {advice.careerPath.estimatedTimeYears}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Years Est.</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Gauge className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold text-primary">
                          {advice.careerPath.confidenceScore}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Tabs Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-background/50">
                  <TabsTrigger value="pathway">Career Path</TabsTrigger>
                  <TabsTrigger value="skills">Upskilling</TabsTrigger>
                  <TabsTrigger value="insights">Industry</TabsTrigger>
                  <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                </TabsList>

                <TabsContent value="pathway" className="mt-6">
                  <GlassCard className="p-6">
                    <CareerTreeVisualization
                      steps={advice.pathwaySteps}
                      currentPosition={advice.careerPath.currentPosition}
                      targetPosition={advice.careerPath.targetPosition}
                    />
                  </GlassCard>
                </TabsContent>

                <TabsContent value="skills" className="mt-6">
                  <SkillsUpskillPanel skills={advice.skillsToAcquire} />
                </TabsContent>

                <TabsContent value="insights" className="mt-6">
                  <IndustryInsightsPanel insights={advice.industryInsights} />
                </TabsContent>

                <TabsContent value="alternatives" className="mt-6">
                  <AlternativePathsPanel 
                    paths={advice.alternativePaths}
                    onSelectPath={handleExploreAlternative}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default CareerAdvisor;
