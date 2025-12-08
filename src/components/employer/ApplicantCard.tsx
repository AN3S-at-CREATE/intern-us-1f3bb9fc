import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Star, 
  MapPin, 
  GraduationCap,
  Mail,
  Calendar,
  MessageSquare,
  Check,
  X,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicantCardProps {
  application: {
    id: string;
    status: string;
    match_score: number | null;
    match_reasons: string[] | null;
    applied_at: string;
    cover_letter: string | null;
    notes: string | null;
    opportunity?: {
      title: string;
    };
    profile?: {
      first_name: string | null;
      last_name: string | null;
      email: string;
      avatar_url: string | null;
    };
    student_profile?: {
      institution: string | null;
      field_of_study: string | null;
      headline: string | null;
      location: string | null;
    };
  };
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
  blindMatchMode?: boolean;
}

export function ApplicantCard({ application, onUpdateStatus, blindMatchMode = false }: ApplicantCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(application.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const { profile, student_profile } = application;

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : 'A';
  
  const displayName = blindMatchMode 
    ? `Candidate ${application.id.slice(0, 4)}`
    : profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : 'Anonymous';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'reviewed': return 'bg-info/20 text-info border-info/30';
      case 'shortlisted': return 'bg-primary/20 text-primary border-primary/30';
      case 'interview': return 'bg-accent/20 text-accent border-accent/30';
      case 'offered': return 'bg-success/20 text-success border-success/30';
      case 'hired': return 'bg-success/20 text-success border-success/30';
      case 'rejected': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success/20 border-success/30';
    if (score >= 60) return 'text-warning bg-warning/20 border-warning/30';
    return 'text-muted-foreground bg-muted/50';
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    await onUpdateStatus(application.id, newStatus, notes);
    setIsUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl bg-card/80 backdrop-blur-sm border transition-all ${
        application.match_score && application.match_score >= 80
          ? 'border-success/30 shadow-lg shadow-success/5'
          : 'border-border/50 hover:border-border'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Avatar & Score */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              {blindMatchMode ? (
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <EyeOff className="h-6 w-6" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </>
              )}
            </Avatar>
            {application.match_score && application.match_score >= 80 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                <Star className="h-3 w-3 text-success-foreground" />
              </div>
            )}
          </div>

          {application.match_score && (
            <div className={`px-3 py-1.5 rounded-xl border ${getScoreColor(application.match_score)}`}>
              <span className="text-lg font-bold">{application.match_score}%</span>
              <span className="text-xs ml-1">match</span>
            </div>
          )}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="text-lg font-semibold text-foreground">{displayName}</h4>
              <p className="text-sm text-muted-foreground">
                {student_profile?.headline || student_profile?.field_of_study || 'Student'}
              </p>
            </div>
            <Badge className={`${getStatusColor(application.status)}`}>
              {application.status}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {!blindMatchMode && student_profile?.institution && (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {student_profile.institution}
              </span>
            )}
            {student_profile?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {student_profile.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Applied {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
            </span>
          </div>

          {/* Match Reasons */}
          {application.match_reasons && application.match_reasons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {application.match_reasons.slice(0, 3).map((reason, i) => (
                <Badge key={i} variant="outline" className="text-xs border-border/50">
                  {reason}
                </Badge>
              ))}
            </div>
          )}

          {/* Expanded Content */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border/30 space-y-4"
            >
              {application.cover_letter && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Cover Letter
                  </h5>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {application.cover_letter}
                  </p>
                </div>
              )}

              <div>
                <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Internal Notes
                </h5>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  className="bg-muted/30 border-border/50"
                  rows={3}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex gap-2">
            {application.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('shortlisted')}
                  disabled={isUpdating}
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {application.status === 'shortlisted' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate('interview')}
                disabled={isUpdating}
                className="bg-accent/10 text-accent hover:bg-accent/20"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Interview
              </Button>
            )}
            {application.status === 'interview' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('offered')}
                  disabled={isUpdating}
                  className="bg-success/10 text-success hover:bg-success/20"
                >
                  Make Offer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {application.status === 'offered' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate('hired')}
                disabled={isUpdating}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Hired
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {!blindMatchMode && profile?.email && (
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="text-muted-foreground"
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  More
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}