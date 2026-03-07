import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Plus,
  Bot,
  RefreshCw,
  Share2,
  Zap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAgent } from "@/contexts/AgentContext";
import { useToast } from "@/hooks/use-toast";
import { ReconnectWhatsAppDialog } from "@/components/ReconnectWhatsAppDialog";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Agentes", url: "/agents", icon: Bot },
  { title: "Conversas", url: "/conversations", icon: MessageSquare },
  { title: "Configurações", url: "/settings", icon: Settings },
];

const PLAN_LABELS: Record<string, string> = {
  trial: "Plano Trial",
  starter: "Plano Starter",
  pro: "Plano Pro",
  business: "Plano Business",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user } = useAuth();
  const { agent } = useAgent();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reconnectOpen, setReconnectOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const planLabel = user?.plan ? (PLAN_LABELS[user.plan] ?? user.plan) : "Plano Gratuito";
  const planLabelWithTrial = user?.plan === "trial" && user.trial_days_left
    ? `${planLabel} — ${user.trial_days_left}d`
    : planLabel;

  const handleShareLink = async () => {
    const phone = agent?.whatsapp_phone ?? null;
    if (!phone) {
      toast({ title: "WhatsApp não conectado", description: "Conecte o WhatsApp para compartilhar seu link.", variant: "destructive" });
      return;
    }
    await navigator.clipboard.writeText(`https://wa.me/${phone}`);
    toast({ title: "Link copiado!", description: `wa.me/${phone}` });
  };

  const quickActions = [
    {
      icon: Settings,
      label: "Editar Prompt",
      onClick: () => navigate("/agents"),
    },
    {
      icon: RefreshCw,
      label: "Reconectar WhatsApp",
      onClick: () => setReconnectOpen(true),
    },
    {
      icon: Share2,
      label: "Compartilhar Link",
      onClick: handleShareLink,
    },
    {
      icon: Zap,
      label: "Fazer Upgrade",
      onClick: () => setUpgradeOpen(true),
      highlight: true,
    },
  ];

  return (
    <>
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-7 w-7 text-primary shrink-0" />
          {!collapsed && (
            <span className="font-bold text-lg text-foreground whitespace-nowrap">
              Funcionário de IA
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Navegação principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent/50"
                      activeClassName="bg-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Ações rápidas */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-muted-foreground px-2 mb-1">
              Ações Rápidas
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          onClick={action.onClick}
                          className={
                            action.highlight
                              ? "text-primary hover:bg-primary/10"
                              : "hover:bg-accent/50"
                          }
                        >
                          <action.icon className="h-4 w-4 shrink-0" />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">{action.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <SidebarMenuButton
                      onClick={action.onClick}
                      className={
                        action.highlight
                          ? "text-primary hover:bg-primary/10"
                          : "hover:bg-accent/50"
                      }
                    >
                      <action.icon className="mr-2 h-4 w-4 shrink-0" />
                      <span>{action.label}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`text-xs ${user?.plan === "trial" && user.trial_days_left && user.trial_days_left <= 3 ? "bg-orange-100 text-orange-800" : ""}`}
            >
              {planLabelWithTrial}
            </Badge>
          </div>
        )}
        <Button
          className="w-full gap-2"
          size={collapsed ? "icon" : "default"}
          asChild
        >
          <NavLink to="/wizard/step-1">
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Criar Novo Agente</span>}
          </NavLink>
        </Button>
      </SidebarFooter>
    </Sidebar>

    <ReconnectWhatsAppDialog open={reconnectOpen} onOpenChange={setReconnectOpen} />
    <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  );
}
