"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { AddPaymentDialog } from "@/components/invoices/add-payment-dialog";
import { PaymentTimeline } from "@/components/invoices/payment-timeline";
import { computeInvoice, TODAY } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import type { Invoice, Payment, PaymentMethod } from "@/lib/types";

let localId = 0;

export function InvoicePaymentPanel({ invoice }: { invoice: Invoice }) {
  const [payments, setPayments] = useState<Payment[]>(invoice.payments);
  const [dialogOpen, setDialogOpen] = useState(false);

  const computed = computeInvoice({ ...invoice, payments });
  const pct = Math.min(100, Math.round((computed.paid / computed.total) * 100));

  function handleAddPayment(data: { amount: number; method: PaymentMethod; date: string; note?: string }) {
    const amount = data.amount;
    const payment: Payment = {
      id: `local-${invoice.id}-${localId++}`,
      date: data.date,
      amount,
      method: data.method,
      note: data.note,
    };
    const next = [...payments, payment];
    setPayments(next);

    const nextRemaining = computed.total - (computed.paid + amount);
    if (nextRemaining <= 0) {
      toast.success("Đã thanh toán đủ hóa đơn!", {
        description: `Ghi nhận ${formatCurrency(amount)} · ${invoice.id}`,
      });
    } else {
      toast.success("Đã ghi nhận thanh toán", {
        description: `+${formatCurrency(amount)} · còn thiếu ${formatCurrency(nextRemaining)}`,
      });
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Tổng hóa đơn</p>
          <p className="text-2xl font-bold tabular-nums">{formatCurrency(computed.total)}</p>
        </div>
        <InvoiceStatusBadge status={computed.status} />
      </div>

      <div className="mb-4">
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-status-good transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Đã thu <span className="font-semibold text-foreground tabular-nums">{formatCurrency(computed.paid)}</span>
          </span>
          <span className="text-muted-foreground">
            Còn thiếu{" "}
            <span
              className={`font-semibold tabular-nums ${
                computed.remaining > 0 ? "text-status-critical" : "text-status-good"
              }`}
            >
              {formatCurrency(Math.max(0, computed.remaining))}
            </span>
          </span>
        </div>
      </div>

      {computed.remaining > 0 && (
        <Button className="w-full mb-5" onClick={() => setDialogOpen(true)}>
          <Plus /> Ghi nhận thanh toán
        </Button>
      )}

      <div className="pt-1">
        <h3 className="text-sm font-semibold mb-3">Lịch sử đóng tiền ({payments.length} đợt)</h3>
        <PaymentTimeline payments={payments} />
      </div>

      <AddPaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        remaining={Math.max(0, computed.remaining)}
        today={TODAY}
        onSubmit={handleAddPayment}
      />
    </div>
  );
}
