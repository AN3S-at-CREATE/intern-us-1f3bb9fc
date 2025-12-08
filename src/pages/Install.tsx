import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Download, Smartphone, Check, Share, PlusSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Install() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      // Installation successful
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <GlassCard className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Install Intern US
            </h1>
            <p className="text-muted-foreground">
              Add Intern US to your home screen for quick access and an app-like experience
            </p>
          </div>

          {isInstalled ? (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">App Installed!</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Intern US is already installed on your device
              </p>
            </div>
          ) : isIOS ? (
            <div className="space-y-4 text-left">
              <p className="text-sm text-muted-foreground text-center">
                Follow these steps to install on iOS:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Share className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">1. Tap the Share button</p>
                    <p className="text-sm text-muted-foreground">
                      Located at the bottom of Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <PlusSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">2. Add to Home Screen</p>
                    <p className="text-sm text-muted-foreground">
                      Scroll down and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">3. Confirm</p>
                    <p className="text-sm text-muted-foreground">
                      Tap "Add" to install the app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : isInstallable ? (
            <Button 
              onClick={handleInstall} 
              size="lg" 
              className="w-full gap-2"
            >
              <Download className="w-5 h-5" />
              Install App
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Installation is not available on this browser. Try opening this page in Chrome or Edge on mobile.
              </p>
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> On Android, use Chrome. On desktop, use Chrome or Edge for the best experience.
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="font-medium text-foreground">Benefits of installing:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Works offline with cached content
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Faster loading times
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Full-screen experience
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Quick access from home screen
              </li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
