import { useMemo } from 'react';
import { 
  Star, 
  Send, 
  Eye, 
  Calendar, 
  Gift, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationWithOpportunity, ApplicationStatus } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: ApplicationWithOpportunity[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onViewDetails: (application: ApplicationWithOpportunity) => void;
  onWithdraw: (applicationId: string) => void;
  onDragStart: (e: React.DragEvent, applicationId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: ApplicationStatus) => void;
  isDragOver: boolean;
}

const columnConfig: Record<ApplicationStatus, { 
  label: string; 
  icon: React.ReactNode; 
  gradient: string;
  borderColor: string;
}> = {
  saved: { 
    label: 'Saved', 
    icon: <Star className="h-4 w-4" />, 
    gradient: 'from-muted/50 to-muted/30',
    borderColor: 'border-muted-foreground/20'
  },
  applied: { 
    label: 'Applied', 
    icon: <Send className="h-4 w-4" />, 
    gradient: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/30'
  },
  reviewed: { 
    label: 'Under Review', 
    icon: <Eye className="h-4 w-4" />, 
    gradient: 'from-accent/20 to-accent/5',
    borderColor: 'border-accent/30'
  },
  interview: { 
    label: 'Interview', 
    icon: <Calendar className="h-4 w-4" />, 
    gradient: 'from-secondary/20 to-secondary/5',
    borderColor: 'border-secondary/30'
  },
  offer: { 
    label: 'Offer', 
    icon: <Gift className="h-4 w-4" />, 
    gradient: 'from-green-500/20 to-green-500/5',
    borderColor: 'border-green-500/30'
  },
  hired: { 
    label: 'Hired', 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    gradient: 'from-green-600/20 to-green-600/5',
    borderColor: 'border-green-600/30'
  },
  rejected: { 
    label: 'Rejected', 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    gradient: 'from-destructive/20 to-destructive/5',
    borderColor: 'border-destructive/30'
  },
};

export function KanbanColumn({
  status,
  applications,
  onStatusChange,
  onViewDetails,
  onWithdraw,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver
}: KanbanColumnProps) {
  const config = columnConfig[status];
  const count = applications.length;

  return (
    <div 
      className={cn(
        "flex flex-col min-w-[280px] max-w-[320px] rounded-2xl transition-all duration-200",
        "bg-gradient-to-b",
        config.gradient,
        "border",
        config.borderColor,
        isDragOver && "ring-2 ring-primary scale-[1.02]"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-primary">{config.icon}</span>
          <h3 className="font-semibold text-sm">{config.label}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No applications</p>
              <p className="text-xs mt-1">Drag cards here</p>
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                draggable
                onDragStart={(e) => onDragStart(e, application.id)}
                className="cursor-grab active:cursor-grabbing"
              >
                <ApplicationCard
                  application={application}
                  onStatusChange={onStatusChange}
                  onViewDetails={onViewDetails}
                  onWithdraw={onWithdraw}
                />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
