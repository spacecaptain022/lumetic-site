"use client";

import { AnimatePresence, m as motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/BlockLink";
import PixelGlyph from "@/components/ui/PixelGlyph";
import { BRIEF_FIELDS, EMPTY_BRIEF, type DockBrief, type DockMessage } from "@/lib/dock-shared";
import { MOTION_EASE_SWIFT } from "@/lib/motion";
import { useActiveSection } from "@/lib/useActiveSection";

type View = "menu" | "chat" | "sent";
type Saved = { view: View; messages: DockMessage[]; brief: DockBrief; ready: boolean; sentTo?: string };

const STORAGE_KEY = "lumetic:dock";
const HIDDEN_ON = ["/intake", "/resolve"];
const HOME_SECTIONS = ["services", "work", "system", "approach", "faq"] as const;
const NO_SECTIONS: readonly string[] = [];

const STARTERS = [
  "Launching soon, need a brand and a site",
  "Launching or redoing an online store",
  "Rebranding an existing company",
  "Ongoing design help for my team",
];

/** What the visitor was looking at when they opened the dock: a tailored first prompt and a hint for the assistant. */
const SECTION_CONTEXT: Record<string, { prompt: string; context: string }> = {
  services: { prompt: "I'm interested in one of your four practices", context: "the Services section (four practices)" },
  work: { prompt: "Something like your work, for my brand", context: "the Selected work section" },
  system: { prompt: "Something like your work, for my brand", context: "the From strategy to system section" },
  approach: { prompt: "Which engagement fits my project?", context: "the Engagements section" },
  faq: { prompt: "I have a question before we start", context: "the FAQ" },
};

const GREETING =
  "Hi, I'm the Lumetic Assistant. Tell me what you're working on and I'll shape it into a brief for the team.";

function loadSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(state: Saved) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or storage blocked: the dock still works, it just won't survive a reload.
  }
}

