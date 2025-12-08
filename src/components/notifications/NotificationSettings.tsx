import { useState, useEffect } from 'react';
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNotifications, type NotificationPreferences } from '@/hooks/useNotifications';

export function NotificationSettings() {
  const { preferences, updatePreferences, isUpdatingPreferences } = useNotifications();
  
  const [localPrefs, setLocalPrefs] = useState<Partial<NotificationPreferences>>({
    email_enabled: true,
    in_app_enabled: true,
    whatsapp_enabled: false,
    whatsapp_number: '',
    application_updates: true,
    interview_reminders: true,
    opportunity_matches: true,
    community_activity: false,
    marketing_updates: false,
  });

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences(localPrefs);
  };

  const updatePref = (key: keyof NotificationPreferences, value: boolean | string) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Channels */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Channels
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-foreground">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications within the platform</p>
              </div>
            </div>
            <Switch
              checked={localPrefs.in_app_enabled}
              onCheckedChange={(checked) => updatePref('in_app_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Label className="text-foreground">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={localPrefs.email_enabled}
              onCheckedChange={(checked) => updatePref('email_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <Label className="text-foreground">WhatsApp Notifications</Label>
                <p className="text-sm text-muted-foreground">Get instant updates on WhatsApp</p>
              </div>
            </div>
            <Switch
              checked={localPrefs.whatsapp_enabled}
              onCheckedChange={(checked) => updatePref('whatsapp_enabled', checked)}
            />
          </div>

          {localPrefs.whatsapp_enabled && (
            <div className="ml-13 pl-4 border-l-2 border-green-500/30">
              <Label className="text-sm text-muted-foreground">WhatsApp Number</Label>
              <div className="flex gap-2 mt-1">
                <span className="flex items-center px-3 bg-muted rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                  +27
                </span>
                <Input
                  placeholder="81 234 5678"
                  value={localPrefs.whatsapp_number || ''}
                  onChange={(e) => updatePref('whatsapp_number', e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Notification Types */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Notification Types
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Application Updates</Label>
              <p className="text-sm text-muted-foreground">Status changes on your applications</p>
            </div>
            <Switch
              checked={localPrefs.application_updates}
              onCheckedChange={(checked) => updatePref('application_updates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Interview Reminders</Label>
              <p className="text-sm text-muted-foreground">Upcoming interview notifications</p>
            </div>
            <Switch
              checked={localPrefs.interview_reminders}
              onCheckedChange={(checked) => updatePref('interview_reminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Opportunity Matches</Label>
              <p className="text-sm text-muted-foreground">New opportunities matching your profile</p>
            </div>
            <Switch
              checked={localPrefs.opportunity_matches}
              onCheckedChange={(checked) => updatePref('opportunity_matches', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Community Activity</Label>
              <p className="text-sm text-muted-foreground">Squad updates and endorsements</p>
            </div>
            <Switch
              checked={localPrefs.community_activity}
              onCheckedChange={(checked) => updatePref('community_activity', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">Platform news and promotional content</p>
            </div>
            <Switch
              checked={localPrefs.marketing_updates}
              onCheckedChange={(checked) => updatePref('marketing_updates', checked)}
            />
          </div>
        </div>
      </GlassCard>

      {/* WhatsApp Preview */}
      {localPrefs.whatsapp_enabled && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-400" />
            WhatsApp Preview
          </h3>
          <div className="bg-[#0b141a] rounded-xl p-4 max-w-sm mx-auto">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                IU
              </div>
              <div>
                <p className="text-white font-medium">Intern US</p>
                <p className="text-xs text-green-400">online</p>
              </div>
            </div>
            <div className="py-4 space-y-2">
              <div className="bg-[#005c4b] rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <p className="text-white text-sm">
                  🎉 Congrats! Your application to <strong>Software Intern</strong> at TechCorp has been shortlisted!
                </p>
                <p className="text-xs text-white/60 mt-1 text-right">10:32 AM ✓✓</p>
              </div>
              <div className="bg-[#005c4b] rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <p className="text-white text-sm">
                  📅 Reminder: Interview tomorrow at 2:00 PM with DataFlow Solutions
                </p>
                <p className="text-xs text-white/60 mt-1 text-right">Yesterday ✓✓</p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isUpdatingPreferences}
          className="bg-primary hover:bg-primary/90"
        >
          {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
