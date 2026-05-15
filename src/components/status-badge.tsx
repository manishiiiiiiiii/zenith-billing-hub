export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-success/15 text-success border-success/30",
    unpaid: "bg-primary/10 text-primary border-primary/30",
    overdue: "bg-destructive/10 text-destructive border-destructive/30",
    partial: "bg-warning/15 text-warning-foreground border-warning/40",
    draft: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
