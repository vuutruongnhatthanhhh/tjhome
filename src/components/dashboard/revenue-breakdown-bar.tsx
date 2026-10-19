import { formatCurrency } from "@/lib/format";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export function RevenueBreakdownBar({
  data,
}: {
  data: { key: string; name: string; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full gap-0.5 bg-muted">
        {data.map((d, i) => {
          const pct = (d.value / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={d.key}
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
              title={`${d.name}: ${formatCurrency(d.value)}`}
            />
          );
        })}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {data.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <li key={d.key} className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {d.name} · {pct}%
                </p>
                <p className="text-sm font-semibold tabular-nums truncate">
                  {formatCurrency(d.value)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
