import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
  Line, LineChart, Legend,
} from "recharts";
import { useStore, calcInvoice, fmt } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/analytics")({ component: Analytics });

function Analytics() {
  const { invoices } = useStore();

  const byMonth = useMemo(() => {
    const data = [
      { m: "Jan", paid: 4200, unpaid: 800 },
      { m: "Feb", paid: 7800, unpaid: 1200 },
      { m: "Mar", paid: 6400, unpaid: 2400 },
      { m: "Apr", paid: 11800, unpaid: 1800 },
      { m: "May", paid: 14200, unpaid: 3200 },
      { m: "Jun", paid: 12400, unpaid: 2200 },
      { m: "Jul", paid: 16800, unpaid: 4200 },
      { m: "Aug", paid: 15400, unpaid: 3000 },
      { m: "Sep", paid: 19400, unpaid: 4800 },
    ];
    return data;
  }, []);

  const totalRev = invoices.reduce((s, i) => s + calcInvoice(i).grandTotal, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Analytics</h1>
        <p className="text-sm text-muted-foreground">Beautiful insights into your invoicing performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { l: "Revenue (YTD)", v: fmt(totalRev), d: "+24% vs prev period" },
          { l: "Avg invoice", v: fmt(totalRev / Math.max(1, invoices.length)), d: "Across all clients" },
          { l: "Collection rate", v: "92%", d: "of invoices paid on time" },
        ].map(s => (
          <Card key={s.l} className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{s.v}</div>
            <Badge variant="secondary" className="mt-2 rounded-full text-xs">{s.d}</Badge>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Revenue · paid vs outstanding</div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="paid" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="unpaid" fill="var(--warning)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cashflow trend</div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byMonth} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="paid" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="unpaid" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
