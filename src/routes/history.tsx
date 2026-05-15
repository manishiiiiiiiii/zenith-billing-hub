import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Pin, Trash2, Copy, Filter } from "lucide-react";
import { useStore, calcInvoice, fmt } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({ component: History });

function History() {
  const { invoices, deleteInvoice, saveInvoice } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const list = invoices.filter(i =>
    (status === "all" || i.status === status) &&
    (!q || i.number.toLowerCase().includes(q.toLowerCase()) || (i.client?.name ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Invoice history</h1>
          <p className="text-sm text-muted-foreground">All your invoices — search, filter and act.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoices" className="w-64 rounded-xl pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 rounded-xl"><Filter className="mr-1 h-3 w-3" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {["all", "paid", "unpaid", "partial", "overdue", "draft"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border-border/60 bg-card/80 backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12"></TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map(i => {
              const c = calcInvoice(i);
              return (
                <TableRow key={i.id} className="group">
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => saveInvoice({ ...i, pinned: !i.pinned })}>
                      <Pin className={`h-3.5 w-3.5 ${i.pinned ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{i.number}</TableCell>
                  <TableCell>{i.client?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{i.issueDate}</TableCell>
                  <TableCell className="text-muted-foreground">{i.dueDate}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{fmt(c.grandTotal, i.currency)}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 transition group-hover:opacity-100" onClick={() => { saveInvoice({ ...i, id: Math.random().toString(36).slice(2), number: i.number + "-COPY" }); toast.success("Invoice duplicated"); }}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive opacity-0 transition group-hover:opacity-100" onClick={() => { deleteInvoice(i.id); toast.success("Invoice deleted"); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {list.length === 0 && (
              <TableRow><TableCell colSpan={8} className="py-16 text-center text-muted-foreground">No invoices match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
