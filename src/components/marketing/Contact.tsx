"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 56 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 1.0, ease, delay },
  };
}

const services = [
  "Brand Identity & Strategy",
  "Web Design & Digital Presence",
  "Motion & Visual Content",
  "Not sure yet",
];

function FormCardCornerDot() {
  return (
    <span
      className="pointer-events-none absolute right-7 top-7 flex size-7 items-center justify-center rounded-full border border-foreground/20 bg-background/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
      aria-hidden
    >
      <span className="size-1.5 rounded-full bg-foreground" />
    </span>
  );
}

const formShellClass =
  "relative overflow-hidden rounded-[2rem] border border-foreground/[0.08] bg-card/90 p-8 shadow-[0_28px_72px_-24px_rgba(0,0,0,0.12),0_12px_32px_-12px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-foreground/[0.04] backdrop-blur-xl backdrop-saturate-150 md:p-10 md:pl-11";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send.");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative isolate w-full min-h-[calc(100vh-6rem)] overflow-hidden bg-background px-4 py-20 md:px-12 md:py-28 flex items-start">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_10%_20%,rgba(0,0,0,0.03)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-24">

        {/* Left — headline + info */}
        <div className="flex flex-col justify-between gap-16 md:min-h-[min(520px,70vh)]">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="font-sans text-foreground/55 uppercase tracking-[0.2em] text-[10px] mb-6"
            >
              Get in touch
            </motion.p>
            <motion.h1
              {...fadeUp(0.08)}
              className="font-display text-foreground uppercase [text-shadow:0_1px_0_rgba(255,255,255,0.5),0_22px_60px_rgba(0,0,0,0.06)]"
              style={{
                fontSize: "clamp(3.5rem, 7vw, 7rem)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
              }}
            >
              Let&apos;s build<br />something<br />great.
            </motion.h1>
          </div>

          <motion.div {...fadeUp(0.2)} className="flex flex-col gap-4">
            <div className="h-px w-14 bg-gradient-to-r from-foreground/25 to-transparent" />
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-1.5">Based in</p>
                <p className="font-sans text-sm text-foreground/75">USA / Hong Kong</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div {...fadeUp(0.15)} className={formShellClass}>
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-foreground/[0.04] blur-3xl"
            aria-hidden
          />
          <FormCardCornerDot />

          {submitted ? (
            <div className="relative flex min-h-[280px] flex-col items-start justify-center gap-4 pr-12 pt-4 sm:pr-14">
              <span className="font-display text-foreground uppercase text-4xl tracking-wide sm:text-5xl">
                Message sent.
              </span>
              <p className="font-sans text-foreground/65 text-sm leading-relaxed">
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col gap-8">
              {error && (
                <p className="font-sans text-sm text-red-500/80">{error}</p>
              )}

              <Field label="Name" id="name" type="text" placeholder="Your name" required />
              <Field label="Email" id="email" type="email" placeholder="your@email.com" required />

              {/* Service select */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="service"
                  className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/60"
                >
                  Service
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    defaultValue=""
                    className="w-full bg-transparent border-b border-foreground/18 pb-3 font-sans text-sm text-foreground/75 focus:text-foreground focus:border-foreground/45 outline-none appearance-none cursor-pointer transition-colors duration-300"
                  >
                    <option value="" disabled>Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="absolute right-0 bottom-3 text-foreground/50 pointer-events-none text-xs">▾</span>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/60"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your project..."
                  required
                  className="w-full bg-transparent border-b border-foreground/18 pb-3 font-sans text-sm text-foreground/75 placeholder:text-foreground/45 focus:text-foreground focus:border-foreground/45 outline-none resize-none transition-colors duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 self-start inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-background shadow-[0_10px_28px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[color,background-color,box-shadow,transform] duration-200 hover:bg-foreground/90 hover:shadow-[0_14px_36px_-8px_rgba(0,0,0,0.4)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none group"
              >
                {loading ? "Sending..." : "Send message"}
                {!loading && (
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                  />
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/60"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b border-foreground/18 pb-3 font-sans text-sm text-foreground/75 placeholder:text-foreground/45 focus:text-foreground focus:border-foreground/45 outline-none transition-colors duration-300"
      />
    </div>
  );
}
