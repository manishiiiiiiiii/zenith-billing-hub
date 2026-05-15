import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Search, Heart } from "lucide-react";
import { useStore, newDraft } from "@/lib/store";
import { InvoicePreview } from "@/components/invoice-preview";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/templates")({ component: Templates });

const TEMPLATES = [
  { id: "modern", name: "Modern", category: "Popular", color: "#7c3aed" },
  { id: "minimal", name: "Minimal", category: "Popular", color: "#64748b" },
  { id: "corporate", name: "Corporate", category: "Business", color: "#0ea5e9" },
  { id: "creative", name: "Creative", category: "Design", color: "#ec4899" },
  { id: "agency", name: "Agency", category: "Business", color: "#f97316" },
  { id: "freelancer", name: "Freelancer", category: "Solo", color: "#14b8a6" },
  { id: "luxury", name: "Luxury", category: "Premium", color: "#0a0a0a" },
  { id: "startup", name: "Startup", category: "Tech", color: "#8b5cf6" },
  { id: "elegant", name: "Elegant", category: "Premium", color: "#475569" },
  { id: "classic", name: "Classic", category: "Traditional", color: "#dc2626" },
];

function Templates() {
  const { brand, draftInvoice, setDraftInvoice } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [favs, setFavs] = useState<string[]>(["modern", "luxury"]);

  const cats = ["all", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const list = TEMPLATES.filter(t =>
    (cat === "all" || t.category === cat) &&
    (!q || t.name.toLowerCase().includes(q.toLowerCase()))
  );

  const sample = { ...draftInvoice };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Invoice templates</h1>
        <p className="text-sm text-muted-foreground">Beautiful designs, ready in one click.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={cat} onValueChange={setCat}>
          <TabsList className="rounded-xl">
            {cats.map(c => <TabsTrigger key={c} value={c} className="rounded-lg capitalize">{c}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates" className="w-64 rounded-xl pl-9" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((t) => {
          const isActive = draftInvoice.template === t.id;
          const isFav = favs.includes(t.id);
          return (
            <Card key={t.id} className="group overflow-hidden rounded-2xl border-border/60 bg-card/80 p-3 backdrop-blur transition hover:shadow-elegant">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 origin-top-left scale-[0.32]">
                  <InvoicePreview invoice={{ ...sample, template: t.id, brandColor: t.color }} companyName={brand.companyName} />
                </div>
                {isActive && (
                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <Badge variant="secondary" className="mt-1 rounded-full text-[10px]">{t.category}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setFavs(f => f.includes(t.id) ? f.filter(x => x !== t.id) : [...f, t.id])}>
                    <Heart className={`h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                  </Button>
                  <Button size="sm" className="h-8 rounded-lg" onClick={() => { setDraftInvoice({ ...draftInvoice, template: t.id, brandColor: t.color }); navigate({ to: "/create" }); }}>
                    Use
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
