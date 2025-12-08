import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';

export default function NotificationSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage how and when you receive notifications
          </p>
        </div>

        <NotificationSettings />
      </div>
    </DashboardLayout>
  );
}
