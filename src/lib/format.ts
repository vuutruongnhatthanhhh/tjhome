export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tr`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${Math.round(value / 1000).toLocaleString("vi-VN")} k`;
  }
  return value.toLocaleString("vi-VN");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-");
  return `Tháng ${Number(month)}/${year}`;
}

export function formatPeriodShort(period: string): string {
  const [, month] = period.split("-");
  return `Th${Number(month)}`;
}
