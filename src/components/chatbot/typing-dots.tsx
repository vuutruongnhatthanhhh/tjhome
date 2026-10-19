export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1" aria-label="Đang trả lời...">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
    </span>
  );
}
