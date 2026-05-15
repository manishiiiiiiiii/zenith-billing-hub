import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FilePlus2, LayoutTemplate, Users, Palette,
  FileClock, History, Receipt, BarChart3, Settings, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";

const main = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Create Invoice", url: "/create", icon: FilePlus2 },
  { title: "Invoice Templates", url: "/templates", icon: LayoutTemplate },
  { title: "Clients", url: "/clients", icon: Users },
];

const workspace = [
  { title: "Branding Studio", url: "/branding", icon: Palette },
  { title: "Saved Drafts", url: "/drafts", icon: FileClock },
  { title: "Invoice History", url: "/history", icon: History },
];

const insights = [
  { title: "Tax Settings", url: "/tax", icon: Receipt },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => p === "/" ? pathname === "/" : pathname.startsWith(p);

  const renderGroup = (label: string, items: typeof main) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="group h-10 rounded-xl data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted/40 text-muted-foreground group-hover:text-foreground"}`}>
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">Invoicely</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Studio</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {renderGroup("Main", main)}
        {renderGroup("Workspace", workspace)}
        {renderGroup("Insights", insights)}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="glass rounded-2xl p-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="font-medium">Pro plan active</span>
          </div>
          <p className="mt-1 text-muted-foreground">Unlimited invoices · cloud sync</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
