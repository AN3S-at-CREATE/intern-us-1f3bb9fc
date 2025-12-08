import { useState, useEffect } from 'react';
import { EmployerDashboardLayout } from '@/components/employer/EmployerDashboardLayout';
import { useEmployer } from '@/hooks/useEmployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Save,
  Loader2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Award,
  Check
} from 'lucide-react';

const industries = [
  'Technology', 'Finance', 'Retail', 'Mining', 'Healthcare',
  'Media', 'Manufacturing', 'Agriculture', 'Logistics', 'Education'
];

const companySizes = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
];

const bbbeeeLevels = [
  'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 
  'Level 6', 'Level 7', 'Level 8', 'Non-Compliant'
];

export default function CompanyProfile() {
  const { employerProfile, isLoading, updateEmployerProfile } = useEmployer();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    website: '',
    description: '',
    location: '',
    bbbee_level: '',
    eti_eligible: false,
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    if (employerProfile) {
      setFormData({
        company_name: employerProfile.company_name || '',
        industry: employerProfile.industry || '',
        company_size: employerProfile.company_size || '',
        website: employerProfile.website || '',
        description: employerProfile.description || '',
        location: employerProfile.location || '',
        bbbee_level: employerProfile.bbbee_level || '',
        eti_eligible: employerProfile.eti_eligible || false,
        contact_email: employerProfile.contact_email || '',
        contact_phone: employerProfile.contact_phone || '',
      });
    }
  }, [employerProfile]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateEmployerProfile(formData);
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <EmployerDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EmployerDashboardLayout>
    );
  }

  return (
    <EmployerDashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/5 border border-primary/30">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-foreground">Company Profile</h1>
              <p className="text-muted-foreground">Manage your company information</p>
            </div>
          </div>
          {employerProfile?.is_verified && (
            <Badge className="bg-success/20 text-success border-success/30">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Form */}
        <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="Your company name"
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(ind => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={formData.company_size} onValueChange={(v) => updateField('company_size', v)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Number of employees" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map(size => (
                      <SelectItem key={size} value={size}>{size} employees</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g., Johannesburg, Gauteng"
                  className="bg-background/50 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://www.yourcompany.co.za"
                className="bg-background/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Company Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Tell candidates about your company culture, values, and what makes you unique..."
                className="bg-background/50 border-border/50"
                rows={4}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 pt-4 border-t border-border/30">
            <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Email
                </Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  placeholder="hr@company.co.za"
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Phone
                </Label>
                <Input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  placeholder="+27 11 123 4567"
                  className="bg-background/50 border-border/50"
                />
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="space-y-4 pt-4 border-t border-border/30">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Compliance & Incentives
            </h3>
            
            <div className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
              This information helps match you with relevant incentive programmes and is for informational purposes only.
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>B-BBEE Level</Label>
                <Select value={formData.bbbee_level} onValueChange={(v) => updateField('bbbee_level', v)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {bbbeeeLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/50">
                <div>
                  <h4 className="font-medium text-foreground text-sm">ETI Eligible</h4>
                  <p className="text-xs text-muted-foreground">Employment Tax Incentive</p>
                </div>
                <Switch
                  checked={formData.eti_eligible}
                  onCheckedChange={(v) => updateField('eti_eligible', v)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isSaving ? (
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
        </div>
      </div>
    </EmployerDashboardLayout>
  );
}