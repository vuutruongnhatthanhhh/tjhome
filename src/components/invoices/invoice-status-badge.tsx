import { CheckCircle2, Clock, AlertTriangle, CircleDashed } from "lucide-react";
import type { InvoiceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  InvoiceStatus,
  { label: string; icon: typeof CheckCircle2; color: string; bg: string }
> = {
  paid: {
    label: "Đã thanh toán",
    icon: CheckCircle2,
    color: "var(--status-good)",
    bg: "var(--status-good-bg)",
  },
  partial: {
    label: "Đóng một phần",
    icon: Clock,
    color: "var(--status-warning)",
    bg: "var(--status-warning-bg)",
  },
  overdue: {
    label: "Quá hạn",
    icon: AlertTriangle,
    color: "var(--status-critical)",
    bg: "var(--status-critical-bg)",
  },
  unpaid: {
    label: "Chưa thanh toán",
    icon: CircleDashed,
    color: "var(--status-serious)",
    bg: "var(--status-serious-bg)",
  },
};

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
  className?: string;
}) {
  const { label, icon: Icon, color, bg } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        className,
      )}
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
