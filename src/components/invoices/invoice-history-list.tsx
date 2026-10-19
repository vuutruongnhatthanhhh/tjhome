import Link from "next/link";
import { Wallet } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";
import type { InvoiceComputed } from "@/lib/types";

export function InvoiceHistoryList({ invoices }: { invoices: InvoiceComputed[] }) {
  if (invoices.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Chưa có hóa đơn nào</p>;
  }

  return (
    <ul className="divide-y divide-border -mx-1">
      {invoices.map((inv) => (
        <li key={inv.id}>
          <Link
            href={`/hoa-don/${inv.id}`}
            className="flex items-center gap-3 px-1 py-3 rounded-lg hover:bg-muted/60 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{formatPeriodLabel(inv.period)}</p>
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Wallet className="h-3 w-3" /> Đã thu {formatCurrency(inv.paid)} / {formatCurrency(inv.total)}
              </p>
            </div>
            <InvoiceStatusBadge status={inv.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
