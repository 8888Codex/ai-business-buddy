import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WizardProvider } from "@/contexts/WizardContext";

// Layout que provê WizardContext para wizard + connect
const WizardLayout = () => <WizardProvider><Outlet /></WizardProvider>;

import PublicLayout from "@/components/layouts/PublicLayout";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import Conversations from "@/pages/Conversations";
import SettingsPage from "@/pages/Settings";
import Connect from "@/pages/Connect";
import WizardStep1 from "@/pages/wizard/WizardStep1";
import WizardStep2 from "@/pages/wizard/WizardStep2";
import WizardStep3 from "@/pages/wizard/WizardStep3";
import WizardStep4 from "@/pages/wizard/WizardStep4";
import WizardStep5 from "@/pages/wizard/WizardStep5";
import WizardStep6 from "@/pages/wizard/WizardStep6";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Authenticated routes */}
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Wizard + Connect compartilham o WizardProvider */}
              <Route element={<WizardLayout />}>
                <Route path="/connect" element={<Connect />} />
                <Route path="/wizard/step-1" element={<WizardStep1 />} />
                <Route path="/wizard/step-2" element={<WizardStep2 />} />
                <Route path="/wizard/step-3" element={<WizardStep3 />} />
                <Route path="/wizard/step-4" element={<WizardStep4 />} />
                <Route path="/wizard/step-5" element={<WizardStep5 />} />
                <Route path="/wizard/step-6" element={<WizardStep6 />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
