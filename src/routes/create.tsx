import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown, GripVertical, Plus, Save, Send, Trash2, Copy, Eye,
  Smartphone, Tablet, Monitor, ZoomIn, ZoomOut, FileDown, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useStore, calcInvoice, calcItem, fmt, newDraft, CURRENCIES, type InvoiceItem, type Client } from "@/lib/store";
import { InvoicePreview } from "@/components/invoice-preview";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/create")({ component: Create });

const uid = () => Math.random().toString(36).slice(2, 10);

function Create() {
  const navigate = useNavigate();
  const { draftInvoice, setDraftInvoice, saveInvoice, clients, addClient, brand } = useStore();
  const inv = draftInvoice;
  const set = (patch: Partial<typeof inv>) => setDraftInvoice({ ...inv, ...patch });
  const totals = calcInvoice(inv);

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoom, setZoom] = useState(0.7);

  // Auto-save toast
  useEffect(() => {
    const t = setTimeout(() => {}, 1000);
    return () => clearTimeout(t);
  }, [inv]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault(); addItem();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const addItem = () => set({ items: [...inv.items, { id: uid(), name: "", quantity: 1, unitPrice: 0, discount: 0, tax: inv.items[0]?.tax ?? 0 }] });
  const updateItem = (id: string, patch: Partial<InvoiceItem>) => set({ items: inv.items.map(i => i.id === id ? { ...i, ...patch } : i) });
  const removeItem = (id: string) => set({ items: inv.items.filter(i => i.id !== id) });
  const duplicateItem = (id: string) => {
    const idx = inv.items.findIndex(i => i.id === id);
    const next = [...inv.items];
    next.splice(idx + 1, 0, { ...inv.items[idx], id: uid() });
    set({ items: next });
  };

  const handleSave = () => {
    saveInvoice({ ...inv, status: inv.status === "draft" ? "unpaid" : inv.status });
    toast.success("Invoice saved", { description: `${inv.number} has been added to your history.` });
  };
  const handleNew = () => setDraftInvoice(newDraft(brand));

  const previewWidth = device === "mobile" ? 380 : device === "tablet" ? 720 : 980;

  return (
    <div className="mx-auto max-w-[1600px] animate-[fade-in_0.4s_ease-out]">
      {/* Action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge variant="secondary" className="rounded-full"><Sparkles className="mr-1 h-3 w-3" /> Invoice editor</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Create a beautiful invoice</h1>
          <p className="text-sm text-muted-foreground">All changes auto-save · ⌘S to save · ⌘D to duplicate row</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleNew}><Plus className="mr-1.5 h-4 w-4" /> New</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => window.print()}><FileDown className="mr-1.5 h-4 w-4" /> Export PDF</Button>
          <Button onClick={handleSave} className="rounded-xl gradient-primary text-primary-foreground shadow-glow"><Save className="mr-1.5 h-4 w-4" /> Save invoice</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* LEFT — form */}
        <div className="space-y-5">
          {/* Header info */}
          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <SectionTitle>Invoice details</SectionTitle>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Invoice number">
                <Input value={inv.number} onChange={(e) => set({ number: e.target.value })} className="rounded-xl" />
              </Field>
              <Field label="Currency">
                <Select value={inv.currency} onValueChange={(v) => set({ currency: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.symbol} {k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Issue date">
                <Input type="date" value={inv.issueDate} onChange={(e) => set({ issueDate: e.target.value })} className="rounded-xl" />
              </Field>
              <Field label="Due date">
                <Input type="date" value={inv.dueDate} onChange={(e) => set({ dueDate: e.target.value })} className="rounded-xl" />
              </Field>
            </div>
          </Card>

          {/* Client */}
          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <SectionTitle>Client</SectionTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs"><Plus className="h-3.5 w-3.5" /> Choose existing</Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-1">
                  <ScrollArea className="h-64">
                    {clients.map((c) => (
                      <button key={c.id} onClick={() => set({ client: c, currency: c.currency || inv.currency })} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-accent">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">{c.name.charAt(0)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{c.company}</div>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Client name">
                <Input value={inv.client?.name ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), name: e.target.value } })} className="rounded-xl" placeholder="John Doe" />
              </Field>
              <Field label="Company">
                <Input value={inv.client?.company ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), company: e.target.value } })} className="rounded-xl" placeholder="Acme Inc." />
              </Field>
              <Field label="Email">
                <Input value={inv.client?.email ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), email: e.target.value } })} className="rounded-xl" placeholder="hello@acme.com" />
              </Field>
              <Field label="Phone">
                <Input value={inv.client?.phone ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), phone: e.target.value } })} className="rounded-xl" />
              </Field>
              <Field label="Billing address" full>
                <Textarea rows={2} value={inv.client?.billingAddress ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), billingAddress: e.target.value } })} className="rounded-xl" />
              </Field>
              <Field label="Tax ID / GSTIN">
                <Input value={inv.client?.taxId ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), taxId: e.target.value } })} className="rounded-xl" />
              </Field>
              <Field label="Country">
                <Input value={inv.client?.country ?? ""} onChange={(e) => set({ client: { ...(inv.client ?? blankClient()), country: e.target.value } })} className="rounded-xl" />
              </Field>
            </div>
            {inv.client?.name && (
              <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={() => { addClient({ ...(inv.client as Client), id: uid(), createdAt: new Date().toISOString() }); toast.success("Client saved to address book"); }}>
                Save to clients
              </Button>
            )}
          </Card>

          {/* Items */}
          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <SectionTitle>Items</SectionTitle>
              <Button size="sm" onClick={addItem} className="gap-1 rounded-xl"><Plus className="h-3.5 w-3.5" /> Add item</Button>
            </div>
            <div className="mt-4 space-y-2">
              {inv.items.map((it, idx) => {
                const c = calcItem(it);
                return (
                  <Collapsible key={it.id} className="group rounded-xl border border-border/60 bg-background/40">
                    <div className="flex items-center gap-2 p-2">
                      <button className="cursor-grab text-muted-foreground"><GripVertical className="h-4 w-4" /></button>
                      <span className="w-6 text-center text-xs text-muted-foreground tabular-nums">{idx + 1}</span>
                      <Input
                        placeholder="Item name"
                        value={it.name}
                        onChange={(e) => updateItem(it.id, { name: e.target.value })}
                        className="h-9 flex-1 rounded-lg border-transparent bg-transparent text-sm focus-visible:border-input focus-visible:bg-background"
                      />
                      <Input type="number" value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: +e.target.value || 0 })} className="h-9 w-16 rounded-lg text-right text-sm" />
                      <Input type="number" value={it.unitPrice} onChange={(e) => updateItem(it.id, { unitPrice: +e.target.value || 0 })} className="h-9 w-24 rounded-lg text-right text-sm" />
                      <div className="hidden w-24 text-right text-sm font-semibold tabular-nums sm:block">{fmt(c.total, inv.currency)}</div>
                      <CollapsibleTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8"><ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" /></Button>
                      </CollapsibleTrigger>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => duplicateItem(it.id)}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeItem(it.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                    <CollapsibleContent>
                      <div className="grid gap-3 border-t border-border/60 p-3 sm:grid-cols-3">
                        <Field label="Description" full><Textarea rows={2} value={it.description ?? ""} onChange={(e) => updateItem(it.id, { description: e.target.value })} className="rounded-lg" /></Field>
                        <Field label="SKU"><Input value={it.sku ?? ""} onChange={(e) => updateItem(it.id, { sku: e.target.value })} className="rounded-lg" /></Field>
                        <Field label="Category"><Input value={it.category ?? ""} onChange={(e) => updateItem(it.id, { category: e.target.value })} className="rounded-lg" /></Field>
                        <Field label="Unit"><Input value={it.unit ?? ""} placeholder="hr, pcs…" onChange={(e) => updateItem(it.id, { unit: e.target.value })} className="rounded-lg" /></Field>
                        <Field label="Discount %"><Input type="number" value={it.discount} onChange={(e) => updateItem(it.id, { discount: +e.target.value || 0 })} className="rounded-lg" /></Field>
                        <Field label="Tax %"><Input type="number" value={it.tax} onChange={(e) => updateItem(it.id, { tax: +e.target.value || 0 })} className="rounded-lg" /></Field>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </Card>

          {/* Totals + payment */}
          <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur">
            <SectionTitle>Totals & payment</SectionTitle>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Field label="Shipping">
                  <Input type="number" value={inv.shipping} onChange={(e) => set({ shipping: +e.target.value || 0 })} className="rounded-xl" />
                </Field>
                <Field label="Additional fees">
                  <Input type="number" value={inv.additionalFees} onChange={(e) => set({ additionalFees: +e.target.value || 0 })} className="rounded-xl" />
                </Field>
                <Field label="Amount paid">
                  <Input type="number" value={inv.paidAmount} onChange={(e) => set({ paidAmount: +e.target.value || 0 })} className="rounded-xl" />
                </Field>
                <Field label="Payment method">
                  <Select value={inv.paymentMethod ?? ""} onValueChange={(v) => set({ paymentMethod: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      {["UPI", "Bank Transfer", "PayPal", "Credit Card", "Cash"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={inv.status} onValueChange={(v: any) => set({ status: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["draft", "unpaid", "partial", "paid", "overdue"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="space-y-2 text-sm">
                  <Row label="Subtotal" value={fmt(totals.subtotal, inv.currency)} />
                  <Row label="Discount" value={`- ${fmt(totals.discount, inv.currency)}`} />
                  <Row label="Tax" value={fmt(totals.tax, inv.currency)} />
                  <Row label="Shipping" value={fmt(inv.shipping, inv.currency)} />
                  <Row label="Fees" value={fmt(inv.additionalFees, inv.currency)} />
                  <div className="my-2 border-t border-border" />
                  <Row label="Grand total" value={fmt(totals.grandTotal, inv.currency)} bold />
                  <Row label="Paid" value={fmt(inv.paidAmount, inv.currency)} muted />
                  <div className="rounded-xl gradient-primary p-3 text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider opacity-80">Balance due</span>
                      <span className="text-xl font-bold tabular-nums">{fmt(totals.balance, inv.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Field label="Notes"><Textarea rows={3} value={inv.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} className="rounded-xl" /></Field>
              <Field label="Terms & conditions"><Textarea rows={3} value={inv.terms ?? ""} onChange={(e) => set({ terms: e.target.value })} className="rounded-xl" /></Field>
            </div>
          </Card>
        </div>

        {/* RIGHT — preview */}
        <div className="space-y-3 xl:sticky xl:top-20 xl:self-start">
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 p-2 backdrop-blur">
            <Tabs value={device} onValueChange={(v: any) => setDevice(v)}>
              <TabsList className="rounded-xl">
                <TabsTrigger value="desktop" className="gap-1 rounded-lg text-xs"><Monitor className="h-3.5 w-3.5" /> Desktop</TabsTrigger>
                <TabsTrigger value="tablet" className="gap-1 rounded-lg text-xs"><Tablet className="h-3.5 w-3.5" /> Tablet</TabsTrigger>
                <TabsTrigger value="mobile" className="gap-1 rounded-lg text-xs"><Smartphone className="h-3.5 w-3.5" /> Mobile</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-1 px-2">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
              <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 backdrop-blur">
            <div className="mx-auto overflow-hidden" style={{ width: previewWidth, maxWidth: "100%" }}>
              <InvoicePreview invoice={inv} companyName={brand.companyName} logoUrl={brand.logoUrl} zoom={zoom} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function blankClient(): Client {
  return { id: "tmp", name: "", createdAt: new Date().toISOString() };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-muted-foreground" : ""}`}>
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={`tabular-nums ${bold ? "text-base font-semibold" : ""}`}>{value}</span>
    </div>
  );
}
