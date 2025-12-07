import { useState } from 'react';
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle2,
  Star
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApplicationWithOpportunity, ApplicationStatus } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: ApplicationWithOpportunity;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onViewDetails: (application: ApplicationWithOpportunity) => void;
  onWithdraw: (applicationId: string) => void;
  isDragging?: boolean;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  saved: { label: 'Saved', color: 'bg-muted text-muted-foreground', icon: <Star className="h-3 w-3" /> },
  applied: { label: 'Applied', color: 'bg-primary/20 text-primary', icon: <CheckCircle2 className="h-3 w-3" /> },
  reviewed: { label: 'Reviewed', color: 'bg-accent/20 text-accent', icon: <Eye className="h-3 w-3" /> },
  interview: { label: 'Interview', color: 'bg-secondary/20 text-secondary', icon: <Calendar className="h-3 w-3" /> },
  offer: { label: 'Offer', color: 'bg-green-500/20 text-green-400', icon: <CheckCircle2 className="h-3 w-3" /> },
  hired: { label: 'Hired', color: 'bg-green-600/20 text-green-300', icon: <CheckCircle2 className="h-3 w-3" /> },
  rejected: { label: 'Rejected', color: 'bg-destructive/20 text-destructive', icon: <AlertCircle className="h-3 w-3" /> },
};

export function ApplicationCard({ 
  application, 
  onStatusChange, 
  onViewDetails, 
  onWithdraw,
  isDragging 
}: ApplicationCardProps) {
  const opportunity = application.opportunity;
  const status = statusConfig[application.status];
  
  const hasUpcomingInterview = application.interview_date && 
    isAfter(new Date(application.interview_date), new Date()) &&
    isBefore(new Date(application.interview_date), addDays(new Date(), 7));

  const isInterviewToday = application.interview_date &&
    format(new Date(application.interview_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <GlassCard 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
        isDragging && "rotate-2 scale-105 shadow-xl shadow-primary/20",
        isInterviewToday && "ring-2 ring-secondary animate-pulse"
      )}
      onClick={() => onViewDetails(application)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {opportunity?.company_logo_url ? (
            <img 
              src={opportunity.company_logo_url} 
              alt={opportunity.company_name}
              className="w-10 h-10 rounded-lg object-cover bg-muted"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm text-foreground truncate">
              {opportunity?.title || 'Unknown Position'}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {opportunity?.company_name || 'Unknown Company'}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails(application); }}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails(application); }}>
              <Edit className="h-4 w-4 mr-2" />
              Add Notes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={(e) => { e.stopPropagation(); onWithdraw(application.id); }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Withdraw
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Match Score */}
      {application.match_score && (
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
              style={{ width: `${application.match_score}%` }}
            />
          </div>
          <span className="text-xs font-medium text-primary">{application.match_score}%</span>
        </div>
      )}

      {/* Location & Type */}
      {opportunity && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {opportunity.location_type}
          </Badge>
        </div>
      )}

      {/* Interview Alert */}
      {hasUpcomingInterview && application.interview_date && (
        <div className={cn(
          "flex items-center gap-2 p-2 rounded-lg text-xs mb-3",
          isInterviewToday 
            ? "bg-secondary/20 text-secondary border border-secondary/30" 
            : "bg-primary/10 text-primary"
        )}>
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {isInterviewToday 
              ? `Interview today at ${format(new Date(application.interview_date), 'h:mm a')}`
              : `Interview ${formatDistanceToNow(new Date(application.interview_date), { addSuffix: true })}`
            }
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
        </span>
        
        {application.notes && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Has notes
          </span>
        )}
      </div>
    </GlassCard>
  );
}
