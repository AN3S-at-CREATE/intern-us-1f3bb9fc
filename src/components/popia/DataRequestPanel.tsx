import { useState } from 'react';
import { FileText, Download, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePOPIA, type DataAccessRequest } from '@/hooks/usePOPIA';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const REQUEST_TYPES = {
  access: {
    label: 'Access My Data',
    description: 'Request a copy of all personal data we hold about you',
    icon: Download,
    color: 'text-blue-400',
  },
  correction: {
    label: 'Correct My Data',
    description: 'Request corrections to inaccurate personal information',
    icon: FileText,
    color: 'text-yellow-400',
  },
  deletion: {
    label: 'Delete My Data',
    description: 'Request permanent deletion of your personal data',
    icon: Trash2,
    color: 'text-red-400',
  },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400 bg-yellow-400/10' },
  processing: { label: 'Processing', icon: AlertCircle, color: 'text-blue-400 bg-blue-400/10' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-400 bg-green-400/10' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400 bg-red-400/10' },
};

export function DataRequestPanel() {
  const { dataRequests, submitDataRequest, isSubmittingRequest } = usePOPIA();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (selectedType) {
      submitDataRequest({ requestType: selectedType, reason });
      setDialogOpen(false);
      setSelectedType(null);
      setReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Access Requests</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Under POPIA, you have the right to request access to, correction of, or deletion of your personal data. 
          We will process your request within 30 days.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(REQUEST_TYPES).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Dialog key={key} open={dialogOpen && selectedType === key} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setSelectedType(null);
              }}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 border-border/50 hover:border-primary/50"
                    onClick={() => setSelectedType(key)}
                  >
                    <Icon className={cn("h-8 w-8", config.color)} />
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground text-center">
                      {config.description}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Icon className={cn("h-5 w-5", config.color)} />
                      {config.label}
                    </DialogTitle>
                    <DialogDescription>
                      {config.description}. This request will be processed within 30 days as required by POPIA.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label className="text-sm font-medium text-foreground">
                      Additional Details (Optional)
                    </label>
                    <Textarea
                      placeholder="Provide any additional information about your request..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmittingRequest}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSubmittingRequest ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </GlassCard>

      {/* Request History */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Request History</h3>
        
        {dataRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No data requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dataRequests.map((request: DataAccessRequest) => {
              const typeConfig = REQUEST_TYPES[request.request_type as keyof typeof REQUEST_TYPES];
              const statusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
              const TypeIcon = typeConfig?.icon || FileText;
              const StatusIcon = statusConfig?.icon || Clock;

              return (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      "bg-muted"
                    )}>
                      <TypeIcon className={cn("h-5 w-5", typeConfig?.color || 'text-muted-foreground')} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {typeConfig?.label || request.request_type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("flex items-center gap-1", statusConfig?.color)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig?.label || request.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
