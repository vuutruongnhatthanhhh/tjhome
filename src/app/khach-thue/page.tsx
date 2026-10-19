import { PageHeader } from "@/components/ui-extra/page-header";
import { TenantsList } from "@/components/tenants/tenants-list";
import { tenants, getRoom, getInvoicesByTenant } from "@/lib/mock-data";

export default function TenantsPage() {
  const entries = tenants.map((tenant) => {
    const room = getRoom(tenant.roomId)!;
    const invoices = getInvoicesByTenant(tenant.id);
    const outstanding = invoices.reduce((s, i) => s + Math.max(0, i.remaining), 0);
    const overdue = invoices.some((i) => i.status === "overdue");
    return { tenant, room, outstanding, overdue };
  });

  return (
    <div>
      <PageHeader title="Khách thuê" description={`${tenants.length} khách đang thuê phòng`} />
      <TenantsList entries={entries} />
    </div>
  );
}
