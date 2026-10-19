"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ChevronLeft, ChevronRight, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { QA_ITEMS, resolveAnswer } from "./qa-data";
import { TypingDots } from "./typing-dots";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  status?: "thinking" | "typing" | "done";
};

let msgSeq = 0;
const nextId = () => `msg-${msgSeq++}`;

const GREETING =
  "Xin chào! Em là trợ lý ảo của TJ Home 👋 Thay vì phải xem từng tab, anh hỏi nhanh em về phòng, khách thuê, công nợ hay doanh thu cũng được. Anh bấm câu hỏi gợi ý bên dưới hoặc tự nhập câu hỏi nhé.";

// Tách riêng các hàm dùng Math.random() ra ngoài component: React Compiler
// coi mọi lệnh gọi hàm bất định (impure) nằm trong thân component là lỗi,
// kể cả khi lồng trong closure chỉ chạy lúc sự kiện (không phải lúc render).
function randomThinkDelay(): number {
  return 500 + Math.random() * 700;
}
function randomStepSize(): number {
  return Math.random() < 0.3 ? 2 : 1;
}
function randomCharDelay(): number {
  return 14 + Math.random() * 18;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function updateSuggestionsScrollState() {
    const el = suggestionsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    if (open) updateSuggestionsScrollState();
  }, [open]);

  function scrollSuggestions(direction: 1 | -1) {
    suggestionsRef.current?.scrollBy({ left: direction * 160, behavior: "smooth" });
  }

  function streamText(id: string, text: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "typing" } : m)));
    let i = 0;
    const step = () => {
      i = Math.min(i + randomStepSize(), text.length);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: text.slice(0, i) } : m)));
      if (i < text.length) {
        timersRef.current.push(setTimeout(step, randomCharDelay()));
      } else {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "done" } : m)));
        setBusy(false);
      }
    };
    step();
  }

  function thinkThenAnswer(botId: string, answer: string) {
    timersRef.current.push(setTimeout(() => streamText(botId, answer), randomThinkDelay()));
  }

  function openWidget() {
    setOpen(true);
    if (!greeted) {
      setGreeted(true);
      setBusy(true);
      const botId = nextId();
      setMessages([{ id: botId, role: "bot", content: "", status: "thinking" }]);
      thinkThenAnswer(botId, GREETING);
    }
  }

  function ask(question: string) {
    const trimmed = question.trim();
    if (busy || !trimmed) return;
    setBusy(true);
    const botId = nextId();
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: trimmed },
      { id: botId, role: "bot", content: "", status: "thinking" },
    ]);
    setInput("");
    thinkThenAnswer(botId, resolveAnswer(trimmed));
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(72vh,560px)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2.5 bg-primary px-4 py-3 text-primary-foreground shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Trợ lý TJ Home</p>
              <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-status-good" /> Luôn sẵn sàng
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
              aria-label="Đóng chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "bot" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground",
                  )}
                >
                  {m.status === "thinking" ? <TypingDots /> : m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="relative border-t border-border shrink-0">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollSuggestions(-1)}
                className="absolute left-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted"
                aria-label="Xem câu hỏi trước"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            )}
            <div
              ref={suggestionsRef}
              onScroll={updateSuggestionsScrollState}
              className="flex gap-1.5 overflow-x-auto scroll-smooth no-scrollbar px-3 py-2"
            >
              {QA_ITEMS.map((qa) => (
                <button
                  key={qa.id}
                  disabled={busy}
                  onClick={() => ask(qa.question)}
                  className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  {qa.question}
                </button>
              ))}
            </div>
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollSuggestions(1)}
                className="absolute right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted"
                aria-label="Xem câu hỏi tiếp theo"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border p-2.5 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
              placeholder="Nhập câu hỏi..."
              className="flex-1 rounded-full border border-input bg-transparent px-3.5 py-2 text-sm outline-none focus:border-ring disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Gửi câu hỏi"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => (open ? setOpen(false) : openWidget())}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
        aria-label={open ? "Đóng trợ lý chat" : "Mở trợ lý chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && !greeted && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-critical opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-status-critical text-white">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
