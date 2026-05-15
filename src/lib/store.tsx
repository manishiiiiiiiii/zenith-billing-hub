import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  taxId?: string;
  country?: string;
  currency?: string;
  notes?: string;
  favorite?: boolean;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discount: number; // percent
  tax: number; // percent
}

export type InvoiceStatus = "paid" | "unpaid" | "partial" | "overdue" | "draft";

export interface Invoice {
  id: string;
  number: string;
  client: Client | null;
  items: InvoiceItem[];
  issueDate: string;
  dueDate: string;
  currency: string;
  notes?: string;
  terms?: string;
  status: InvoiceStatus;
  paidAmount: number;
  shipping: number;
  additionalFees: number;
  paymentMethod?: string;
  template: string;
  brandColor: string;
  tags: string[];
  pinned?: boolean;
  createdAt: string;
}

export interface Brand {
  companyName: string;
  logoUrl?: string;
  primary: string;
  font: string;
  watermark?: string;
}

interface AppState {
  invoices: Invoice[];
  clients: Client[];
  brand: Brand;
  draftInvoice: Invoice;
  setDraftInvoice: (i: Invoice) => void;
  saveInvoice: (i: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addClient: (c: Client) => void;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  setBrand: (b: Brand) => void;
}

const Ctx = createContext<AppState | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

const sampleClients: Client[] = [
  { id: "c1", name: "Sarah Mitchell", company: "Northwind Studios", email: "sarah@northwind.co", phone: "+1 555 1042", billingAddress: "221 Baker St, San Francisco, CA", country: "United States", currency: "USD", favorite: true, createdAt: new Date().toISOString() },
  { id: "c2", name: "Arjun Verma", company: "Verma Tech Pvt Ltd", email: "arjun@vermatech.in", phone: "+91 98200 11223", billingAddress: "12 MG Road, Bengaluru", taxId: "GSTIN29ABCDE1234F1Z5", country: "India", currency: "INR", createdAt: new Date().toISOString() },
  { id: "c3", name: "Camille Laurent", company: "Atelier Laurent", email: "camille@atelier.fr", country: "France", currency: "EUR", createdAt: new Date().toISOString() },
];

const sampleInvoices: Invoice[] = [
  {
    id: "inv1", number: "INV-2026-001", client: sampleClients[0],
    items: [
      { id: uid(), name: "Brand Identity Design", description: "Full brand system with logo, palette, type", quantity: 1, unitPrice: 4500, discount: 0, tax: 8 },
      { id: uid(), name: "Website Redesign", quantity: 1, unitPrice: 8200, discount: 5, tax: 8 },
    ],
    issueDate: "2026-04-12", dueDate: "2026-05-12", currency: "USD",
    status: "paid", paidAmount: 12530, shipping: 0, additionalFees: 0,
    template: "modern", brandColor: "#7c3aed", tags: ["design", "retainer"],
    createdAt: "2026-04-12",
  },
  {
    id: "inv2", number: "INV-2026-002", client: sampleClients[1],
    items: [{ id: uid(), name: "Cloud Consulting", quantity: 20, unit: "hr", unitPrice: 95, discount: 0, tax: 18 }],
    issueDate: "2026-04-28", dueDate: "2026-05-15", currency: "INR",
    status: "unpaid", paidAmount: 0, shipping: 0, additionalFees: 0,
    template: "corporate", brandColor: "#0ea5e9", tags: ["consulting"],
    createdAt: "2026-04-28",
  },
  {
    id: "inv3", number: "INV-2026-003", client: sampleClients[2],
    items: [{ id: uid(), name: "Photography Session", quantity: 1, unitPrice: 1200, discount: 0, tax: 20 }],
    issueDate: "2026-03-05", dueDate: "2026-04-05", currency: "EUR",
    status: "overdue", paidAmount: 0, shipping: 0, additionalFees: 0,
    template: "creative", brandColor: "#ec4899", tags: ["photo"],
    createdAt: "2026-03-05",
  },
  {
    id: "inv4", number: "INV-2026-004", client: sampleClients[0],
    items: [{ id: uid(), name: "Monthly Retainer", quantity: 1, unitPrice: 3500, discount: 0, tax: 8 }],
    issueDate: "2026-05-01", dueDate: "2026-05-30", currency: "USD",
    status: "partial", paidAmount: 1500, shipping: 0, additionalFees: 0,
    template: "minimal", brandColor: "#10b981", tags: ["retainer"],
    createdAt: "2026-05-01",
  },
];

export function newDraft(brand: Brand): Invoice {
  return {
    id: uid(),
    number: `INV-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
    client: null,
    items: [{ id: uid(), name: "", quantity: 1, unitPrice: 0, discount: 0, tax: 0 }],
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    currency: "USD",
    status: "draft",
    paidAmount: 0,
    shipping: 0,
    additionalFees: 0,
    template: "modern",
    brandColor: brand.primary,
    tags: [],
    notes: "Thank you for your business!",
    terms: "Payment due within the agreed terms.",
    createdAt: new Date().toISOString(),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [brand, setBrandState] = useState<Brand>({
    companyName: "Lumen Studio",
    primary: "#7c3aed",
    font: "Inter",
  });
  const [draftInvoice, setDraftInvoiceState] = useState<Invoice>(() => newDraft({ companyName: "Lumen Studio", primary: "#7c3aed", font: "Inter" }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("invoiceapp");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.invoices) setInvoices(data.invoices);
        if (data.clients) setClients(data.clients);
        if (data.brand) setBrandState(data.brand);
        if (data.draftInvoice) setDraftInvoiceState(data.draftInvoice);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("invoiceapp", JSON.stringify({ invoices, clients, brand, draftInvoice }));
  }, [invoices, clients, brand, draftInvoice, hydrated]);

  const value: AppState = {
    invoices, clients, brand, draftInvoice,
    setDraftInvoice: setDraftInvoiceState,
    saveInvoice: (i) => setInvoices((arr) => {
      const idx = arr.findIndex((x) => x.id === i.id);
      if (idx >= 0) { const next = [...arr]; next[idx] = i; return next; }
      return [i, ...arr];
    }),
    deleteInvoice: (id) => setInvoices((arr) => arr.filter((x) => x.id !== id)),
    addClient: (c) => setClients((arr) => [c, ...arr]),
    updateClient: (c) => setClients((arr) => arr.map((x) => x.id === c.id ? c : x)),
    deleteClient: (id) => setClients((arr) => arr.filter((x) => x.id !== id)),
    setBrand: setBrandState,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}

// Calculations
export function calcItem(it: InvoiceItem) {
  const gross = it.quantity * it.unitPrice;
  const discountAmt = gross * (it.discount / 100);
  const net = gross - discountAmt;
  const taxAmt = net * (it.tax / 100);
  return { gross, discountAmt, net, taxAmt, total: net + taxAmt };
}

export function calcInvoice(inv: Invoice) {
  let subtotal = 0, discount = 0, tax = 0;
  inv.items.forEach((it) => {
    const c = calcItem(it);
    subtotal += c.gross;
    discount += c.discountAmt;
    tax += c.taxAmt;
  });
  const grandTotal = subtotal - discount + tax + (inv.shipping || 0) + (inv.additionalFees || 0);
  const balance = grandTotal - (inv.paidAmount || 0);
  return { subtotal, discount, tax, grandTotal, balance };
}

export const CURRENCIES: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  INR: { symbol: "₹", locale: "en-IN" },
  JPY: { symbol: "¥", locale: "ja-JP" },
  AUD: { symbol: "A$", locale: "en-AU" },
  CAD: { symbol: "C$", locale: "en-CA" },
};

export function fmt(amount: number, currency = "USD") {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;
  try {
    return new Intl.NumberFormat(c.locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${c.symbol}${amount.toFixed(2)}`;
  }
}
