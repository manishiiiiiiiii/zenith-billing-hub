import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Sparkles, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import { InvoicePreview } from "@/components/invoice-preview";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/branding")({ component: Branding });

const PRESETS = [
  { name: "Violet", color: "#7c3aed" },
  { name: "Indigo", color: "#4f46e5" },
  { name: "Sky", color: "#0ea5e9" },
  { name: "Emerald", color: "#10b981" },
  { name: "Rose", color: "#ec4899" },
  { name: "Amber", color: "#f59e0b" },
  { name: "Slate", color: "#475569" },
  { name: "Black", color: "#0a0a0a" },
];

function Branding() {
  const { brand, setBrand, draftInvoice, setDraftInvoice } = useStore();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(brand.logoUrl);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setLogoPreview(url);
      setBrand({ ...brand, logoUrl: url });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Branding studio</h1>
        <p className="text-sm text-muted-foreground">Make every invoice unmistakably yours.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identity</h2>
            <div className="mt-4 space-y-3">
              <div>
                <Label className="text-xs">Company name</Label>
                <Input value={brand.companyName} onChange={(e) => setBrand({ ...brand, companyName: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">Logo</Label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 transition hover:border-primary">
                    {logoPreview ? <img src={logoPreview} alt="" className="max-h-16 max-w-16 object-contain" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  </label>
                  <div className="text-xs text-muted-foreground">PNG, JPG or SVG. Recommended at least 200×200.</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Brand color</h2>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {PRESETS.map(p => (
                <button key={p.color} onClick={() => { setBrand({ ...brand, primary: p.color }); setDraftInvoice({ ...draftInvoice, brandColor: p.color }); }}
                  className={`group relative flex h-16 flex-col items-center justify-center rounded-xl text-[10px] font-medium text-white transition ${brand.primary === p.color ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                  style={{ background: p.color }}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Label className="text-xs">Custom</Label>
              <Input type="color" value={brand.primary} onChange={(e) => { setBrand({ ...brand, primary: e.target.value }); setDraftInvoice({ ...draftInvoice, brandColor: e.target.value }); }} className="h-10 w-20 rounded-xl" />
              <Input value={brand.primary} onChange={(e) => setBrand({ ...brand, primary: e.target.value })} className="rounded-xl" />
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Typography</h2>
            <div className="mt-4 grid gap-3">
              <div>
                <Label className="text-xs">Heading font</Label>
                <Select value={brand.font} onValueChange={(v) => setBrand({ ...brand, font: v })}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Inter", "Geist", "DM Sans", "Manrope", "Poppins", "Playfair Display", "Space Grotesk"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Button onClick={() => toast.success("Brand profile saved")} className="w-full rounded-xl gradient-primary text-primary-foreground shadow-glow">
            <Save className="mr-1 h-4 w-4" /> Save brand profile
          </Button>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 backdrop-blur xl:sticky xl:top-20 xl:self-start">
          <div className="mx-auto overflow-hidden">
            <InvoicePreview invoice={{ ...draftInvoice, brandColor: brand.primary }} companyName={brand.companyName} logoUrl={brand.logoUrl} zoom={0.7} />
          </div>
        </div>
      </div>
    </div>
  );
}
