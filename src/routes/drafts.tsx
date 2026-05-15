import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, calcInvoice, fmt } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileClock, Pencil } from "lucide-react";
import { StatusBadge } from "./index";

export const Route = createFileRoute("/drafts")({ component: Drafts });

function Drafts() {
  const { invoices, draftInvoice } = useStore();
  const drafts = [draftInvoice, ...invoices.filter(i => i.status === "draft")];

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Saved drafts</h1>
        <p className="text-sm text-muted-foreground">Pick up where you left off — drafts auto-save as you type.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drafts.map((d) => {
          const c = calcInvoice(d);
          return (
            <Card key={d.id} className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-glow"><FileClock className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{d.number}</div>
                  <div className="text-xs text-muted-foreground">{d.client?.name ?? "Unassigned"}</div>
                </div>
                <StatusBadge status="draft" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="text-lg font-semibold tabular-nums">{fmt(c.grandTotal, d.currency)}</div>
                </div>
                <Button asChild size="sm" className="rounded-xl"><Link to="/create"><Pencil className="mr-1 h-3 w-3" /> Resume</Link></Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
