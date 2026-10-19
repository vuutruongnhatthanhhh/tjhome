import Link from "next/link";
import { Ruler, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoomStatusBadge } from "@/components/rooms/room-status-badge";
import { formatCurrency } from "@/lib/format";
import { getInitials } from "@/lib/utils";
import type { Room, Tenant } from "@/lib/types";

export function RoomCard({
  room,
  tenant,
  outstanding,
}: {
  room: Room;
  tenant?: Tenant;
  outstanding: number;
}) {
  return (
    <Link
      href={`/phong/${room.id}`}
      className="flex flex-col rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-base font-bold">{room.code}</p>
          <p className="text-xs text-muted-foreground">Tầng {room.floor}</p>
        </div>
        <RoomStatusBadge status={room.status} />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="inline-flex items-center gap-1">
          <Ruler className="h-3.5 w-3.5" /> {room.area}m²
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> tối đa {room.maxOccupants}
        </span>
      </div>

      <p className="text-lg font-bold text-primary tabular-nums mb-3">
        {formatCurrency(room.rentPrice)}
        <span className="text-xs font-normal text-muted-foreground">/tháng</span>
      </p>

      <div className="mt-auto pt-3 border-t border-border">
        {tenant ? (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback className="bg-accent text-accent-foreground">
                {getInitials(tenant.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{tenant.name}</p>
              {outstanding > 0 ? (
                <p className="text-xs font-semibold text-status-critical">
                  Nợ {formatCurrency(outstanding)}
                </p>
              ) : (
                <p className="text-xs text-status-good">Đã thanh toán đủ</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {room.status === "maintenance" ? "Đang bảo trì, tạm chưa cho thuê" : "Sẵn sàng cho thuê"}
          </p>
        )}
      </div>
    </Link>
  );
}
