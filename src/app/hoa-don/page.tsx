import { PageHeader } from "@/components/ui-extra/page-header";
import { InvoicesList } from "@/components/invoices/invoices-list";
import { invoicesComputed, getRoom, getTenant } from "@/lib/mock-data";

const STATUS_PRIORITY = { overdue: 0, partial: 1, unpaid: 2, paid: 3 };

export default function InvoicesPage() {
  const entries = invoicesComputed
    .map((invoice) => ({
      invoice,
      room: getRoom(invoice.roomId)!,
      tenant: getTenant(invoice.tenantId)!,
    }))
    .sort((a, b) => {
      const prio = STATUS_PRIORITY[a.invoice.status] - STATUS_PRIORITY[b.invoice.status];
      if (prio !== 0) return prio;
      return a.invoice.period < b.invoice.period ? 1 : -1;
    });

  return (
    <div>
      <PageHeader title="Hóa đơn" description={`${entries.length} hóa đơn · tiền nhà, điện, nước, rác`} />
      <InvoicesList entries={entries} />
    </div>
  );
}
