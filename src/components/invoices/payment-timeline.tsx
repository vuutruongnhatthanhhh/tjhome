import { Landmark, Wallet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Payment } from "@/lib/types";

export function PaymentTimeline({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6 rounded-xl bg-muted/50">
        Chưa có khoản thanh toán nào được ghi nhận
      </p>
    );
  }

  const sorted = [...payments].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ul className="relative">
      {sorted.map((payment, idx) => (
        <li key={payment.id} className="relative flex gap-3 pb-5 last:pb-0">
          {idx !== sorted.length - 1 && (
            <span className="absolute left-[15px] top-8 bottom-0 w-px bg-border" aria-hidden />
          )}
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-good-bg text-status-good">
            {payment.method === "transfer" ? (
              <Landmark className="h-4 w-4" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
          </span>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {payment.method === "transfer" ? "Chuyển khoản" : "Tiền mặt"}
              </p>
              <p className="text-sm font-bold tabular-nums text-status-good">
                +{formatCurrency(payment.amount)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(payment.date)}
              {payment.note ? ` · ${payment.note}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
