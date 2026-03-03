import { LayoutDashboard, MessageSquare, Settings, Plus, Bot } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Conversas", url: "/conversations", icon: MessageSquare },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
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
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Plano Gratuito</Badge>
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
  );
}
