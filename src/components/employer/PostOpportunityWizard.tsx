import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText,
  Settings,
  Award,
  Loader2,
  Wand2,
  Check,
  X
} from 'lucide-react';
import { AIAvatar } from '@/components/ui/AIAvatar';

interface PostOpportunityWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const steps = [
  { id: 1, title: 'Basic Info', icon: Briefcase },
  { id: 2, title: 'Requirements', icon: FileText },
  { id: 3, title: 'Details', icon: Settings },
  { id: 4, title: 'B-BBEE/ETI', icon: Award },
];

const industries = [
  'Technology', 'Finance', 'Retail', 'Mining', 'Healthcare',
  'Media', 'Manufacturing', 'Agriculture', 'Logistics', 'Education'
];

const opportunityTypes = [
  { value: 'internship', label: 'Internship' },
  { value: 'graduate', label: 'Graduate Programme' },
  { value: 'wil', label: 'WIL Placement' },
  { value: 'learnership', label: 'Learnership' },
];

const locationTypes = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const qualifications = [
  'Matric', 'Certificate', 'Diploma', 'Degree', 'Honours', 'Masters', 'PhD'
];

const fieldsOfStudy = [
  'Computer Science', 'Business Administration', 'Engineering', 'Finance',
  'Marketing', 'Human Resources', 'Law', 'Medicine', 'Education', 'Arts'
];

