import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Phone, Calendar, Zap, Droplets, Trash2 } from "lucide-react";
import { RoomStatusBadge } from "@/components/rooms/room-status-badge";
import { InvoiceHistoryList } from "@/components/invoices/invoice-history-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { getRoom, getTenantByRoom, getInvoicesByRoom } from "@/lib/mock-data";

export default async function RoomDetailPage({ params }: PageProps<"/phong/[id]">) {
  const { id } = await params;
  const room = getRoom(id);
  if (!room) notFound();

  const tenant = getTenantByRoom(room.id);
  const invoices = getInvoicesByRoom(room.id);
  const totalOutstanding = invoices.reduce((s, i) => s + Math.max(0, i.remaining), 0);

  return (
    <div>
      <Link href="/phong" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Danh sách phòng
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold">{room.code}</h1>
            <RoomStatusBadge status={room.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Tầng {room.floor} · {room.area}m² · tối đa {room.maxOccupants} người
          </p>
        </div>
        <p className="text-right text-xl font-bold text-primary tabular-nums">
          {formatCurrency(room.rentPrice)}
          <span className="block text-xs font-normal text-muted-foreground text-right">/ tháng</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-sm font-semibold mb-3">Đơn giá dịch vụ</h2>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" /> Điện
              </span>
              <span className="font-medium tabular-nums">{formatCurrency(room.electricPrice)}/kWh</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-4 w-4" /> Nước
              </span>
              <span className="font-medium tabular-nums">{formatCurrency(room.waterPrice)}/m³</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Trash2 className="h-4 w-4" /> Rác & dịch vụ
              </span>
              <span className="font-medium tabular-nums">{formatCurrency(room.trashFee)}/người</span>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-1.5">
            {room.amenities.map((a) => (
              <span key={a} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-sm font-semibold mb-3">Khách thuê</h2>
          {tenant ? (
            <Link
              href={`/khach-thue/${tenant.id}`}
              className="flex items-center gap-3 rounded-xl hover:bg-muted/60 p-2 -m-2 transition-colors"
            >
              <Avatar size="lg">
                <AvatarFallback className="bg-accent text-accent-foreground text-base">
                  {getInitials(tenant.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {tenant.phone}
                  <span className="mx-1">·</span>
                  <Calendar className="h-3 w-3" /> Ở từ {formatDate(tenant.moveInDate)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Còn phải thu</p>
                <p
                  className={`text-base font-bold tabular-nums ${
                    totalOutstanding > 0 ? "text-status-critical" : "text-status-good"
                  }`}
                >
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                {room.status === "maintenance" ? "Phòng đang bảo trì" : "Phòng đang trống, sẵn sàng cho thuê"}
              </p>
              <button className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5">
                Thêm khách thuê
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-4">Lịch sử hóa đơn</h2>
        <InvoiceHistoryList invoices={invoices} />
      </div>
    </div>
  );
}
