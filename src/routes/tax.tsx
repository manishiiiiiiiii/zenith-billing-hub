import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/tax")({ component: Tax });

interface Rule { id: string; name: string; rate: number; region: string; enabled: boolean }

function Tax() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", name: "GST", rate: 18, region: "India", enabled: true },
    { id: "2", name: "VAT", rate: 20, region: "EU", enabled: true },
    { id: "3", name: "Sales Tax", rate: 8.875, region: "NY, US", enabled: true },
    { id: "4", name: "CGST", rate: 9, region: "India", enabled: false },
    { id: "5", name: "SGST", rate: 9, region: "India", enabled: false },
    { id: "6", name: "IGST", rate: 18, region: "India (interstate)", enabled: false },
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Tax settings</h1>
          <p className="text-sm text-muted-foreground">Configure tax rules used across your invoices.</p>
        </div>
        <Button className="rounded-xl gradient-primary text-primary-foreground shadow-glow" onClick={() => setRules(r => [...r, { id: Math.random().toString(36).slice(2), name: "New Tax", rate: 0, region: "", enabled: true }])}>
          <Plus className="mr-1 h-4 w-4" /> Add tax rule
        </Button>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
        <div className="space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="grid grid-cols-12 items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="col-span-12 sm:col-span-3">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
                <Input value={r.name} onChange={(e) => setRules(rs => rs.map(x => x.id === r.id ? { ...x, name: e.target.value } : x))} className="mt-1 rounded-lg" />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Rate %</Label>
                <Input type="number" value={r.rate} onChange={(e) => setRules(rs => rs.map(x => x.id === r.id ? { ...x, rate: +e.target.value } : x))} className="mt-1 rounded-lg" />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Region</Label>
                <Input value={r.region} onChange={(e) => setRules(rs => rs.map(x => x.id === r.id ? { ...x, region: e.target.value } : x))} className="mt-1 rounded-lg" />
              </div>
              <div className="col-span-6 sm:col-span-2 flex items-center gap-2">
                <Switch checked={r.enabled} onCheckedChange={(v) => setRules(rs => rs.map(x => x.id === r.id ? { ...x, enabled: v } : x))} />
                <Badge variant={r.enabled ? "default" : "secondary"}>{r.enabled ? "On" : "Off"}</Badge>
              </div>
              <div className="col-span-6 sm:col-span-1 text-right">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setRules(rs => rs.filter(x => x.id !== r.id))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4 rounded-xl" onClick={() => toast.success("Tax rules saved")}>Save changes</Button>
      </Card>
    </div>
  );
}
