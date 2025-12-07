import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logoDark from "@/assets/intern-us-logo-dark.svg";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoDark} alt="Intern US" className="h-10 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              South Africa's premier youth-to-industry platform. Connecting students with opportunities that launch careers.
            </p>
          </div>

          {/* For Students */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/cv-builder" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  CV Builder
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Skills Modules
                </Link>
              </li>
              <li>
                <Link to="/career-advisor" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Career Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">For Employers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/post-opportunity" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Post Opportunity
                </Link>
              </li>
              <li>
                <Link to="/talent-search" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary" />
                hello@internus.co.za
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary" />
                +27 10 123 4567
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Johannesburg, South Africa
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Intern US. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/popia" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              POPIA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}