"use client";

/** Not mounted in root layout right now — wire back in `src/app/layout.tsx` when you want Quick Contact visible again. Posts to `/api/subscribe`. */

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

export default function FloatingSubscribe() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(typeof data.error === "string" ? data.error : "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMessage("Network error. Try again.");
      setStatus("error");
    }
  }

  if (!mounted || dismissed) return null;

  return (
    <div
      className="fixed bottom-5 left-4 right-4 z-[9980] flex justify-center pointer-events-none md:bottom-8 md:left-8 md:right-8"
      role="region"
      aria-label="Quick contact"
    >
      <div
        className="pointer-events-auto w-full max-w-lg rounded-[2.25rem] bg-white px-6 py-5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] md:px-8 md:py-6 md:rounded-[2.75rem]"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <p className="font-sans font-semibold text-black uppercase tracking-[0.12em] text-xs md:text-sm">
              Contact
            </p>
            <p className="font-sans text-foreground/45 uppercase tracking-[0.14em] text-[9px] md:text-[10px] mt-1 leading-snug">
              (quick contact)
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 -mt-0.5 -mr-1 p-2 text-black/70 hover:text-black transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            aria-label="Close contact bar"
          >
            <X className="size-4" strokeWidth={1.25} />
          </button>
        </div>

        {status === "success" ? (
          <p className="font-sans text-sm text-foreground/70 text-center py-2">
            Thanks. We&apos;ll reach out soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-full bg-black pl-5 pr-1.5 py-1.5 md:pl-6 md:py-2">
              <label htmlFor="floating-subscribe-email" className="sr-only">
                Email address
              </label>
              <input
                id="floating-subscribe-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                disabled={status === "loading"}
                className="min-w-0 flex-1 bg-transparent font-sans text-[11px] md:text-xs uppercase tracking-[0.14em] text-white placeholder:text-white/45 outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label={status === "loading" ? "Submitting" : "Send contact email"}
              >
                <span className="size-1.5 rounded-full bg-black" aria-hidden />
              </button>
            </div>
            {errorMessage && (
              <p className="font-sans text-[11px] text-red-600 px-1">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
