import { useDataSaver } from "@/contexts/DataSaverContext";
import { Zap, ZapOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface DataSaverToggleProps {
  variant?: "compact" | "full";
  className?: string;
}

export function DataSaverToggle({ variant = "compact", className }: DataSaverToggleProps) {
  const { dataSaverEnabled, toggleDataSaver } = useDataSaver();

  if (variant === "compact") {
    return (
      <button
        onClick={toggleDataSaver}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-ui transition-all duration-300",
          dataSaverEnabled 
            ? "bg-warning/20 text-warning border border-warning/30" 
            : "bg-muted/50 text-muted-foreground border border-border/50 hover:border-primary/30",
          className
        )}
        title={dataSaverEnabled ? "Data Saver On" : "Enable Data Saver"}
      >
        {dataSaverEnabled ? (
          <>
            <Zap className="h-3.5 w-3.5" />
            <span>Data Saver</span>
          </>
        ) : (
          <>
            <ZapOff className="h-3.5 w-3.5" />
            <span>Data Saver</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 border border-border/50",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
          dataSaverEnabled ? "bg-warning/20" : "bg-muted"
        )}>
          {dataSaverEnabled ? (
            <Zap className="h-5 w-5 text-warning" />
          ) : (
            <ZapOff className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-ui text-sm font-medium text-foreground">Data Saver Mode</p>
          <p className="text-xs text-muted-foreground">
            {dataSaverEnabled 
              ? "Animations & effects reduced" 
              : "Reduce data usage on mobile"}
          </p>
        </div>
      </div>
      <Switch
        checked={dataSaverEnabled}
        onCheckedChange={toggleDataSaver}
        className="data-[state=checked]:bg-warning"
      />
    </div>
  );
}
