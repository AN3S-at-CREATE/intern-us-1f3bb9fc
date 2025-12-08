import { Shield, FileText, Lock, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { ConsentManager } from '@/components/popia/ConsentManager';
import { DataRequestPanel } from '@/components/popia/DataRequestPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function POPIATrustCenter() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">POPIA Trust Center</h1>
            <p className="text-muted-foreground mt-1">
              Your privacy matters. Manage your data rights under the Protection of Personal Information Act.
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Lock className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Encrypted Storage</p>
              <p className="text-sm text-muted-foreground">Your data is securely encrypted</p>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Transparent Usage</p>
              <p className="text-sm text-muted-foreground">See how your data is used</p>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">POPIA Compliant</p>
              <p className="text-sm text-muted-foreground">Full regulatory compliance</p>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="consents" className="w-full">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="consents" className="data-[state=active]:bg-primary/20">
              Privacy Consents
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-primary/20">
              Data Requests
            </TabsTrigger>
            <TabsTrigger value="policy" className="data-[state=active]:bg-primary/20">
              Privacy Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consents" className="mt-6">
            <ConsentManager />
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <DataRequestPanel />
          </TabsContent>

          <TabsContent value="policy" className="mt-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Policy Summary</h3>
              
              <div className="prose prose-invert max-w-none">
                <div className="space-y-6 text-muted-foreground">
                  <section>
                    <h4 className="text-foreground font-medium mb-2">1. Information We Collect</h4>
                    <p className="text-sm">
                      We collect personal information that you voluntarily provide, including your name, 
                      email address, educational background, work experience, and skills. This information 
                      is essential for matching you with suitable opportunities.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-foreground font-medium mb-2">2. How We Use Your Information</h4>
                    <p className="text-sm">
                      Your information is used to provide platform services, match you with opportunities, 
                      improve our AI recommendations, and communicate important updates. We never sell 
                      your personal data to third parties.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-foreground font-medium mb-2">3. Data Sharing</h4>
                    <p className="text-sm">
                      Your profile information is shared with employers only when you apply for opportunities. 
                      Universities may access your placement data if you're part of their WIL programme. 
                      Blind match mode hides identifying information until mutual interest is established.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-foreground font-medium mb-2">4. Your Rights Under POPIA</h4>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      <li>Access your personal information</li>
                      <li>Request correction of inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to processing of your data</li>
                      <li>Withdraw consent at any time</li>
                      <li>Lodge a complaint with the Information Regulator</li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-foreground font-medium mb-2">5. Data Retention</h4>
                    <p className="text-sm">
                      We retain your data for as long as your account is active. Upon account deletion, 
                      your personal data is permanently removed within 30 days, except where retention 
                      is required by law.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-foreground font-medium mb-2">6. Contact Us</h4>
                    <p className="text-sm">
                      For privacy-related inquiries or to exercise your rights, contact our Information 
                      Officer at <a href="mailto:privacy@internus.co.za" className="text-primary hover:underline">
                      privacy@internus.co.za</a>.
                    </p>
                  </section>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
