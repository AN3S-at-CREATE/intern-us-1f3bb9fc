import { useState, useEffect } from 'react';
import { 
  Save, Loader2, Sparkles, FileText, Target, BarChart3, 
  Briefcase, GraduationCap, Lightbulb, ChevronRight, Download,
  Plus, Trash2, Wand2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAICVEnhance, EnhanceType } from '@/hooks/useAICVEnhance';

interface WorkExperience {
  id: string;
  job_title: string;
  company_name: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface Education {
  id: string;
  institution_name: string;
  qualification: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  grade: string | null;
  description: string | null;
}

interface ATSResult {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
}

export default function CVBuilder() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { enhance, loading: aiLoading } = useAICVEnhance();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeEnhance, setActiveEnhance] = useState<string | null>(null);
  
  // Profile data
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [targetRole, setTargetRole] = useState('');
  
  // Experience & Education
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  
  // ATS Analysis
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [biasWarnings, setBiasWarnings] = useState<string[]>([]);

  // Human review gate
  const [humanReviewed, setHumanReviewed] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch student profile
      const { data: spData } = await supabase
        .from('student_profiles')
        .select('headline, bio')
        .eq('user_id', user.id)
        .single();

      if (spData) {
        setHeadline(spData.headline || '');
        setBio(spData.bio || '');
      }

      // Fetch work experience
      const { data: expData } = await supabase
        .from('work_experience')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (expData) {
        setExperiences(expData);
      }

      // Fetch education
      const { data: eduData } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (eduData) {
        setEducation(eduData);
      }
    } catch (error) {
      console.error('Error fetching CV data:', error);
    } finally {
      setLoading(false);
      setHumanReviewed(false);
    }
  };

  const markNeedsReview = () => setHumanReviewed(false);

  const handleEnhance = async (type: EnhanceType, content: string, id?: string) => {
    setActiveEnhance(id || type);
    markNeedsReview();
    const result = await enhance(type, content, { targetRole });
    setActiveEnhance(null);
    
    if (result && typeof result === 'string') {
      if (type === 'headline') {
        setHeadline(result);
      } else if (type === 'bio') {
        setBio(result);
      } else if (type === 'experience' && id) {
        setExperiences(prev => prev.map(exp => 
          exp.id === id ? { ...exp, description: result } : exp
        ));
      }
    }
  };

  const handleATSAnalysis = async () => {
    setAtsLoading(true);
    setBiasWarnings([]);

    // Compile full CV content
    const cvContent = `
Headline: ${headline}

Professional Summary:
${bio}

Work Experience:
${experiences.map(exp => `
${exp.job_title} at ${exp.company_name}
${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date}
${exp.description || 'No description'}
`).join('\n')}

Education:
${education.map(edu => `
${edu.qualification} - ${edu.institution_name}
${edu.field_of_study || ''}
`).join('\n')}
    `.trim();

    const institutions = education
      .map(edu => edu.institution_name)
      .filter((name): name is string => Boolean(name));

    const [result, tierOneResult, tierThreeResult] = await Promise.all([
      enhance('ats_score', cvContent, { targetRole }, { institutionsToRedact: institutions }),
      enhance(
        'ats_score',
        cvContent,
        { targetRole, biasTier: 'tier_one' },
        { institutionsToRedact: institutions, replacementLabel: 'Tier 1 Institution' }
      ),
      enhance(
        'ats_score',
        cvContent,
        { targetRole, biasTier: 'tier_three' },
        { institutionsToRedact: institutions, replacementLabel: 'Tier 3 Institution' }
      ),
    ]);
    setAtsLoading(false);

    if (result && typeof result !== 'string') {
      setAtsResult(result as ATSResult);
    }

    if (
      result &&
      tierOneResult &&
      tierThreeResult &&
      typeof result !== 'string' &&
      typeof tierOneResult !== 'string' &&
      typeof tierThreeResult !== 'string'
    ) {
      const warnings: string[] = [];
      const highTierScore = (tierOneResult as ATSResult).score;
      const lowTierScore = (tierThreeResult as ATSResult).score;
      const delta = Math.abs(highTierScore - lowTierScore);

      if (delta >= 5) {
        warnings.push(
          `Detected a ${delta}% swing between Tier 1 and Tier 3 institution placeholders. Review for bias before relying on ATS results.`
        );
      }

      setBiasWarnings(warnings);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!humanReviewed) {
      toast({
        title: "Review required",
        description: "Please confirm you have reviewed AI suggestions before saving.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);

    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ headline, bio })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "CV saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addExperience = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('work_experience')
        .insert({
          user_id: user.id,
          job_title: 'New Position',
          company_name: 'Company Name',
          start_date: new Date().toISOString().split('T')[0],
          is_current: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setExperiences(prev => [data, ...prev]);
        markNeedsReview();
      }
    } catch (error: any) {
      toast({
        title: "Error adding experience",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateExperience = async (id: string, updates: Partial<WorkExperience>) => {
    markNeedsReview();
    try {
      const { error } = await supabase
        .from('work_experience')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setExperiences(prev => prev.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      ));
    } catch (error: any) {
      toast({
        title: "Error updating",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      markNeedsReview();
    } catch (error: any) {
      toast({
        title: "Error deleting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              AI CV Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Build an ATS-optimized CV with AI-powered enhancements
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center justify-end">
            <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
              <Checkbox
                id="humanReviewed"
                checked={humanReviewed}
                onCheckedChange={(checked) => setHumanReviewed(Boolean(checked))}
              />
              <Label htmlFor="humanReviewed" className="text-xs text-muted-foreground">
                Human review completed
              </Label>
            </div>
            <Button onClick={handleATSAnalysis} disabled={atsLoading} variant="outline" className="btn-ghost-neon">
              {atsLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              ATS Score
            </Button>
            <Button
              onClick={saveProfile}
              disabled={saving || !humanReviewed}
              className="btn-neon"
              title={!humanReviewed ? 'Tick the review box after checking AI suggestions' : undefined}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save CV
            </Button>
          </div>
        </div>

        {/* Target Role Input */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4">
            <Target className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <Label htmlFor="targetRole" className="text-sm text-muted-foreground">Target Role (for AI optimization)</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Software Developer, Marketing Intern, Data Analyst"
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value);
                  markNeedsReview();
                }}
                className="bg-input border-border mt-1"
              />
            </div>
          </div>
        </div>

        {/* ATS Score Card */}
        {atsResult && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                ATS Compatibility Score
              </h3>
              <span className={`font-heading text-3xl font-bold ${
                atsResult.score >= 80 ? 'text-success' :
                atsResult.score >= 60 ? 'text-warning' : 'text-destructive'
              }`}>
                {atsResult.score}%
              </span>
            </div>
            <Progress value={atsResult.score} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-success flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {atsResult.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-1 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-warning flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Improvements
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {atsResult.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-1 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {atsResult.keywords.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-foreground mb-2">Recommended Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {atsResult.keywords.map((kw, i) => (
                    <Badge key={i} variant="outline" className="border-primary/50 text-primary">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {biasWarnings.length > 0 && (
              <div className="rounded-md border border-warning/40 bg-warning/10 p-3 flex gap-3 mt-2">
                <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-warning">Fairness check</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {biasWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="summary" className="data-[state=active]:bg-primary/10">
              <Lightbulb className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-primary/10">
              <Briefcase className="h-4 w-4 mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary/10">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Headline */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Professional Headline</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEnhance('headline', headline)}
                  disabled={aiLoading && activeEnhance === 'headline'}
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  {aiLoading && activeEnhance === 'headline' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Enhance with AI
                </Button>
              </div>
              <Input
                placeholder="e.g., Final-year Computer Science Student | Passionate Full-Stack Developer"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  markNeedsReview();
                }}
                className="bg-input border-border text-lg"
              />
              <p className="text-xs text-muted-foreground">
                This appears at the top of your CV. Make it memorable and keyword-rich.
              </p>
            </div>

            {/* Bio/Summary */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Professional Summary</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEnhance('bio', bio)}
                  disabled={aiLoading && activeEnhance === 'bio'}
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  {aiLoading && activeEnhance === 'bio' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Enhance with AI
                </Button>
              </div>
              <Textarea
                placeholder="Write a compelling summary of your background, skills, and career goals..."
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  markNeedsReview();
                }}
                className="bg-input border-border min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                3-5 sentences highlighting your value proposition, key achievements, and goals.
              </p>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-semibold text-foreground">Work Experience</h3>
              <Button onClick={addExperience} size="sm" className="btn-neon">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {experiences.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">No experience added yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add internships, part-time jobs, or volunteer work to strengthen your CV.
                </p>
                <Button onClick={addExperience} className="btn-neon">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="glass-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.job_title}
                          onChange={(e) => updateExperience(exp.id, { job_title: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company_name}
                          onChange={(e) => updateExperience(exp.id, { company_name: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.start_date}
                          onChange={(e) => updateExperience(exp.id, { start_date: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.end_date || ''}
                          onChange={(e) => updateExperience(exp.id, { end_date: e.target.value || null })}
                          disabled={exp.is_current}
                          className="bg-input border-border"
                        />
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteExperience(exp.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEnhance('experience', exp.description || '', exp.id)}
                        disabled={aiLoading && activeEnhance === exp.id}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        {aiLoading && activeEnhance === exp.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        Enhance with AI
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements. Use bullet points for clarity."
                      value={exp.description || ''}
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                      className="bg-input border-border min-h-[120px]"
                    />
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-semibold text-foreground">Education</h3>
            </div>

            {education.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">No education added yet</h4>
                <p className="text-sm text-muted-foreground">
                  Add your education in the Profile Builder to see it here.
                </p>
              </div>
            ) : (
              education.map((edu) => (
                <div key={edu.id} className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{edu.qualification}</h4>
                      <p className="text-muted-foreground">{edu.institution_name}</p>
                      {edu.field_of_study && (
                        <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {edu.start_date && <span>{edu.start_date}</span>}
                        {edu.start_date && (edu.end_date || edu.is_current) && <span>-</span>}
                        {edu.is_current ? (
                          <Badge variant="outline" className="border-primary/50 text-primary">Current</Badge>
                        ) : (
                          edu.end_date && <span>{edu.end_date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* AI Tips Card */}
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">AI CV Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use the "Enhance with AI" buttons to improve your content</li>
                <li>• Set a target role for more relevant optimizations</li>
                <li>• Run the ATS Score check before applying to jobs</li>
                <li>• Quantify achievements with numbers where possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
