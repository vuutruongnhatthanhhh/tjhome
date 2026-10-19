import { DoorOpen, Wrench, UserCheck } from "lucide-react";
import type { RoomStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<RoomStatus, { label: string; icon: typeof DoorOpen; color: string; bg: string }> = {
  occupied: {
    label: "Đang thuê",
    icon: UserCheck,
    color: "var(--primary)",
    bg: "var(--accent)",
  },
  empty: {
    label: "Phòng trống",
    icon: DoorOpen,
    color: "var(--status-good)",
    bg: "var(--status-good-bg)",
  },
  maintenance: {
    label: "Đang sửa chữa",
    icon: Wrench,
    color: "var(--status-warning)",
    bg: "var(--status-warning-bg)",
  },
};

export function RoomStatusBadge({ status, className }: { status: RoomStatus; className?: string }) {
  const { label, icon: Icon, color, bg } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        className,
      )}
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
