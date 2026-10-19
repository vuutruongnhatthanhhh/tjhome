import { Suspense } from "react";
import { Sidebar } from "./sidebar";
import { SidebarFallback } from "./sidebar-fallback";
import { BottomNav } from "./bottom-nav";
import { BottomNavFallback } from "./bottom-nav-fallback";
import { MobileHeader } from "./mobile-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar />
      </Suspense>
      <MobileHeader />
      <main className="md:pl-64 pb-20 md:pb-10">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8">{children}</div>
      </main>
      <Suspense fallback={<BottomNavFallback />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
