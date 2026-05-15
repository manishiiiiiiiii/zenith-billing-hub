import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const { theme, toggle } = useTheme();
  const [density, setDensity] = useState([1]);
  const [radius, setRadius] = useState([16]);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize your invoicing experience.</p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Appearance</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Row label="Theme" desc="Light or dark mode">
            <div className="flex items-center gap-2"><span className="text-xs">Light</span><Switch checked={theme === "dark"} onCheckedChange={toggle} /><span className="text-xs">Dark</span></div>
          </Row>
          <Row label="Animations" desc="Subtle motion across the app">
            <Switch checked={animations} onCheckedChange={setAnimations} />
          </Row>
          <Row label="Visual density" desc="Compact or comfortable spacing">
            <Slider value={density} onValueChange={setDensity} min={0} max={2} step={1} />
          </Row>
          <Row label="Component radius" desc="Border radius across UI">
            <Slider value={radius} onValueChange={setRadius} min={4} max={24} step={2} />
          </Row>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/80 p-6 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><Label className="text-xs">Display name</Label><Input defaultValue="Lumen Studio" className="mt-1 rounded-xl" /></div>
          <div><Label className="text-xs">Email</Label><Input defaultValue="hello@lumenstudio.co" className="mt-1 rounded-xl" /></div>
          <div><Label className="text-xs">Default currency</Label><Input defaultValue="USD" className="mt-1 rounded-xl" /></div>
          <div><Label className="text-xs">Time zone</Label><Input defaultValue="UTC-08:00" className="mt-1 rounded-xl" /></div>
        </div>
        <Button onClick={() => toast.success("Preferences saved")} className="mt-5 rounded-xl gradient-primary text-primary-foreground shadow-glow">Save</Button>
      </Card>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/40 p-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className="min-w-32">{children}</div>
    </div>
  );
}
