import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { 
  Users, 
  Plus, 
  UserPlus, 
  LogOut, 
  Briefcase, 
  Code, 
  Palette, 
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import type { Squad } from "@/hooks/useCommunity";

interface SquadMatchingProps {
  squads: Squad[];
  mySquads: Squad[];
  onCreateSquad: (name: string, description: string, category: string) => Promise<any>;
  onJoinSquad: (squadId: string) => Promise<void>;
  onLeaveSquad: (squadId: string) => Promise<void>;
}

const categoryIcons: Record<string, React.ElementType> = {
  general: Users,
  tech: Code,
  business: Briefcase,
  creative: Palette,
  career: TrendingUp,
};

const categories = [
  { value: "general", label: "General" },
  { value: "tech", label: "Tech & Engineering" },
  { value: "business", label: "Business & Finance" },
  { value: "creative", label: "Creative & Design" },
  { value: "career", label: "Career Growth" },
];

export function SquadMatching({ 
  squads, 
  mySquads, 
  onCreateSquad, 
  onJoinSquad, 
  onLeaveSquad 
}: SquadMatchingProps) {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSquad, setNewSquad] = useState({ name: "", description: "", category: "general" });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newSquad.name.trim()) return;
    setCreating(true);
    await onCreateSquad(newSquad.name, newSquad.description, newSquad.category);
    setCreating(false);
    setIsCreateOpen(false);
    setNewSquad({ name: "", description: "", category: "general" });
  };

  const mySquadIds = mySquads.map((s) => s.id);
  const availableSquads = squads.filter((s) => !mySquadIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Squad Matching</h3>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <NeonButton size="sm" variant="ghost">
              <Plus className="h-4 w-4 mr-1" />
              Create Squad
            </NeonButton>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading">Create New Squad</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Squad Name</label>
                <Input
                  value={newSquad.name}
                  onChange={(e) => setNewSquad({ ...newSquad, name: e.target.value })}
                  placeholder="e.g., Tech Titans"
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Category</label>
                <Select 
                  value={newSquad.category} 
                  onValueChange={(value) => setNewSquad({ ...newSquad, category: value })}
                >
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Description</label>
                <Textarea
                  value={newSquad.description}
                  onChange={(e) => setNewSquad({ ...newSquad, description: e.target.value })}
                  placeholder="What's your squad about?"
                  className="bg-muted/50 border-border resize-none"
                  rows={3}
                />
              </div>
              <NeonButton onClick={handleCreate} disabled={creating || !newSquad.name.trim()} className="w-full">
                {creating ? "Creating..." : "Create Squad"}
              </NeonButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Squads */}
      {mySquads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-ui text-muted-foreground">My Squads</h4>
          <div className="grid gap-3">
            {mySquads.map((squad) => {
              const CategoryIcon = categoryIcons[squad.category] || Users;
              return (
                <GlassCard key={squad.id} className="p-4" glow="none">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                      <CategoryIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-heading font-semibold text-foreground">{squad.name}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-1">{squad.description || "No description"}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {squad.member_count}/{squad.max_members} members
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent/20 text-accent capitalize">
                          {squad.category}
                        </span>
                      </div>
                    </div>
                    <NeonButton 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onLeaveSquad(squad.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                    </NeonButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Squads */}
      <div className="space-y-3">
        <h4 className="text-sm font-ui text-muted-foreground">
          {availableSquads.length > 0 ? "Join a Squad" : "No squads available"}
        </h4>
        {availableSquads.length === 0 ? (
          <GlassCard className="p-6 text-center" glow="none">
            <Sparkles className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Be the first to create a squad!</p>
          </GlassCard>
        ) : (
          <div className="grid gap-3">
            {availableSquads.slice(0, 5).map((squad) => {
              const CategoryIcon = categoryIcons[squad.category] || Users;
              const isFull = (squad.member_count || 0) >= squad.max_members;
              
              return (
                <GlassCard key={squad.id} className="p-4" glow="none">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-heading font-semibold text-foreground">{squad.name}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-1">{squad.description || "No description"}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs ${isFull ? "text-destructive" : "text-muted-foreground"}`}>
                          {squad.member_count}/{squad.max_members} members
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary capitalize">
                          {squad.category}
                        </span>
                      </div>
                    </div>
                    <NeonButton 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onJoinSquad(squad.id)}
                      disabled={isFull}
                    >
                      <UserPlus className="h-4 w-4" />
                    </NeonButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
