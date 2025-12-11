import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, X, Sparkles, User, GraduationCap, Briefcase, Award } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface StudentProfile {
  id: string;
  user_id: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  institution: string | null;
  qualification: string | null;
  field_of_study: string | null;
  year_of_study: number | null;
  expected_graduation: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  profile_completeness: number;
  is_available: boolean;
  blind_match_enabled: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

interface StudentSkill {
  id: string;
  skill_id: string;
  proficiency_level: number;
  skill?: Skill;
}

export default function ProfileBuilder() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    headline: '',
    bio: '',
    location: '',
    date_of_birth: '',
    gender: '',
    nationality: 'South African',
    institution: '',
    qualification: '',
    field_of_study: '',
    year_of_study: '',
    expected_graduation: '',
    linkedin_url: '',
    portfolio_url: '',
    is_available: true,
    blind_match_enabled: true,
  });

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch student profile
      const { data: spData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (spData) {
        setStudentProfile(spData as StudentProfile);
        setFormData({
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          phone: profile?.phone || '',
          headline: spData.headline || '',
          bio: spData.bio || '',
          location: spData.location || '',
          date_of_birth: spData.date_of_birth || '',
          gender: spData.gender || '',
          nationality: spData.nationality || 'South African',
          institution: spData.institution || '',
          qualification: spData.qualification || '',
          field_of_study: spData.field_of_study || '',
          year_of_study: spData.year_of_study?.toString() || '',
          expected_graduation: spData.expected_graduation || '',
          linkedin_url: spData.linkedin_url || '',
          portfolio_url: spData.portfolio_url || '',
          is_available: spData.is_available ?? true,
          blind_match_enabled: spData.blind_match_enabled ?? true,
        });
      }

      // Fetch all skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('name');
      
      if (skillsData) {
        setAllSkills(skillsData as Skill[]);
      }

      // Fetch student skills with skill details
      const { data: studentSkillsData } = await supabase
        .from('student_skills')
        .select('*, skill:skills(*)')
        .eq('user_id', user.id);
      
      if (studentSkillsData) {
        setStudentSkills(studentSkillsData.map(ss => ({
          ...ss,
          skill: ss.skill as Skill
        })));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [profile, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData, user]);

  const calculateCompleteness = () => {
    const fields = [
      formData.first_name,
      formData.last_name,
      formData.headline,
      formData.bio,
      formData.location,
      formData.institution,
      formData.qualification,
      formData.field_of_study,
      formData.year_of_study,
    ];
    const filled = fields.filter(f => f && f.toString().trim() !== '').length;
    const skillBonus = studentSkills.length > 0 ? 10 : 0;
    return Math.min(100, Math.round((filled / fields.length) * 90) + skillBonus);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update student_profiles table
      const { error: studentError } = await supabase
        .from('student_profiles')
        .update({
          headline: formData.headline,
          bio: formData.bio,
          location: formData.location,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender,
          nationality: formData.nationality,
          institution: formData.institution,
          qualification: formData.qualification,
          field_of_study: formData.field_of_study,
          year_of_study: formData.year_of_study ? parseInt(formData.year_of_study) : null,
          expected_graduation: formData.expected_graduation || null,
          linkedin_url: formData.linkedin_url,
          portfolio_url: formData.portfolio_url,
          is_available: formData.is_available,
          blind_match_enabled: formData.blind_match_enabled,
          profile_completeness: calculateCompleteness(),
        })
        .eq('user_id', user.id);

      if (studentError) throw studentError;

      await refreshProfile();
      
      toast({
        title: "Profile saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "Unable to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkill || !user) return;
    
    try {
      const { error } = await supabase
        .from('student_skills')
        .insert({
          user_id: user.id,
          skill_id: selectedSkill,
          proficiency_level: 3,
        });

      if (error) throw error;

      setSelectedSkill('');
      fetchData();
      
      toast({
        title: "Skill added!",
        description: "Your skill has been added to your profile.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error adding skill",
        description: error instanceof Error ? error.message : "Unable to add skill",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('student_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId);

      if (error) throw error;

      setStudentSkills(prev => prev.filter(s => s.skill_id !== skillId));
      
      toast({
        title: "Skill removed",
        description: "The skill has been removed from your profile.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error removing skill",
        description: error instanceof Error ? error.message : "Unable to remove skill",
        variant: "destructive",
      });
    }
  };

  const availableSkills = allSkills.filter(
    skill => !studentSkills.some(ss => ss.skill_id === skill.id)
  );

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
              Profile Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete your profile to get matched with opportunities
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="btn-neon">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Profile Completeness */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-ui font-semibold text-foreground">Profile Completeness</h3>
            <span className="font-heading text-xl font-bold text-primary">{calculateCompleteness()}%</span>
          </div>
          <Progress value={calculateCompleteness()} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            Complete profiles get 3x more views from employers
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="personal" className="data-[state=active]:bg-primary/10">
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary/10">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-primary/10">
              <Award className="h-4 w-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary/10">
              <Sparkles className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h3 className="font-heading font-semibold text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  placeholder="e.g., Final-year Computer Science student | Aspiring Software Developer"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell employers about yourself, your goals, and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-input border-border min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Johannesburg, Gauteng"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url">Portfolio / Website</Label>
                  <Input
                    id="portfolio_url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h3 className="font-heading font-semibold text-foreground">Current Education</h3>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Institution Name *</Label>
                <Input
                  id="institution"
                  placeholder="e.g., University of Cape Town"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input
                    id="qualification"
                    placeholder="e.g., Bachelor of Science"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study *</Label>
                  <Input
                    id="field_of_study"
                    placeholder="e.g., Computer Science"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year_of_study">Year of Study</Label>
                  <Select value={formData.year_of_study} onValueChange={(v) => setFormData({ ...formData, year_of_study: v })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year (Honours)</SelectItem>
                      <SelectItem value="5">Postgraduate</SelectItem>
                      <SelectItem value="0">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_graduation">Expected Graduation</Label>
                  <Input
                    id="expected_graduation"
                    type="date"
                    value={formData.expected_graduation}
                    onChange={(e) => setFormData({ ...formData, expected_graduation: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Your Skills</h3>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {studentSkills.length} skills
                </Badge>
              </div>

              {/* Add Skill */}
              <div className="flex gap-3">
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="bg-input border-border flex-1">
                    <SelectValue placeholder="Select a skill to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} {skill.category && `(${skill.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddSkill} disabled={!selectedSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {studentSkills.map((ss) => (
                  <Badge 
                    key={ss.id} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 text-sm flex items-center gap-2"
                  >
                    {ss.skill?.name}
                    <button 
                      onClick={() => handleRemoveSkill(ss.skill_id)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {studentSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No skills added yet. Add skills to improve your match score!
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h3 className="font-heading font-semibold text-foreground">Job Preferences</h3>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                <div>
                  <p className="font-ui font-semibold text-foreground">Available for opportunities</p>
                  <p className="text-sm text-muted-foreground">Let employers know you're looking</p>
                </div>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-ui font-semibold text-foreground">Blind Match Mode</p>
                    <Badge variant="outline" className="border-secondary/30 text-secondary text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hide your surname, photo, and institution from employers until mutual interest
                  </p>
                </div>
                <Switch
                  checked={formData.blind_match_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, blind_match_enabled: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
