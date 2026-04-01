"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function IntakePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [briefSent, setBriefSent] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isReady]);

  async function startConversation() {
    setLoading(true);
    try {
      const res = await fetch("/api/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([{ role: "assistant", content: data.response }]);
    } catch {
      setError("Failed to connect. Please refresh and try again.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();

    // Heuristically capture name from first user response
    if (messages.length <= 1 && !clientName) {
      setClientName(text.split(" ").slice(0, 2).join(" "));
    }

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
      if (data.isReady) setIsReady(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function generateBrief(e: React.FormEvent) {
    e.preventDefault();
    if (!clientEmail) return;
    setBriefLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/intake/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, clientName, clientEmail }),
      });
      if (!res.ok) throw new Error();
      setBriefSent(true);
    } catch {
      setError("Failed to send brief. Please try again.");
      setBriefLoading(false);
    }
  }

  if (briefSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          <Image
            src="/Lumetic logo black no text.png"
            alt="Lumetic"
            width={28}
            height={28}
            className="mx-auto mb-10 opacity-30"
          />
          <h1
            className="font-display text-foreground uppercase leading-none mb-6"
            style={{ fontSize: "clamp(3.5rem, 12vw, 6rem)", letterSpacing: "0.03em" }}
          >
            Brief sent.
          </h1>
          <p className="font-sans text-foreground/45 text-sm leading-relaxed mb-10">
            Your intake brief has been delivered to the Lumetic team. We&apos;ll be in touch within 24 hours.
          </p>
          <a
            href="/"
            className="font-sans text-[11px] uppercase tracking-[0.18em] text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            Back to Lumetic
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="shrink-0 w-full px-6 py-4 border-b border-foreground/[0.07] flex items-center justify-between">
        <a href="/" className="opacity-50 hover:opacity-100 transition-opacity">
          <Image src="/Lumetic logo black no text.png" alt="Lumetic" width={22} height={22} />
        </a>
        <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-foreground/25">
          Client Intake
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-4">

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-5 py-3.5 rounded-2xl font-sans text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-foreground text-background rounded-br-sm"
                      : "bg-foreground/[0.06] text-foreground/75 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-foreground/[0.06] px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-foreground/25"
                      animate={{ opacity: [0.25, 0.8, 0.25] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brief capture card */}
          <AnimatePresence>
            {isReady && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 border border-foreground/[0.08] rounded-3xl p-6"
              >
                <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-foreground/30 mb-3">
                  Ready to generate your brief
                </p>
                <p className="font-sans text-sm text-foreground/55 leading-relaxed mb-6">
                  Enter your email and we&apos;ll compile your brief and send it to the Lumetic team. Expect to hear from us within 24 hours.
                </p>
                <form onSubmit={generateBrief} className="flex flex-col gap-5">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-foreground/12 pb-3 font-sans text-sm text-foreground/70 placeholder:text-foreground/25 focus:border-foreground/35 outline-none transition-colors"
                  />
                  {error && (
                    <p className="font-sans text-xs text-red-500/70">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={briefLoading}
                    className="self-start inline-flex items-center gap-2.5 bg-foreground text-background font-sans font-medium px-7 py-3 rounded-full text-sm tracking-wide hover:bg-foreground/85 disabled:opacity-40 transition-colors group"
                  >
                    {briefLoading ? "Generating..." : "Send my brief"}
                    {!briefLoading && (
                      <ArrowRight size={13} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {error && !isReady && (
            <p className="font-sans text-xs text-red-500/60 text-center">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      {!isReady && (
        <div className="shrink-0 border-t border-foreground/[0.07] bg-background px-4 py-4">
          <form onSubmit={sendMessage} className="max-w-xl mx-auto flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              disabled={loading}
              className="flex-1 bg-transparent font-sans text-sm text-foreground placeholder:text-foreground/25 outline-none disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/85 disabled:opacity-25 transition-all shrink-0"
            >
              <Send size={13} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
