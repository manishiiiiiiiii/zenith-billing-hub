import { calcInvoice, calcItem, fmt, type Invoice } from "@/lib/store";

interface Props {
  invoice: Invoice;
  companyName?: string;
  logoUrl?: string;
  template?: string;
  zoom?: number;
}

export function InvoicePreview({ invoice, companyName = "Lumen Studio", logoUrl, template, zoom = 1 }: Props) {
  const tpl = template ?? invoice.template;
  const c = calcInvoice(invoice);
  const accent = invoice.brandColor || "#7c3aed";

  const isMinimal = tpl === "minimal";
  const isCorporate = tpl === "corporate";
  const isCreative = tpl === "creative";
  const isLuxury = tpl === "luxury";
  const isClassic = tpl === "classic";

  return (
    <div
      className="origin-top transition-transform"
      style={{ transform: `scale(${zoom})`, width: "210mm", maxWidth: "100%" }}
    >
      <div
        className="invoice-page bg-white text-zinc-900 shadow-elegant"
        style={{
          minHeight: "297mm",
          padding: "48px",
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Inter", sans-serif',
          borderRadius: 16,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ borderBottom: isClassic ? `2px solid ${accent}` : "none", paddingBottom: 24 }}>
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt="" className="mb-3 h-12 object-contain" />
            ) : (
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{ background: isCreative ? `linear-gradient(135deg, ${accent}, #ec4899)` : accent }}
              >
                {companyName.charAt(0)}
              </div>
            )}
            <div className="text-lg font-semibold tracking-tight">{companyName}</div>
            <div className="text-xs text-zinc-500">hello@lumenstudio.co · lumenstudio.co</div>
          </div>
          <div className="text-right">
            <div
              className={isMinimal ? "text-3xl font-light tracking-[0.3em] text-zinc-700" : "text-3xl font-bold tracking-tight"}
              style={!isMinimal ? { color: accent } : undefined}
            >
              INVOICE
            </div>
            <div className="mt-1 text-sm font-mono text-zinc-600">{invoice.number}</div>
          </div>
        </div>

        {/* Meta + Bill to */}
        <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Bill to</div>
            <div className="mt-1.5 font-semibold">{invoice.client?.name || "Client name"}</div>
            {invoice.client?.company && <div className="text-zinc-600">{invoice.client.company}</div>}
            {invoice.client?.billingAddress && <div className="mt-1 whitespace-pre-line text-zinc-500">{invoice.client.billingAddress}</div>}
            {invoice.client?.email && <div className="text-zinc-500">{invoice.client.email}</div>}
            {invoice.client?.taxId && <div className="text-zinc-500">Tax ID: {invoice.client.taxId}</div>}
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-zinc-400">Issue date</div><div className="font-medium">{invoice.issueDate}</div>
              <div className="text-zinc-400">Due date</div><div className="font-medium">{invoice.dueDate}</div>
              <div className="text-zinc-400">Currency</div><div className="font-medium">{invoice.currency}</div>
              <div className="text-zinc-400">Status</div>
              <div>
                <span
                  className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: `${accent}20`, color: accent }}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-8 overflow-hidden rounded-xl" style={{ border: isMinimal ? "none" : "1px solid #f1f1f4" }}>
          <table className="w-full text-sm">
            <thead style={{ background: isCorporate ? accent : isLuxury ? "#0a0a0a" : "#fafafa", color: isCorporate || isLuxury ? "white" : "#52525b" }}>
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider">Item</th>
                <th className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">Qty</th>
                <th className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">Price</th>
                <th className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">Disc</th>
                <th className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">Tax</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it) => {
                const ic = calcItem(it);
                return (
                  <tr key={it.id} className="border-t" style={{ borderColor: "#f1f1f4" }}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{it.name || "Untitled item"}</div>
                      {it.description && <div className="text-xs text-zinc-500">{it.description}</div>}
                      {it.sku && <div className="text-[10px] uppercase tracking-widest text-zinc-400">SKU · {it.sku}</div>}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums">{it.quantity}{it.unit ? ` ${it.unit}` : ""}</td>
                    <td className="px-2 py-3 text-right tabular-nums">{fmt(it.unitPrice, invoice.currency)}</td>
                    <td className="px-2 py-3 text-right tabular-nums text-zinc-500">{it.discount}%</td>
                    <td className="px-2 py-3 text-right tabular-nums text-zinc-500">{it.tax}%</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmt(ic.total, invoice.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <Row label="Subtotal" value={fmt(c.subtotal, invoice.currency)} />
            {c.discount > 0 && <Row label="Discount" value={`- ${fmt(c.discount, invoice.currency)}`} />}
            <Row label="Tax" value={fmt(c.tax, invoice.currency)} />
            {invoice.shipping > 0 && <Row label="Shipping" value={fmt(invoice.shipping, invoice.currency)} />}
            {invoice.additionalFees > 0 && <Row label="Fees" value={fmt(invoice.additionalFees, invoice.currency)} />}
            <div
              className="mt-2 flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white"
              style={{ background: isCreative ? `linear-gradient(135deg, ${accent}, #ec4899)` : accent }}
            >
              <span>Total due</span>
              <span className="tabular-nums">{fmt(c.balance, invoice.currency)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Paid</span><span>{fmt(invoice.paidAmount, invoice.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes / terms */}
        <div className="mt-10 grid grid-cols-2 gap-8 text-xs text-zinc-500">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Notes</div>
            <p className="mt-1.5 whitespace-pre-line">{invoice.notes}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Terms</div>
            <p className="mt-1.5 whitespace-pre-line">{invoice.terms}</p>
            {invoice.paymentMethod && <p className="mt-2">Payment via <b>{invoice.paymentMethod}</b></p>}
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between border-t pt-6 text-xs text-zinc-400" style={{ borderColor: "#f1f1f4" }}>
          <div>
            <div className="text-[10px] uppercase tracking-widest">Authorized signatory</div>
            <div className="mt-6 w-44 border-b border-zinc-300" />
          </div>
          <div className="text-right">
            Thank you for your business
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-zinc-600">
      <span>{label}</span>
      <span className="font-medium tabular-nums text-zinc-800">{value}</span>
    </div>
  );
}
