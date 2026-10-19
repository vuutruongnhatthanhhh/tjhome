"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

export function AddPaymentDialog({
  open,
  onOpenChange,
  remaining,
  today,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remaining: number;
  today: string;
  onSubmit: (data: { amount: number; method: PaymentMethod; date: string; note?: string }) => void;
}) {
  const [amount, setAmount] = useState(String(remaining));
  const [method, setMethod] = useState<PaymentMethod>("transfer");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");

  const parsedAmount = Number(amount.replace(/\D/g, ""));
  const isValid = parsedAmount > 0;

  function handleOpenChange(next: boolean) {
    if (next) {
      setAmount(String(remaining));
      setMethod("transfer");
      setDate(today);
      setNote("");
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ amount: parsedAmount, method, date, note: note.trim() || undefined });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ghi nhận thanh toán</DialogTitle>
          <DialogDescription>
            Còn thiếu {formatCurrency(remaining)}. Khách có thể đóng từng đợt, nhập đúng số tiền đã nhận.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Số tiền nhận được</Label>
            <Input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
            {!isValid && (
              <p className="text-xs text-destructive">Vui lòng nhập số tiền hợp lệ</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="method">Phương thức</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <SelectTrigger id="method" className="w-full">
                  <SelectValue>
                    {method === "transfer" ? "Chuyển khoản" : "Tiền mặt"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Ngày thu</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: đóng đợt 1, còn lại cuối tháng"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Ghi nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
