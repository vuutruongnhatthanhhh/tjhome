import { Wallet, Landmark } from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { getRecentPayments } from "@/lib/stats";

export function RecentPaymentsList({
  payments,
}: {
  payments: ReturnType<typeof getRecentPayments>;
}) {
  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Chưa có giao dịch nào</p>;
  }

  return (
    <ul className="divide-y divide-border -mx-1">
      {payments.map(({ payment, tenant, room }) => (
        <li key={payment.id} className="flex items-center gap-3 px-1 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-status-good-bg text-status-good shrink-0">
            {payment.method === "transfer" ? (
              <Landmark className="h-4 w-4" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{tenant.name}</p>
            <p className="text-xs text-muted-foreground">
              {room.code} · {payment.method === "transfer" ? "Chuyển khoản" : "Tiền mặt"} ·{" "}
              {formatDateShort(payment.date)}
            </p>
          </div>
          <p className="text-sm font-bold tabular-nums text-status-good shrink-0">
            +{formatCurrency(payment.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
}
