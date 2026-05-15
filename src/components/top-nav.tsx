import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Moon, Plus, Search, Sun, Sparkles } from "lucide-react";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";

export function TopNav() {
  const { theme, toggle } = useTheme();
  const { invoices } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const recent = invoices.slice(0, 4);
  const filtered = q
    ? invoices.filter((i) => i.number.toLowerCase().includes(q.toLowerCase()) || i.client?.name.toLowerCase().includes(q.toLowerCase()))
    : recent;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="md:hidden" />

      <Popover>
        <PopoverTrigger asChild>
          <button className="group flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 text-sm text-muted-foreground transition hover:bg-muted/70">
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search invoices, clients, items…</span>
            <kbd className="hidden rounded-md border border-border/70 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">⌘K</kbd>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-2" align="start">
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to search…"
            className="mb-2"
          />
          <div className="space-y-1 text-sm">
            <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {q ? "Results" : "Recent"}
            </div>
            {filtered.length === 0 && <div className="px-2 py-6 text-center text-muted-foreground">No matches</div>}
            {filtered.map((i) => (
              <button
                key={i.id}
                onClick={() => navigate({ to: "/history" })}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-accent"
              >
                <div>
                  <div className="font-medium">{i.number}</div>
                  <div className="text-xs text-muted-foreground">{i.client?.name ?? "—"}</div>
                </div>
                <Badge variant="outline" className="capitalize">{i.status}</Badge>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-2">
        <Button asChild size="sm" className="hidden h-9 gap-1.5 rounded-xl gradient-primary text-primary-foreground shadow-glow hover:opacity-90 sm:inline-flex">
          <Link to="/create"><Plus className="h-4 w-4" /> New Invoice</Link>
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Recent activity</span>
              <Badge variant="secondary">3 new</Badge>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="rounded-lg border border-border/60 p-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3 w-3" /> Just now</div>
                <p>Invoice <b>INV-2026-001</b> was paid by Sarah Mitchell.</p>
              </li>
              <li className="rounded-lg border border-border/60 p-2.5">
                <div className="text-xs text-muted-foreground">2h ago</div>
                <p>Client <b>Verma Tech</b> opened invoice INV-2026-002.</p>
              </li>
              <li className="rounded-lg border border-border/60 p-2.5">
                <div className="text-xs text-muted-foreground">Yesterday</div>
                <p>Invoice <b>INV-2026-003</b> is overdue by 5 days.</p>
              </li>
            </ul>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9 rounded-xl" aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-1 pr-3 transition hover:bg-card">
              <Avatar className="h-7 w-7"><AvatarImage src="" /><AvatarFallback className="gradient-primary text-xs text-primary-foreground">LS</AvatarFallback></Avatar>
              <span className="hidden text-sm font-medium md:inline">Lumen Studio</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/branding">Branding studio</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/tax">Tax settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
