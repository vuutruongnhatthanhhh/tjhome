import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Phone, IdCard, MapPin, Calendar, Wallet, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InvoiceHistoryList } from "@/components/invoices/invoice-history-list";
import { getInitials } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { getTenant, getRoom, getInvoicesByTenant } from "@/lib/mock-data";

export default async function TenantDetailPage({ params }: PageProps<"/khach-thue/[id]">) {
  const { id } = await params;
  const tenant = getTenant(id);
  if (!tenant) notFound();

  const room = getRoom(tenant.roomId)!;
  const invoices = getInvoicesByTenant(tenant.id);
  const outstanding = invoices.reduce((s, i) => s + Math.max(0, i.remaining), 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paid, 0);

  return (
    <div>
      <Link href="/khach-thue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Danh sách khách thuê
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <Avatar size="lg" className="h-16 w-16">
          <AvatarFallback className="bg-accent text-accent-foreground text-xl">
            {getInitials(tenant.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold truncate">{tenant.name}</h1>
          <Link href={`/phong/${room.id}`} className="text-sm text-primary font-medium hover:underline">
            {room.code} · Tầng {room.floor}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-sm font-semibold mb-3">Thông tin cá nhân</h2>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{tenant.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <IdCard className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{tenant.idNumber}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Quê {tenant.hometown}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Vào ở từ {formatDate(tenant.moveInDate)}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{tenant.occupants} người ở</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Đặt cọc {formatCurrency(tenant.deposit)}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 md:p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Còn phải thu</p>
            <p className={`text-2xl font-bold tabular-nums ${outstanding > 0 ? "text-status-critical" : "text-status-good"}`}>
              {formatCurrency(outstanding)}
            </p>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Đã thanh toán (tích lũy)</p>
            <p className="text-lg font-semibold tabular-nums">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-4">Lịch sử hóa đơn</h2>
        <InvoiceHistoryList invoices={invoices} />
      </div>
    </div>
  );
}
