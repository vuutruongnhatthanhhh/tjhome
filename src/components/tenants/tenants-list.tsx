"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Phone, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Room, Tenant } from "@/lib/types";

type TenantEntry = { tenant: Tenant; room: Room; outstanding: number; overdue: boolean };

export function TenantsList({ entries }: { entries: TenantEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      ({ tenant, room }) =>
        tenant.name.toLowerCase().includes(q) ||
        room.code.toLowerCase().includes(q) ||
        tenant.phone.includes(q),
    );
  }, [entries, query]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, số phòng hoặc số điện thoại..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Không tìm thấy khách thuê</p>
      ) : (
        <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {filtered.map(({ tenant, room, outstanding, overdue }) => (
            <li key={tenant.id}>
              <Link
                href={`/khach-thue/${tenant.id}`}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors"
              >
                <Avatar>
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {getInitials(tenant.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{tenant.name}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    {room.code}
                    <span className="hidden sm:inline-flex items-center gap-1">
                      · <Phone className="h-3 w-3" /> {tenant.phone}
                    </span>
                    <span className="hidden md:inline">· Vào ở {formatDate(tenant.moveInDate)}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {outstanding > 0 ? (
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        overdue ? "text-status-critical" : "text-status-warning"
                      }`}
                    >
                      Nợ {formatCurrency(outstanding)}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-status-good">Đã đóng đủ</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