export default function ProjectDock() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome ? HOME_SECTIONS : NO_SECTIONS);

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [messages, setMessages] = useState<DockMessage[]>([]);
  const [brief, setBrief] = useState<DockBrief>(EMPTY_BRIEF);
  const [ready, setReady] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [showSend, setShowSend] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [pageTitle, setPageTitle] = useState("");

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore a conversation from earlier in this visit.
  useEffect(() => {
    const saved = loadSaved();
    if (!saved) return;
     
    setView(saved.view);
    setMessages(saved.messages);
    setBrief(saved.brief);
    setReady(saved.ready);
    setSentTo(saved.sentTo ?? "");
     
  }, []);

  useEffect(() => {
    save({ view, messages, brief, ready, sentTo });
  }, [view, messages, brief, ready, sentTo]);

  // On case pages the project title becomes the context.
  useEffect(() => {
     
    setPageTitle(pathname.startsWith("/work/") ? document.querySelector("h1")?.textContent?.trim() ?? "" : "");
  }, [pathname]);

  // Appear after the hero, step aside while the contact form is on screen.
  useEffect(() => {
    let contactInView = false;
    const update = () => {
      const threshold = isHome ? window.innerHeight * 0.6 : 120;
      setVisible(window.scrollY > threshold && !contactInView);
    };
    const contact = document.getElementById("contact");
    const io = contact
      ? new IntersectionObserver(([entry]) => {
          contactInView = entry.isIntersecting;
          update();
        }, { threshold: 0.15 })
      : null;
    if (contact) io?.observe(contact);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, [isHome, pathname]);

  const close = useCallback(() => {
    setOpen(false);
    // The launcher re-mounts as the panel leaves; hand focus back once it exists.
    requestAnimationFrame(() => requestAnimationFrame(() => launcherRef.current?.focus()));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, showSend, open]);

  useEffect(() => {
    if (open && view === "chat" && !showSend) inputRef.current?.focus();
  }, [open, view, showSend]);

  const context = pageTitle
    ? { prompt: `Something like ${pageTitle}, for my brand`, context: `the case page for ${pageTitle}` }
    : isHome
      ? SECTION_CONTEXT[activeSection]
      : pathname === "/work"
        ? { prompt: "Something like your work, for my brand", context: "the Work page" }
        : undefined;

  async function send(text: string) {
    const content = text.trim();
    if (!content || thinking) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setDraft("");
    setError("");
    setView("chat");
    setThinking(true);
    try {
      const res = await fetch("/api/dock/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context: context?.context ?? "" }),
      });
      const data = (await res.json()) as { reply?: string; brief?: DockBrief; ready?: boolean; error?: string };
      if (!res.ok || !data.reply) throw new Error(data.error ?? "Something went wrong.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
      if (data.brief) setBrief(data.brief);
      if (data.ready) {
        setReady(true);
        setShowSend(true);
      }
    } catch (err) {
      // Give the turn back so they can retry without retyping.
      setMessages(messages);
      setDraft(content);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setThinking(false);
    }
  }

  async function sendBrief(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/dock/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, messages, brief }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSentTo(email.trim());
      setView("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  function startOver() {
    setView("menu");
    setMessages([]);
    setBrief(EMPTY_BRIEF);
    setReady(false);
    setShowSend(false);
    setSentTo("");
    setError("");
  }

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const filled = BRIEF_FIELDS.filter((f) => brief[f.key]).length;
  const userTurns = messages.filter((msg) => msg.role === "user").length;
  const fieldCls =
    "h-11 w-full rounded-[9px] bg-paper/10 px-3.5 text-[0.95rem] text-paper outline-none ring-1 ring-transparent transition placeholder:text-paper/40 focus:bg-paper/14 focus:ring-paper/40";

  return (
    <>
      <AnimatePresence>
        {(visible || open) && !open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: MOTION_EASE_SWIFT }}
            className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-3 rounded-[12px] bg-ink/85 py-1.5 pl-3.5 pr-1.5 text-[0.92rem] font-medium text-paper shadow-[0_10px_40px_rgb(0_0_0/0.2)] backdrop-blur-xl transition-colors hover:bg-ink md:bottom-6 md:right-6"
          >
            <PixelGlyph name="spark" className="h-3.5 w-3.5 text-mauve" />
            {view === "chat" && messages.length > 0 ? "Continue your brief" : "Start a project"}
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-paper text-ink transition-transform duration-300 group-hover:-translate-y-0.5">
              <Arrow />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="Start a project with Lumetic"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: MOTION_EASE_SWIFT }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-2 bottom-2 z-50 flex max-h-[min(42rem,calc(100svh-5.5rem))] flex-col overflow-hidden rounded-[18px] bg-ink text-paper shadow-[0_24px_80px_rgb(0_0_0/0.35)] md:inset-x-auto md:bottom-6 md:right-6 md:w-[25rem]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-4 py-3.5">
              <span className="label-mono flex items-center gap-2 text-paper/70">
                <PixelGlyph name="spark" className="h-3 w-3 text-mauve" />
                {"(  LUMETIC ASSISTANT  )"}
              </span>
              <div className="flex items-center gap-1">
                {view !== "menu" && (
                  <button type="button" onClick={startOver} className="label rounded-[7px] px-2 py-1.5 text-paper/55 hover:text-paper">
                    Start over
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-paper/70 hover:bg-paper/10 hover:text-paper"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {view === "chat" && (
              <details className="group border-b border-paper/10 px-4 py-3 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="label text-paper/70">Your brief</span>
                  <span className="flex items-center gap-2">
                    <span className="flex gap-1" aria-hidden>
                      {BRIEF_FIELDS.map((f) => (
                        <i key={f.key} className={`h-2 w-2 rounded-[2px] transition-colors duration-500 ${brief[f.key] ? "bg-mauve" : "bg-paper/15"}`} />
                      ))}
                    </span>
                    <span className="label text-paper/55">{filled} of {BRIEF_FIELDS.length}</span>
                  </span>
                </summary>
                <dl className="mt-3 grid gap-2">
                  {BRIEF_FIELDS.map((f) => (
                    <div key={f.key} className="grid grid-cols-[6.5rem_1fr] gap-3 text-[0.85rem] leading-snug">
                      <dt className="text-paper/45">{f.label}</dt>
                      <dd className={brief[f.key] ? "text-paper" : "text-paper/25"}>{brief[f.key] || "Listening..."}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {view === "menu" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-[1.45rem] font-semibold leading-tight tracking-[-0.025em]">What are you working on?</p>
                    <p className="mt-2 text-[0.92rem] leading-snug text-paper/60">
                      Chat for a minute and the assistant turns it into a brief. The studio replies within one business day.
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {[...(context ? [context.prompt] : []), ...STARTERS].map((prompt, i) => (
                      <li key={prompt}>
                        <button
                          type="button"
                          onClick={() => send(prompt)}
                          className="group flex w-full items-center justify-between gap-3 rounded-[11px] bg-paper/[0.07] px-3.5 py-3 text-left text-[0.95rem] transition-colors hover:bg-paper/[0.13]"
                        >
                          <span>
                            {i === 0 && context && <span className="label mb-1 block text-mauve">For this page</span>}
                            {prompt}
                          </span>
                          <Arrow dir="right" className="shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-paper/10 pt-4 text-[0.88rem] text-paper/60">
                    <a href={isHome ? "#contact" : "/#contact"} onClick={close} className="hover:text-paper">
                      Prefer a form? <span className="link-line">Contact form</span>
                    </a>
                    <a href="mailto:hello@lumetic.io" className="hover:text-paper">
                      <span className="link-line">hello@lumetic.io</span>
                    </a>
                  </div>
                </div>
              )}

              {view === "chat" && (
                <div className="flex flex-col gap-4" aria-live="polite">
                  <p className="max-w-[90%] text-[0.95rem] leading-relaxed text-paper/85">{GREETING}</p>
                  {messages.map((msg, i) =>
                    msg.role === "user" ? (
                      <p key={i} className="max-w-[85%] self-end whitespace-pre-wrap rounded-[12px] rounded-br-[4px] bg-paper px-3.5 py-2.5 text-[0.95rem] leading-snug text-ink">
                        {msg.content}
                      </p>
                    ) : (
                      <p key={i} className="max-w-[90%] whitespace-pre-wrap text-[0.95rem] leading-relaxed text-paper/85">
                        {msg.content}
                      </p>
                    )
                  )}
                  {thinking && (
                    <span className="flex gap-1.5 py-1" aria-label="The assistant is typing">
                      {[0, 1, 2].map((d) => (
                        <i key={d} className="h-2 w-2 rounded-[2px] bg-paper/50 motion-safe:animate-pulse" style={{ animationDelay: `${d * 160}ms` }} />
                      ))}
                    </span>
                  )}
                </div>
              )}

              {view === "sent" && (
                <div role="status" className="flex flex-col gap-3 py-6">
                  <PixelGlyph name="spark" className="h-8 w-8 text-mauve" />
                  <p className="text-[1.45rem] font-semibold leading-tight tracking-[-0.025em]">Brief sent.</p>
                  <p className="text-[0.95rem] leading-snug text-paper/65">
                    The studio will reply to {sentTo || "you"} within one business day. Keep an eye on your inbox.
                  </p>
                </div>
              )}
            </div>

            {error && <p role="alert" className="mx-4 mb-2 rounded-[9px] bg-mauve px-3 py-2 text-[0.88rem] text-ink">{error}</p>}

            {view !== "sent" && (
              <div className="border-t border-paper/10 p-3">
                {showSend ? (
                  <form onSubmit={sendBrief} className="flex flex-col gap-2">
                    <p className="px-1 text-[0.88rem] text-paper/65">Where should the studio reply?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="sr-only" htmlFor="dock-name">Name</label>
                      <input id="dock-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required className={fieldCls} />
                      <label className="sr-only" htmlFor="dock-email">Email</label>
                      <input id="dock-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required className={fieldCls} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <button type="button" onClick={() => setShowSend(false)} className="px-1 text-[0.85rem] text-paper/55 hover:text-paper">
                        Keep chatting
                      </button>
                      <button
                        type="submit"
                        disabled={sending}
                        className="group inline-flex h-10 items-center gap-3 rounded-[9px] bg-paper pl-3.5 pr-1 text-[0.9rem] font-medium text-ink disabled:opacity-60"
                      >
                        {sending ? "Sending" : "Send brief"}
                        <span className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-ink text-paper">
                          <Arrow />
                        </span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      send(draft);
                    }}
                    className="flex items-end gap-2"
                  >
                    <label className="sr-only" htmlFor="dock-input">Message</label>
                    <textarea
                      id="dock-input"
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send(draft);
                        }
                      }}
                      rows={1}
                      maxLength={2000}
                      placeholder={view === "menu" ? "Or describe it in your own words" : "Reply..."}
                      className="max-h-32 min-h-11 flex-1 resize-none rounded-[10px] bg-paper/10 px-3.5 py-3 text-[0.95rem] leading-snug text-paper outline-none ring-1 ring-transparent placeholder:text-paper/40 focus:bg-paper/14 focus:ring-paper/40 [field-sizing:content]"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || thinking}
                      aria-label="Send"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-paper text-ink transition-opacity disabled:opacity-30"
                    >
                      <Arrow dir="right" />
                    </button>
                  </form>
                )}
                {!showSend && view === "chat" && (ready || userTurns >= 2) && (
                  <button type="button" onClick={() => setShowSend(true)} className="mt-2 w-full rounded-[9px] py-1.5 text-[0.85rem] text-paper/60 hover:text-paper">
                    {ready ? "Ready when you are: send your brief" : "Send what you have so far"}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
