import { Building2 } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center gap-2.5 px-4 h-14 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
        <Building2 className="h-4.5 w-4.5" />
      </div>
      <p className="font-bold text-sm">TJ Home</p>
    </header>
  );
}
