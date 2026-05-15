import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowUpRight, FileText, CheckCircle2, Clock, AlertTriangle, Plus, Sparkles, TrendingUp,
} from "lucide-react";

import { useStore, calcInvoice, fmt } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { invoices } = useStore();

  const stats = useMemo(() => {
    let revenue = 0, paid = 0, unpaid = 0, overdue = 0;
    invoices.forEach((i) => {
      const c = calcInvoice(i);
      revenue += c.grandTotal;
      if (i.status === "paid") paid += c.grandTotal;
      else if (i.status === "overdue") overdue += c.balance;
      else if (i.status === "unpaid" || i.status === "partial") unpaid += c.balance;
    });
    return { revenue, paid, unpaid, overdue };
  }, [invoices]);

  const monthly = [
    { m: "Jan", r: 8400 }, { m: "Feb", r: 12200 }, { m: "Mar", r: 9800 },
    { m: "Apr", r: 14600 }, { m: "May", r: 18200 }, { m: "Jun", r: 15400 },
    { m: "Jul", r: 21800 }, { m: "Aug", r: 19400 }, { m: "Sep", r: 24600 },
  ];

  const statusData = [
    { name: "Paid", value: invoices.filter(i => i.status === "paid").length, color: "var(--success)" },
    { name: "Unpaid", value: invoices.filter(i => i.status === "unpaid").length, color: "var(--primary)" },
    { name: "Overdue", value: invoices.filter(i => i.status === "overdue").length, color: "var(--destructive)" },
    { name: "Partial", value: invoices.filter(i => i.status === "partial").length, color: "var(--warning)" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-[slide-up_0.5s_ease-out]">
      {/* Hero */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles className="mr-1 h-3 w-3" /> Welcome back, Lumen
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Your invoicing, <span className="gradient-text">at a glance.</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">A premium overview of revenue, clients and pending work.</p>
        </div>
        <Button asChild className="h-11 gap-2 rounded-xl gradient-primary text-primary-foreground shadow-glow">
          <Link to="/create"><Plus className="h-4 w-4" /> Create new invoice</Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={fmt(stats.revenue)} delta="+18.2%" icon={TrendingUp} accent />
        <StatCard label="Paid invoices" value={fmt(stats.paid)} delta={`${invoices.filter(i=>i.status==='paid').length} invoices`} icon={CheckCircle2} />
        <StatCard label="Pending" value={fmt(stats.unpaid)} delta={`${invoices.filter(i=>i.status==='unpaid'||i.status==='partial').length} invoices`} icon={Clock} />
        <StatCard label="Overdue" value={fmt(stats.overdue)} delta={`${invoices.filter(i=>i.status==='overdue').length} invoices`} icon={AlertTriangle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="col-span-1 rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Revenue trend</div>
              <div className="text-2xl font-semibold tracking-tight">{fmt(stats.revenue)}</div>
            </div>
            <Badge variant="outline" className="rounded-full text-xs">Last 9 months</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ left: -16, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={11} />
                <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="r" stroke="var(--primary)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status breakdown</div>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2 text-sm">
            {statusData.map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /> {s.name}</div>
                <span className="text-muted-foreground">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent invoices</div>
              <div className="text-base font-semibold">Latest activity</div>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs"><Link to="/history">View all <ArrowUpRight className="h-3 w-3" /></Link></Button>
          </div>
          <div className="space-y-2">
            {invoices.slice(0, 5).map((i) => {
              const c = calcInvoice(i);
              return (
                <div key={i.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition hover:bg-accent/40">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarFallback className="text-xs">{i.client?.name.split(" ").map(s => s[0]).join("").slice(0,2) ?? "?"}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{i.number}</div>
                      <div className="text-xs text-muted-foreground">{i.client?.name ?? "—"} · {i.issueDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">{fmt(c.grandTotal, i.currency)}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{i.currency}</div>
                    </div>
                    <StatusBadge status={i.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Goal progress</div>
          <div className="mt-3 text-2xl font-semibold">{fmt(stats.revenue)} <span className="text-sm text-muted-foreground font-normal">/ $50,000</span></div>
          <Progress value={Math.min(100, (stats.revenue / 50000) * 100)} className="mt-3 h-2" />
          <div className="mt-1 text-xs text-muted-foreground">Quarterly target</div>

          <div className="mt-6 space-y-3">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Top clients</div>
            <ul className="space-y-2 text-sm">
              {Array.from(new Map(invoices.map(i => [i.client?.id, i.client])).values()).filter(Boolean).slice(0,3).map((c) => (
                <li key={c!.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5">
                  <Avatar className="h-8 w-8"><AvatarFallback className="text-xs gradient-primary text-primary-foreground">{c!.name.charAt(0)}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium leading-none">{c!.name}</div>
                    <div className="text-xs text-muted-foreground">{c!.company}</div>
                  </div>
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, icon: Icon, accent }: { label: string; value: string; delta: string; icon: any; accent?: boolean }) {
  return (
    <Card className={`group relative overflow-hidden rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur transition hover:shadow-elegant ${accent ? "" : ""}`}>
      {accent && <div className="absolute inset-0 -z-0 opacity-10 gradient-primary" />}
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-foreground"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

