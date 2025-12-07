import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink,
  FileText,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApplicationWithOpportunity, ApplicationStatus, StatusHistoryEntry } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

interface ApplicationDetailDialogProps {
  application: ApplicationWithOpportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateNotes: (applicationId: string, notes: string) => void;
  onUpdateInterviewDate: (applicationId: string, date: string | null) => void;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus, note?: string) => void;
  statusOrder: ApplicationStatus[];
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  saved: { label: 'Saved', color: 'text-muted-foreground' },
  applied: { label: 'Applied', color: 'text-primary' },
  reviewed: { label: 'Under Review', color: 'text-accent' },
  interview: { label: 'Interview', color: 'text-secondary' },
  offer: { label: 'Offer Received', color: 'text-green-400' },
  hired: { label: 'Hired', color: 'text-green-300' },
  rejected: { label: 'Rejected', color: 'text-destructive' },
};

export function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
  onUpdateNotes,
  onUpdateInterviewDate,
  onUpdateStatus,
  statusOrder
}: ApplicationDetailDialogProps) {
  const [notes, setNotes] = useState(application?.notes || '');
  const [interviewDate, setInterviewDate] = useState(
    application?.interview_date 
      ? format(new Date(application.interview_date), "yyyy-MM-dd'T'HH:mm")
      : ''
  );
  const [statusNote, setStatusNote] = useState('');

  if (!application) return null;

  const opportunity = application.opportunity;
  const currentStatusIndex = statusOrder.indexOf(application.status);

  const handleSaveNotes = () => {
    onUpdateNotes(application.id, notes);
  };

  const handleSaveInterviewDate = () => {
    onUpdateInterviewDate(application.id, interviewDate || null);
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onUpdateStatus(application.id, newStatus, statusNote || undefined);
    setStatusNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {opportunity?.company_logo_url ? (
              <img 
                src={opportunity.company_logo_url} 
                alt={opportunity.company_name}
                className="w-14 h-14 rounded-xl object-cover bg-muted"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className="text-xl mb-1">
                {opportunity?.title || 'Unknown Position'}
              </DialogTitle>
              <p className="text-muted-foreground">
                {opportunity?.company_name || 'Unknown Company'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {opportunity?.location}
                </span>
                <Badge variant="outline">{opportunity?.location_type}</Badge>
                <Badge variant="secondary">{opportunity?.opportunity_type}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Match Score */}
        {application.match_score && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium">Match Score</span>
            </div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${application.match_score}%` }}
              />
            </div>
            <span className="text-xl font-bold text-primary">{application.match_score}%</span>
          </div>
        )}

        {/* Status Pipeline */}
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Application Progress</h4>
          <div className="flex items-center justify-between">
            {statusOrder.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = status === application.status;
              const config = statusConfig[status];
              
              return (
                <div key={status} className="flex items-center">
                  <button
                    onClick={() => handleStatusChange(status)}
                    className={cn(
                      "flex flex-col items-center gap-1 transition-all",
                      isCompleted ? "opacity-100" : "opacity-40 hover:opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      isCurrent 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background" 
                        : isCompleted 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium",
                      isCurrent ? config.color : "text-muted-foreground"
                    )}>
                      {config.label}
                    </span>
                  </button>
                  {index < statusOrder.length - 1 && (
                    <ArrowRight className={cn(
                      "h-4 w-4 mx-1",
                      index < currentStatusIndex ? "text-primary" : "text-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Tabs defaultValue="details" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Interview Scheduling */}
            <div className="space-y-2">
              <Label>Interview Date & Time</Label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveInterviewDate} variant="secondary">
                  Save
                </Button>
              </div>
            </div>

            {/* Application Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">Applied</p>
                <p className="font-medium">
                  {format(new Date(application.applied_at), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(application.updated_at), { addSuffix: true })}
                </p>
              </div>
              {opportunity?.stipend_min && (
                <div>
                  <p className="text-xs text-muted-foreground">Stipend Range</p>
                  <p className="font-medium">
                    R{opportunity.stipend_min.toLocaleString()} - R{opportunity.stipend_max?.toLocaleString()}
                  </p>
                </div>
              )}
              {opportunity?.application_deadline && (
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="font-medium">
                    {format(new Date(opportunity.application_deadline), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>

            {/* Match Reasons */}
            {application.match_reasons && application.match_reasons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Why You Match</h4>
                <div className="flex flex-wrap gap-2">
                  {application.match_reasons.map((reason, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {application.status_history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No status history yet</p>
                  </div>
                ) : (
                  [...application.status_history].reverse().map((entry, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        {index < application.status_history.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={statusConfig[entry.status].color}>
                            {statusConfig[entry.status].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Personal Notes</Label>
              <Textarea
                placeholder="Add notes about this application, interview prep, follow-ups..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[150px]"
              />
              <Button onClick={handleSaveNotes} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>

            {/* Status Update Note */}
            <div className="space-y-2 p-4 rounded-xl bg-muted/30">
              <Label>Add note for next status update</Label>
              <Textarea
                placeholder="Optional note when changing status..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                This note will be attached to the timeline when you change the application status.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
