import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  delta,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "good" | "warning" | "critical";
  delta?: number;
  hint?: string;
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-accent text-accent-foreground",
    good: "bg-status-good-bg text-status-good",
    warning: "bg-status-warning-bg text-status-warning",
    critical: "bg-status-critical-bg text-status-critical",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="text-2xl md:text-[26px] font-bold tabular-nums tracking-tight">{value}</p>
      {delta !== undefined ? (
        <div className="flex items-center gap-1 mt-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              delta >= 0 ? "text-status-good" : "text-status-critical",
            )}
          >
            {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(Math.round(delta * 100))}%
          </span>
          <span className="text-xs text-muted-foreground">so với tháng trước</span>
        </div>
      ) : hint ? (
        <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}
