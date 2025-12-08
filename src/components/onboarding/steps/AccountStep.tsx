import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap, Building2, School } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface AccountStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  role: "student" | "employer" | "university";
}

const roleLabels = {
  student: { label: "Student", icon: GraduationCap, color: "text-primary" },
  employer: { label: "Employer", icon: Building2, color: "text-secondary" },
  university: { label: "University", icon: School, color: "text-accent" },
};

export function AccountStep({ data, updateData, role }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const roleInfo = roleLabels[role];

  return (
    <div className="space-y-6">
      {/* Role Badge */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
        <roleInfo.icon className={`h-5 w-5 ${roleInfo.color}`} />
        <span className={`font-ui text-sm font-medium ${roleInfo.color}`}>
          Creating {roleInfo.label} Account
        </span>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="font-ui text-sm">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="Thabo"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            className="bg-muted/50 border-border/50 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="font-ui text-sm">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Mokoena"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            className="bg-muted/50 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-ui text-sm">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="thabo@university.ac.za"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          className="bg-muted/50 border-border/50 focus:border-primary"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="font-ui text-sm">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={data.password}
            onChange={(e) => updateData({ password: e.target.value })}
            minLength={8}
            className="bg-muted/50 border-border/50 focus:border-primary pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">At least 8 characters</p>
      </div>
    </div>
  );
}
