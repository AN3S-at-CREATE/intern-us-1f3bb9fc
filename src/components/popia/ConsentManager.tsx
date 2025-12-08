import { Shield, Check, X, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { usePOPIA, CONSENT_TYPES } from '@/hooks/usePOPIA';
import { cn } from '@/lib/utils';

export function ConsentManager() {
  const { getConsentStatus, updateConsent, isUpdatingConsent } = usePOPIA();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Privacy Consents</h3>
          <p className="text-sm text-muted-foreground">
            Manage how we collect and use your data
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(CONSENT_TYPES).map(([key, config]) => {
          const isGranted = getConsentStatus(key);
          return (
            <div 
              key={key}
              className={cn(
                "flex items-start justify-between p-4 rounded-lg border transition-colors",
                isGranted 
                  ? "bg-primary/5 border-primary/30" 
                  : "bg-muted/30 border-border/50"
              )}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{config.label}</span>
                  {config.required && (
                    <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-500">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {config.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isGranted ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <Switch
                  checked={isGranted}
                  disabled={config.required || isUpdatingConsent}
                  onCheckedChange={(checked) => 
                    updateConsent({ consentType: key, isGranted: checked })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-300 font-medium">Your Rights Under POPIA</p>
            <p className="text-sm text-blue-300/80 mt-1">
              You have the right to access, correct, or delete your personal information at any time. 
              Required consents are necessary for the platform to function and cannot be revoked while 
              maintaining an active account.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
