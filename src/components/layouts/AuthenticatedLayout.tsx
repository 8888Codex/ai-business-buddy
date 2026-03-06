import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { AgentProvider } from "@/contexts/AgentContext";
import { TrialExpiredOverlay } from "@/components/TrialExpiredOverlay";
import { Loader2 } from "lucide-react";

function isTrialExpired(user: { plan: string; plan_expires_at?: string } | null): boolean {
  if (!user || user.plan !== "trial" || !user.plan_expires_at) return false;
  return new Date(user.plan_expires_at) < new Date();
}

export default function AuthenticatedLayout() {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const trialExpired = isTrialExpired(user);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AgentProvider>
      {trialExpired && <TrialExpiredOverlay />}
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isMobile && <AppSidebar />}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card shrink-0">
            {!isMobile && <SidebarTrigger className="mr-3" />}
            <span className="font-semibold text-foreground text-lg">Funcionário de IA</span>
          </header>

          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
            <Outlet />
          </main>
        </div>

        {isMobile && <BottomNav />}
      </div>
    </SidebarProvider>
    </AgentProvider>
  );
}
