import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star, Phone, Mail, Plus, MapPin, MoreHorizontal } from "lucide-react";
import { useStore, type Client } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Client>>({});

  const list = clients.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.company ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Clients</h1>
          <p className="text-sm text-muted-foreground">Your address book of customers and partners.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients" className="w-64 rounded-xl pl-9" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gradient-primary text-primary-foreground shadow-glow"><Plus className="mr-1 h-4 w-4" /> Add client</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>New client</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label className="text-xs">Name</Label><Input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-xs">Company</Label><Input value={draft.company ?? ""} onChange={(e) => setDraft({ ...draft, company: e.target.value })} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-xs">Email</Label><Input value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-xs">Phone</Label><Input value={draft.phone ?? ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="mt-1 rounded-xl" /></div>
                <div className="sm:col-span-2"><Label className="text-xs">Billing address</Label><Input value={draft.billingAddress ?? ""} onChange={(e) => setDraft({ ...draft, billingAddress: e.target.value })} className="mt-1 rounded-xl" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={() => {
                  if (!draft.name) return toast.error("Name is required");
                  addClient({ id: Math.random().toString(36).slice(2), name: draft.name, ...draft, createdAt: new Date().toISOString() } as Client);
                  setDraft({}); setOpen(false); toast.success("Client added");
                }}>Save client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Card key={c.id} className="group rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur transition hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12"><AvatarFallback className="gradient-primary text-sm font-semibold text-primary-foreground">{c.name.split(" ").map(s=>s[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.company}</div>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateClient({ ...c, favorite: !c.favorite })}>
                <Star className={`h-4 w-4 ${c.favorite ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              </Button>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              {c.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {c.email}</div>}
              {c.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {c.phone}</div>}
              {c.billingAddress && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {c.billingAddress}</div>}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className="rounded-full text-xs">{c.country ?? "—"}</Badge>
              <div className="flex gap-1">
                <Badge variant="outline" className="rounded-full text-xs">{c.currency ?? "USD"}</Badge>
              </div>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No clients found. Try a different search or add one.
          </div>
        )}
      </div>
    </div>
  );
}
