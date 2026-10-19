import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { getTopDebtors } from "@/lib/stats";

const AVATAR_TINTS = [
  "bg-[#e8f0fb] text-[#184f95]",
  "bg-[#fdece5] text-[#9a3c1f]",
  "bg-[#e8f7e8] text-[#0a5c0a]",
  "bg-[#fdf1dc] text-[#8a5c00]",
  "bg-[#f1eefb] text-[#3a2d80]",
];

export function TopDebtorsList({ debtors }: { debtors: ReturnType<typeof getTopDebtors> }) {
  if (debtors.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Không có khách nợ tiền 🎉</p>;
  }

  return (
    <ul className="divide-y divide-border -mx-1">
      {debtors.map((d, i) => (
        <li key={d.tenant.id}>
          <Link
            href={`/khach-thue/${d.tenant.id}`}
            className="flex items-center gap-3 px-1 py-3 rounded-lg hover:bg-muted/60 transition-colors"
          >
            <Avatar>
              <AvatarFallback className={AVATAR_TINTS[i % AVATAR_TINTS.length]}>
                {getInitials(d.tenant.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{d.tenant.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.room.code} · {d.invoiceCount} hóa đơn chưa thu
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-sm font-bold tabular-nums"
                style={{ color: d.worstStatus === "overdue" ? "var(--status-critical)" : "var(--status-warning)" }}
              >
                {formatCurrency(d.amount)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
