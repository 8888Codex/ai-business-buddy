import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Conversas", url: "/conversations", icon: MessageSquare },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around items-center h-16">
      {items.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground text-xs"
          activeClassName="text-primary"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
