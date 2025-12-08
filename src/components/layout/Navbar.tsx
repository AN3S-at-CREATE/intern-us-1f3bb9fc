import { Link, useLocation, useNavigate } from "react-router-dom";
import { NeonButton } from "@/components/ui/NeonButton";
import { Menu, X } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import logoDark from "@/assets/intern-us-logo-dark.svg";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsOpen(false);
  }, [location.pathname, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoDark} alt="Intern US" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              onClick={(e) => handleAnchorClick(e, "#features")}
              className="neon-link text-muted-foreground hover:text-foreground transition-colors font-ui cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleAnchorClick(e, "#how-it-works")}
              className="neon-link text-muted-foreground hover:text-foreground transition-colors font-ui cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#partners" 
              onClick={(e) => handleAnchorClick(e, "#partners")}
              className="neon-link text-muted-foreground hover:text-foreground transition-colors font-ui cursor-pointer"
            >
              Partners
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <NeonButton variant="ghost" size="sm" asChild>
              <Link to="/signin">
                Sign In
              </Link>
            </NeonButton>
            <NeonButton size="sm" asChild>
              <Link to="/get-started">
                Get Started
              </Link>
            </NeonButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, "#features")}
              className="text-muted-foreground hover:text-foreground transition-colors font-ui py-2 cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, "#how-it-works")}
              className="text-muted-foreground hover:text-foreground transition-colors font-ui py-2 cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#partners"
              onClick={(e) => handleAnchorClick(e, "#partners")}
              className="text-muted-foreground hover:text-foreground transition-colors font-ui py-2 cursor-pointer"
            >
              Partners
            </a>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <NeonButton variant="ghost" className="w-full" asChild>
                <Link to="/signin" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </NeonButton>
              <NeonButton className="w-full" asChild>
                <Link to="/get-started" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </NeonButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}