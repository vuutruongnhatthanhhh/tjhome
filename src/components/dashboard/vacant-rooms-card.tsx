import Link from "next/link";
import { DoorOpen } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Room } from "@/lib/types";

export function VacantRoomsCard({ rooms }: { rooms: Room[] }) {
  if (rooms.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Đã lấp đầy toàn bộ phòng 🎉</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link
            href={`/phong/${room.id}`}
            className="flex items-center gap-2.5 rounded-xl border border-dashed border-status-good/40 bg-status-good-bg/60 px-3 py-2.5 hover:border-status-good transition-colors"
          >
            <DoorOpen className="h-4 w-4 text-status-good shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{room.code}</p>
              <p className="text-xs text-muted-foreground truncate">{formatCurrency(room.rentPrice)}/th</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
