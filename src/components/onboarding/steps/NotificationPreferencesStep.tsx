import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, MessageCircle, Briefcase, FileText, Calendar, Users, Megaphone } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface NotificationPreferencesStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

const channels = [
  {
    key: "email_enabled" as const,
    icon: Mail,
    label: "Email",
    description: "Receive notifications via email",
  },
  {
    key: "in_app_enabled" as const,
    icon: Bell,
    label: "In-App",
    description: "See notifications in your dashboard",
  },
  {
    key: "whatsapp_enabled" as const,
    icon: MessageCircle,
    label: "WhatsApp",
    description: "Get instant alerts on WhatsApp",
  },
];

const notificationTypes = [
  {
    key: "opportunity_matches" as const,
    icon: Briefcase,
    label: "Opportunity Matches",
    description: "New opportunities that match your profile",
  },
  {
    key: "application_updates" as const,
    icon: FileText,
    label: "Application Updates",
    description: "Status changes on your applications",
  },
  {
    key: "interview_reminders" as const,
    icon: Calendar,
    label: "Interview Reminders",
    description: "Upcoming interview notifications",
  },
  {
    key: "community_activity" as const,
    icon: Users,
    label: "Community Activity",
    description: "Updates from squads and mentors",
  },
  {
    key: "marketing_updates" as const,
    icon: Megaphone,
    label: "Marketing & News",
    description: "Platform updates and tips",
  },
];

export function NotificationPreferencesStep({ data, updateData }: NotificationPreferencesStepProps) {
  const handleNotificationChange = (key: keyof typeof data.notifications, value: boolean | string) => {
    updateData({
      notifications: {
        ...data.notifications,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
        <Smartphone className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-ui font-semibold text-sm">Stay in the Loop</h3>
          <p className="text-muted-foreground text-xs mt-1">
            Choose how you'd like to receive updates. You can adjust these anytime in Settings.
          </p>
        </div>
      </div>

      {/* Notification Channels */}
      <div>
        <h4 className="font-ui text-sm font-medium mb-3">Notification Channels</h4>
        <div className="space-y-3">
          {channels.map((channel) => (
            <div
              key={channel.key}
              className={`flex items-center justify-between gap-4 p-3 rounded-lg border transition-colors ${
                data.notifications[channel.key]
                  ? "bg-primary/5 border-primary/30"
                  : "bg-muted/30 border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <channel.icon
                  className={`h-5 w-5 ${
                    data.notifications[channel.key] ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <span className="font-ui text-sm font-medium">{channel.label}</span>
                  <p className="text-muted-foreground text-xs">{channel.description}</p>
                </div>
              </div>
              <Switch
                checked={data.notifications[channel.key] as boolean}
                onCheckedChange={(checked) => handleNotificationChange(channel.key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Number Input */}
      {data.notifications.whatsapp_enabled && (
        <div className="space-y-2 pl-8">
          <Label htmlFor="whatsapp" className="font-ui text-sm">
            WhatsApp Number
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">+27</span>
            <Input
              id="whatsapp"
              placeholder="82 123 4567"
              value={data.notifications.whatsapp_number}
              onChange={(e) => handleNotificationChange("whatsapp_number", e.target.value)}
              className="bg-muted/50 border-border/50 focus:border-primary"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            We'll send you a verification message after signup.
          </p>
        </div>
      )}

      {/* Notification Types */}
      <div>
        <h4 className="font-ui text-sm font-medium mb-3">What to Notify You About</h4>
        <div className="grid gap-3">
          {notificationTypes.map((type) => (
            <div
              key={type.key}
              className={`flex items-center justify-between gap-4 p-3 rounded-lg border transition-colors ${
                data.notifications[type.key]
                  ? "bg-accent/5 border-accent/30"
                  : "bg-muted/30 border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <type.icon
                  className={`h-4 w-4 ${
                    data.notifications[type.key] ? "text-accent" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <span className="font-ui text-sm">{type.label}</span>
                  <p className="text-muted-foreground text-xs">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={data.notifications[type.key] as boolean}
                onCheckedChange={(checked) => handleNotificationChange(type.key, checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