export function PostOpportunityWizard({ onComplete, onCancel }: PostOpportunityWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    location: '',
    opportunity_type: 'internship',
    industry: '',
    location_type: 'hybrid',
    
    // Step 2: Requirements
    requirements: '',
    responsibilities: '',
    min_qualification: '',
    field_of_study: [] as string[],
    
    // Step 3: Details
    stipend_min: '',
    stipend_max: '',
    duration_months: '',
    start_date: '',
    application_deadline: '',
    is_featured: false,
    
    // Step 4: B-BBEE/ETI
    is_wil_approved: false,
    eti_applicable: false,
    bbbee_priority: false,
  });

  const [aiNotes, setAiNotes] = useState('');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFieldOfStudy = (field: string) => {
    setFormData(prev => ({
      ...prev,
      field_of_study: prev.field_of_study.includes(field)
        ? prev.field_of_study.filter(f => f !== field)
        : [...prev.field_of_study, field]
    }));
  };

  const generateAIDescription = async () => {
    if (!aiNotes.trim()) {
      toast({ title: 'Please enter some notes first', variant: 'destructive' });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-job-description', {
        body: {
          roughNotes: aiNotes,
          jobTitle: formData.title,
          industry: formData.industry,
          locationType: formData.location_type,
        }
      });

      if (error) throw error;

      // Update form with generated content
      if (data.aboutRole) {
        updateField('description', data.aboutRole);
      }
      if (data.responsibilities) {
        updateField('responsibilities', data.responsibilities.join('\n• '));
      }
      if (data.requirements) {
        updateField('requirements', data.requirements.join('\n• '));
      }

      toast({ title: 'Job description generated!' });
    } catch (error) {
      console.error('AI generation error:', error);
      toast({ title: 'Failed to generate description', variant: 'destructive' });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    const opportunity = {
      ...formData,
      stipend_min: formData.stipend_min ? parseInt(formData.stipend_min) : null,
      stipend_max: formData.stipend_max ? parseInt(formData.stipend_max) : null,
      duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
      start_date: formData.start_date || null,
      application_deadline: formData.application_deadline || null,
    };
    onComplete(opportunity);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.location && formData.industry;
      case 2:
        return true; // Requirements are optional
      case 3:
        return true; // Details are optional
      case 4:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 ${
              currentStep === step.id 
                ? 'text-primary' 
                : currentStep > step.id 
                  ? 'text-success' 
                  : 'text-muted-foreground'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors ${
                currentStep === step.id 
                  ? 'bg-primary/10 border-primary' 
                  : currentStep > step.id 
                    ? 'bg-success/10 border-success' 
                    : 'bg-muted/50 border-border'
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="hidden sm:block font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                <div className="flex items-start gap-3">
                  <AIAvatar emotion="idea" size="sm" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">AI Job Description Generator</h4>
                    <Textarea
                      value={aiNotes}
                      onChange={(e) => setAiNotes(e.target.value)}
                      placeholder="Enter rough notes about the role... (e.g., 'Need a marketing intern, 3 months, social media skills, flexible hours, Johannesburg')"
                      className="bg-background/50 border-border/50 mb-3"
                      rows={3}
                    />
                    <Button
                      onClick={generateAIDescription}
                      disabled={isGeneratingAI || !aiNotes.trim()}
                      variant="outline"
                      className="border-accent/50 text-accent hover:bg-accent/10"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., Marketing Intern"
                    className="bg-card/50 border-border/50"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry *</Label>
                    <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                      <SelectTrigger className="bg-card/50 border-border/50">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Opportunity Type</Label>
                    <Select value={formData.opportunity_type} onValueChange={(v) => updateField('opportunity_type', v)}>
                      <SelectTrigger className="bg-card/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {opportunityTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="e.g., Johannesburg, Gauteng"
                      className="bg-card/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Work Mode</Label>
                    <Select value={formData.location_type} onValueChange={(v) => updateField('location_type', v)}>
                      <SelectTrigger className="bg-card/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe the role and what the candidate will be doing..."
                    className="bg-card/50 border-border/50"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Key Responsibilities</Label>
                <Textarea
                  value={formData.responsibilities}
                  onChange={(e) => updateField('responsibilities', e.target.value)}
                  placeholder="List the main responsibilities and duties..."
                  className="bg-card/50 border-border/50"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => updateField('requirements', e.target.value)}
                  placeholder="List the skills, qualifications, and experience required..."
                  className="bg-card/50 border-border/50"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Qualification</Label>
                <Select value={formData.min_qualification} onValueChange={(v) => updateField('min_qualification', v)}>
                  <SelectTrigger className="bg-card/50 border-border/50">
                    <SelectValue placeholder="Select minimum qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualifications.map(q => (
                      <SelectItem key={q} value={q}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Fields of Study</Label>
                <div className="flex flex-wrap gap-2">
                  {fieldsOfStudy.map(field => (
                    <Badge
                      key={field}
                      variant="outline"
                      className={`cursor-pointer transition-colors ${
                        formData.field_of_study.includes(field)
                          ? 'bg-primary/20 text-primary border-primary/50'
                          : 'border-border/50 hover:border-border'
                      }`}
                      onClick={() => toggleFieldOfStudy(field)}
                    >
                      {field}
                      {formData.field_of_study.includes(field) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Stipend (R/month)</Label>
                  <Input
                    type="number"
                    value={formData.stipend_min}
                    onChange={(e) => updateField('stipend_min', e.target.value)}
                    placeholder="e.g., 5000"
                    className="bg-card/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Stipend (R/month)</Label>
                  <Input
                    type="number"
                    value={formData.stipend_max}
                    onChange={(e) => updateField('stipend_max', e.target.value)}
                    placeholder="e.g., 8000"
                    className="bg-card/50 border-border/50"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (months)</Label>
                  <Input
                    type="number"
                    value={formData.duration_months}
                    onChange={(e) => updateField('duration_months', e.target.value)}
                    placeholder="e.g., 6"
                    className="bg-card/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    className="bg-card/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => updateField('application_deadline', e.target.value)}
                  className="bg-card/50 border-border/50"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div>
                  <h4 className="font-medium text-foreground">Feature this posting</h4>
                  <p className="text-sm text-muted-foreground">Featured postings appear at the top of search results</p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(v) => updateField('is_featured', v)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> The following settings are for informational purposes only and do not constitute legal advice. 
                  Please consult with a qualified professional for compliance matters.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                  <div>
                    <h4 className="font-medium text-foreground">WIL Approved Placement</h4>
                    <p className="text-sm text-muted-foreground">This opportunity meets university WIL requirements</p>
                  </div>
                  <Switch
                    checked={formData.is_wil_approved}
                    onCheckedChange={(v) => updateField('is_wil_approved', v)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                  <div>
                    <h4 className="font-medium text-foreground">ETI Applicable</h4>
                    <p className="text-sm text-muted-foreground">Employment Tax Incentive may apply to this hire</p>
                  </div>
                  <Switch
                    checked={formData.eti_applicable}
                    onCheckedChange={(v) => updateField('eti_applicable', v)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                  <div>
                    <h4 className="font-medium text-foreground">B-BBEE Priority</h4>
                    <p className="text-sm text-muted-foreground">Prioritize candidates for B-BBEE compliance</p>
                  </div>
                  <Switch
                    checked={formData.bbbee_priority}
                    onCheckedChange={(v) => updateField('bbbee_priority', v)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <h4 className="font-medium text-success mb-2">Ready to Post!</h4>
                <p className="text-sm text-muted-foreground">
                  Your opportunity will be visible to thousands of students across South Africa.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={currentStep === 1 ? onCancel : handleBack}
          className="text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Post Opportunity
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}