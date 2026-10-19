import { PageHeader } from "@/components/ui-extra/page-header";
import { RoomsGrid } from "@/components/rooms/rooms-grid";
import { rooms, getTenantByRoom, getInvoicesByTenant } from "@/lib/mock-data";

export default function RoomsPage() {
  const entries = rooms.map((room) => {
    const tenant = getTenantByRoom(room.id);
    const outstanding = tenant
      ? getInvoicesByTenant(tenant.id).reduce((s, i) => s + Math.max(0, i.remaining), 0)
      : 0;
    return { room, tenant, outstanding };
  });

  return (
    <div>
      <PageHeader
        title="Phòng"
        description={`${rooms.length} phòng · quản lý trạng thái, giá thuê và khách đang ở`}
      />
      <RoomsGrid entries={entries} />
    </div>
  );
}
