import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, DoorOpen, Users, Receipt } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/phong", label: "Phòng", icon: DoorOpen },
  { href: "/khach-thue", label: "Khách thuê", icon: Users },
  { href: "/hoa-don", label: "Hóa đơn", icon: Receipt },
];
