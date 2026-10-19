"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { getOccupancy } from "@/lib/stats";

export function Sidebar() {
  const pathname = usePathname();
  const occupancy = getOccupancy();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-sm text-sidebar-foreground">TJ Home</p>
          <p className="text-xs text-muted-foreground">Quản lý nhà trọ</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.3 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-sidebar-accent/60 p-4">
        <p className="text-xs text-muted-foreground mb-1.5">Tỷ lệ lấp đầy</p>
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-bold text-sidebar-foreground tabular-nums">
            {occupancy.occupied}/{occupancy.total}
          </span>
          <span className="text-sm font-semibold text-primary">
            {Math.round(occupancy.rate * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.round(occupancy.rate * 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
