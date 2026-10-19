import { invoicesComputed, rooms, tenants, getRoom, getTenant, TODAY } from "./mock-data";

export function getOccupancy() {
  const total = rooms.length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const empty = rooms.filter((r) => r.status === "empty").length;
  const maintenance = rooms.filter((r) => r.status === "maintenance").length;
  return {
    total,
    occupied,
    empty,
    maintenance,
    rate: total > 0 ? occupied / total : 0,
  };
}

export function getOutstandingSummary() {
  const unpaidLike = invoicesComputed.filter((i) => i.remaining > 0);
  const totalOutstanding = unpaidLike.reduce((sum, i) => sum + i.remaining, 0);
  const overdue = unpaidLike.filter((i) => i.status === "overdue");
  const overdueAmount = overdue.reduce((sum, i) => sum + i.remaining, 0);
  return {
    totalOutstanding,
    overdueAmount,
    overdueCount: overdue.length,
    unpaidInvoiceCount: unpaidLike.length,
  };
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function getMonthlyRevenue(monthsBack = 8) {
  const today = new Date(TODAY + "T00:00:00");
  const months: { period: string; label: string; revenue: number; billed: number }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ period, label: `Th${d.getMonth() + 1}`, revenue: 0, billed: 0 });
  }
  const index = new Map(months.map((m, i) => [m.period, i]));

  for (const invoice of invoicesComputed) {
    const billedIdx = index.get(invoice.period);
    if (billedIdx !== undefined) {
      months[billedIdx].billed += invoice.total;
    }
    for (const payment of invoice.payments) {
      const idx = index.get(monthKey(payment.date));
      if (idx !== undefined) {
        months[idx].revenue += payment.amount;
      }
    }
  }
  return months;
}

export function getRevenueBreakdown(period: string) {
  const invoicesForPeriod = invoicesComputed.filter((i) => i.period === period);
  const rent = invoicesForPeriod.reduce((s, i) => s + i.rent, 0);
  const electricity = invoicesForPeriod.reduce((s, i) => s + i.electricity.amount, 0);
  const water = invoicesForPeriod.reduce((s, i) => s + i.water.amount, 0);
  const trash = invoicesForPeriod.reduce((s, i) => s + i.trash, 0);
  return [
    { key: "rent", name: "Tiền nhà", value: rent },
    { key: "electricity", name: "Điện", value: electricity },
    { key: "water", name: "Nước", value: water },
    { key: "trash", name: "Rác & DV", value: trash },
  ];
}

export function getTopDebtors(limit = 6) {
  const byTenant = new Map<string, number>();
  for (const invoice of invoicesComputed) {
    if (invoice.remaining <= 0) continue;
    byTenant.set(invoice.tenantId, (byTenant.get(invoice.tenantId) ?? 0) + invoice.remaining);
  }
  return [...byTenant.entries()]
    .map(([tenantId, amount]) => {
      const tenant = getTenant(tenantId)!;
      const room = getRoom(tenant.roomId)!;
      const overdueInvoices = invoicesComputed.filter(
        (i) => i.tenantId === tenantId && i.remaining > 0,
      );
      return {
        tenant,
        room,
        amount,
        invoiceCount: overdueInvoices.length,
        worstStatus: overdueInvoices.some((i) => i.status === "overdue") ? "overdue" : "partial",
      } as const;
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function getRecentPayments(limit = 8) {
  const all = invoicesComputed.flatMap((invoice) =>
    invoice.payments.map((payment) => ({
      payment,
      invoice,
      tenant: getTenant(invoice.tenantId)!,
      room: getRoom(invoice.roomId)!,
    })),
  );
  return all.sort((a, b) => (a.payment.date < b.payment.date ? 1 : -1)).slice(0, limit);
}

export function getVacantRooms() {
  return rooms.filter((r) => r.status === "empty");
}

export function getDashboardHeadline() {
  const months = getMonthlyRevenue(2);
  const thisMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];
  const delta = lastMonth.revenue > 0 ? (thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue : 0;
  return { thisMonth, lastMonth, delta };
}

export const totalTenants = tenants.length;
