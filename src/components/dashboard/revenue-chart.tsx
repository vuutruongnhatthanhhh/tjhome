"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";

type MonthDatum = { period: string; label: string; revenue: number; billed: number };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: MonthDatum }[];
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground mb-0.5">{formatPeriodLabel(datum.period)}</p>
      <p className="text-sm font-bold tabular-nums">{formatCurrency(datum.revenue)}</p>
    </div>
  );
}

export function RevenueChart({ data }: { data: MonthDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 24, right: 4, left: 4, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 4, 4]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
