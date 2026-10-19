import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Home, Zap, Droplets, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InvoicePaymentPanel } from "@/components/invoices/invoice-payment-panel";
import { getInitials } from "@/lib/utils";
import { formatCurrency, formatDate, formatPeriodLabel } from "@/lib/format";
import { getInvoice, getRoom, getTenant } from "@/lib/mock-data";

export default async function InvoiceDetailPage({ params }: PageProps<"/hoa-don/[id]">) {
  const { id } = await params;
  const invoice = getInvoice(id);
  if (!invoice) notFound();

  const room = getRoom(invoice.roomId)!;
  const tenant = getTenant(invoice.tenantId)!;

  const lineItems = [
    {
      key: "rent",
      icon: Home,
      label: "Tiền nhà",
      detail: "Giá thuê cố định",
      amount: invoice.rent,
    },
    {
      key: "electricity",
      icon: Zap,
      label: "Tiền điện",
      detail: `${invoice.electricity.oldIndex} → ${invoice.electricity.newIndex} kWh (${
        invoice.electricity.newIndex - invoice.electricity.oldIndex
      } kWh × ${formatCurrency(invoice.electricity.unitPrice)})`,
      amount: invoice.electricity.amount,
    },
    {
      key: "water",
      icon: Droplets,
      label: "Tiền nước",
      detail: `${invoice.water.usage} m³ × ${formatCurrency(invoice.water.unitPrice)}`,
      amount: invoice.water.amount,
    },
    {
      key: "trash",
      icon: Trash2,
      label: "Rác & dịch vụ chung",
      detail: `${tenant.occupants} người`,
      amount: invoice.trash,
    },
  ];

  return (
    <div>
      <Link href="/hoa-don" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Danh sách hóa đơn
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{formatPeriodLabel(invoice.period)}</h1>
          <p className="text-sm text-muted-foreground">
            Ngày lập {formatDate(invoice.issueDate)} · Hạn thu {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 mb-5">
        <Avatar size="lg">
          <AvatarFallback className="bg-accent text-accent-foreground">
            {getInitials(tenant.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Link href={`/khach-thue/${tenant.id}`} className="text-sm font-semibold hover:underline">
            {tenant.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            <Link href={`/phong/${room.id}`} className="hover:underline">
              {room.code}
            </Link>{" "}
            · Tầng {room.floor}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 md:p-5 h-fit">
          <h2 className="text-sm font-semibold mb-4">Chi tiết hóa đơn</h2>
          <ul className="space-y-3.5">
            {lineItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(item.amount)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-sm font-semibold">Tổng cộng</p>
            <p className="text-lg font-bold tabular-nums text-primary">{formatCurrency(invoice.total)}</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <InvoicePaymentPanel invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
