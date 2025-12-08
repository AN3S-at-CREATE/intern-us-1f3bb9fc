import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Save, Upload } from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function UniversityProfile() {
  const {
    universityProfile,
    isLoading,
    createUniversityProfile,
    updateUniversityProfile,
  } = useUniversity();

  const [formData, setFormData] = useState({
    institution_name: "",
    institution_type: "university",
    faculty: "",
    department: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    website: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (universityProfile) {
      setFormData({
        institution_name: universityProfile.institution_name || "",
        institution_type: universityProfile.institution_type || "university",
        faculty: universityProfile.faculty || "",
        department: universityProfile.department || "",
        contact_email: universityProfile.contact_email || "",
        contact_phone: universityProfile.contact_phone || "",
        address: universityProfile.address || "",
        website: universityProfile.website || "",
      });
    }
  }, [universityProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (universityProfile) {
        await updateUniversityProfile(formData);
      } else {
        await createUniversityProfile(formData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <UniversityDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </UniversityDashboardLayout>
    );
  }

  return (
    <UniversityDashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-display font-bold flex items-center gap-3"
            >
              <Building2 className="h-8 w-8 text-primary" />
              Institution Profile
            </motion.h1>
            <p className="text-muted-foreground">
              Manage your institution's WIL office details
            </p>
          </div>
          {universityProfile?.is_verified && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Verified Institution
            </Badge>
          )}
        </div>

        {/* Profile Form */}
        <GlassCard className="p-6">
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center">
                {universityProfile?.logo_url ? (
                  <img
                    src={universityProfile.logo_url}
                    alt="Institution logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>

            {/* Institution Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="institution_name">Institution Name *</Label>
                <Input
                  id="institution_name"
                  placeholder="e.g., University of Cape Town"
                  value={formData.institution_name}
                  onChange={(e) =>
                    setFormData({ ...formData, institution_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Institution Type</Label>
                <Select
                  value={formData.institution_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, institution_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="university_of_technology">
                      University of Technology
                    </SelectItem>
                    <SelectItem value="tvet_college">TVET College</SelectItem>
                    <SelectItem value="private_college">Private College</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty / School</Label>
                <Input
                  id="faculty"
                  placeholder="e.g., Faculty of Engineering"
                  value={formData.faculty}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., Work-Integrated Learning Office"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.university.ac.za"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="border-t border-border/50 pt-6">
              <h3 className="font-medium mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="wil@university.ac.za"
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    placeholder="+27 21 650 1234"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Campus address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border/50">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Verification Notice */}
        {!universityProfile?.is_verified && (
          <GlassCard className="p-4 border-l-4 border-l-yellow-500">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Building2 className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-400">
                  Institution Verification Pending
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your profile to request verification. Verified institutions
                  get access to enhanced features and higher visibility.
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </UniversityDashboardLayout>
  );
}
