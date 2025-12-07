import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { 
  GraduationCap, 
  Briefcase, 
  Clock, 
  MessageSquare,
  Send,
  Sparkles,
  Building2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Mentor } from "@/hooks/useCommunity";

interface MentorConnectionProps {
  mentors: Mentor[];
  onRequestMentor: (mentorId: string, message?: string) => Promise<void>;
}

export function MentorConnection({ mentors, onRequestMentor }: MentorConnectionProps) {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState("");
  const [requesting, setRequesting] = useState(false);

  const handleRequest = async () => {
    if (!selectedMentor) return;
    setRequesting(true);
    await onRequestMentor(selectedMentor.id, message || undefined);
    setRequesting(false);
    setSelectedMentor(null);
    setMessage("");
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "text-success bg-success/20 border-success/30";
      case "limited": return "text-warning bg-warning/20 border-warning/30";
      case "busy": return "text-destructive bg-destructive/20 border-destructive/30";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  // Mock mentors if none exist
  const displayMentors: Mentor[] = mentors.length > 0 ? mentors : [
    {
      id: "mock-1",
      user_id: "mock-user-1",
      title: "Senior Software Engineer",
      company: "Standard Bank",
      industry: "Finance",
      years_experience: 8,
      bio: "Passionate about mentoring the next generation of tech talent in South Africa.",
      availability: "limited",
      max_mentees: 3,
      is_active: true,
      mentor_name: "Thabo Mokoena",
    },
    {
      id: "mock-2",
      user_id: "mock-user-2",
      title: "Marketing Director",
      company: "Vodacom",
      industry: "Telecommunications",
      years_experience: 12,
      bio: "Helping young professionals navigate the corporate landscape.",
      availability: "available",
      max_mentees: 5,
      is_active: true,
      mentor_name: "Nomvula Dlamini",
    },
    {
      id: "mock-3",
      user_id: "mock-user-3",
      title: "Data Scientist",
      company: "Discovery",
      industry: "Insurance",
      years_experience: 5,
      bio: "Love sharing knowledge about AI, ML, and data-driven decision making.",
      availability: "limited",
      max_mentees: 2,
      is_active: true,
      mentor_name: "Sipho Nkosi",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold text-foreground">Find a Mentor</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Connect with industry professionals who can guide your career journey.
      </p>

      <div className="grid gap-4">
        {displayMentors.map((mentor) => (
          <GlassCard key={mentor.id} className="p-5 space-y-4" glow="none">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="h-14 w-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="font-heading text-xl font-bold text-primary">
                  {mentor.mentor_name?.split(" ").map(n => n[0]).join("") || "M"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{mentor.mentor_name}</h4>
                    <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-ui border capitalize ${getAvailabilityColor(mentor.availability)}`}>
                    {mentor.availability}
                  </span>
                </div>

                {/* Company & Industry */}
                <div className="flex items-center gap-4 mt-2">
                  {mentor.company && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{mentor.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{mentor.industry}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{mentor.years_experience}+ years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {mentor.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
            )}

            {/* Action */}
            <Dialog open={selectedMentor?.id === mentor.id} onOpenChange={(open) => !open && setSelectedMentor(null)}>
              <DialogTrigger asChild>
                <NeonButton 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedMentor(mentor)}
                  disabled={mentor.availability === "busy"}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Connection
                </NeonButton>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-heading">Connect with {mentor.mentor_name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="font-heading font-semibold text-primary">
                        {mentor.mentor_name?.split(" ").map(n => n[0]).join("") || "M"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{mentor.mentor_name}</p>
                      <p className="text-xs text-muted-foreground">{mentor.title} at {mentor.company}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-ui text-muted-foreground mb-1.5 block">
                      Introduce yourself (optional)
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi! I'm interested in learning more about..."
                      className="bg-muted/50 border-border resize-none"
                      rows={4}
                    />
                  </div>

                  <NeonButton onClick={handleRequest} disabled={requesting} className="w-full">
                    {requesting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </>
                    )}
                  </NeonButton>
                </div>
              </DialogContent>
            </Dialog>
          </GlassCard>
        ))}
      </div>

      {/* Become a mentor CTA */}
      <GlassCard className="p-4 bg-primary/5 border-primary/20" glow="none">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Are you an industry professional?</p>
            <p className="text-xs text-muted-foreground">Register as a mentor to help shape SA's future talent.</p>
          </div>
          <NeonButton size="sm" variant="ghost">
            Apply
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  );
}
