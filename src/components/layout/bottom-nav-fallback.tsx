import Link from "next/link";
import { NAV_ITEMS } from "./nav-items";

export function BottomNavFallback() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium">
                <span className="flex items-center justify-center h-8 w-11 rounded-full text-muted-foreground">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="text-muted-foreground">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
