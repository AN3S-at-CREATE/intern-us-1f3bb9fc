import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, GraduationCap, Target, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CareerAdvisorFormProps {
  onSubmit: (data: {
    currentRole?: string;
    targetRole: string;
    skills?: string[];
    experience?: string;
    education?: string;
    fieldOfStudy?: string;
  }) => void;
  isLoading: boolean;
}

const popularRoles = [
  'Software Developer',
  'Data Analyst',
  'Marketing Manager',
  'Financial Analyst',
  'UX/UI Designer',
  'Project Manager',
  'Human Resources Manager',
  'Business Analyst',
  'Accountant',
  'Digital Marketing Specialist',
  'Product Manager',
  'Civil Engineer',
  'Mechanical Engineer',
  'Nurse',
  'Teacher'
];

const qualifications = [
  'Matric',
  'Certificate',
  'Diploma',
  'Bachelor\'s Degree',
  'Honours Degree',
  'Master\'s Degree',
  'Doctorate'
];

export const CareerAdvisorForm = ({ onSubmit, isLoading }: CareerAdvisorFormProps) => {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      currentRole: currentRole || undefined,
      targetRole,
      skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      experience: experience || undefined,
      education: education || undefined,
      fieldOfStudy: fieldOfStudy || undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Career Path Advisor</h2>
            <p className="text-sm text-muted-foreground">
              Get personalized career guidance powered by AI
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target Role - Required */}
          <div className="space-y-2">
            <Label htmlFor="targetRole" className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Target Role <span className="text-red-400">*</span>
            </Label>
            <Select value={targetRole} onValueChange={setTargetRole}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Select your dream role" />
              </SelectTrigger>
              <SelectContent>
                {popularRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Or type a custom role below if not in the list
            </p>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Machine Learning Engineer"
              className="bg-background/50 border-border/50"
            />
          </div>

          {/* Current Role */}
          <div className="space-y-2">
            <Label htmlFor="currentRole" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              Current Role (Optional)
            </Label>
            <Input
              id="currentRole"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g., Student, Junior Developer"
              className="bg-background/50 border-border/50"
            />
          </div>

          {/* Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-secondary" />
                Highest Qualification
              </Label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  {qualifications.map(qual => (
                    <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g., Computer Science"
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Current Skills (comma-separated)</Label>
            <Textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., Python, Excel, Communication, Project Management"
              className="bg-background/50 border-border/50 min-h-[80px]"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label>Work Experience Summary</Label>
            <Textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Briefly describe your work experience..."
              className="bg-background/50 border-border/50 min-h-[80px]"
            />
          </div>

          <NeonButton
            type="submit"
            disabled={!targetRole.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Career Path...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Career Advice
              </>
            )}
          </NeonButton>
        </form>
      </GlassCard>
    </motion.div>
  );
};
