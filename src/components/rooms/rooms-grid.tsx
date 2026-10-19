"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RoomCard } from "@/components/rooms/room-card";
import type { Room, RoomStatus, Tenant } from "@/lib/types";

type RoomEntry = { room: Room; tenant?: Tenant; outstanding: number };

const FILTERS: { key: RoomStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "occupied", label: "Đang thuê" },
  { key: "empty", label: "Phòng trống" },
  { key: "maintenance", label: "Sửa chữa" },
];

export function RoomsGrid({ entries }: { entries: RoomEntry[] }) {
  const [filter, setFilter] = useState<RoomStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return entries.filter(({ room, tenant }) => {
      if (filter !== "all" && room.status !== filter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchesRoom = room.code.toLowerCase().includes(q);
        const matchesTenant = tenant?.name.toLowerCase().includes(q);
        if (!matchesRoom && !matchesTenant) return false;
      }
      return true;
    });
  }, [entries, filter, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã phòng hoặc tên khách..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Không tìm thấy phòng phù hợp
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ room, tenant, outstanding }) => (
            <RoomCard key={room.id} room={room} tenant={tenant} outstanding={outstanding} />
          ))}
        </div>
      )}
    </div>
  );
}
