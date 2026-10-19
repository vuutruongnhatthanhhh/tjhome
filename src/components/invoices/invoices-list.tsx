"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";
import type { InvoiceComputed, InvoiceStatus, Room, Tenant } from "@/lib/types";

type InvoiceEntry = { invoice: InvoiceComputed; room: Room; tenant: Tenant };

const FILTERS: { key: InvoiceStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "overdue", label: "Quá hạn" },
  { key: "partial", label: "Một phần" },
  { key: "unpaid", label: "Chưa thu" },
  { key: "paid", label: "Đã thu đủ" },
];

export function InvoicesList({ entries }: { entries: InvoiceEntry[] }) {
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return entries.filter(({ invoice, room, tenant }) => {
      if (filter !== "all" && invoice.status !== filter) return false;
      const q = query.trim().toLowerCase();
      if (q && !room.code.toLowerCase().includes(q) && !tenant.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [entries, filter, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã phòng hoặc tên khách..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Không có hóa đơn phù hợp</p>
      ) : (
        <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {filtered.map(({ invoice, room, tenant }) => {
            const pct = Math.min(100, Math.round((invoice.paid / invoice.total) * 100));
            return (
              <li key={invoice.id}>
                <Link
                  href={`/hoa-don/${invoice.id}`}
                  className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{room.code}</p>
                      <span className="text-xs text-muted-foreground">· {tenant.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{formatPeriodLabel(invoice.period)}</p>
                    <div className="h-1.5 w-full max-w-48 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums mb-1">{formatCurrency(invoice.total)}</p>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
