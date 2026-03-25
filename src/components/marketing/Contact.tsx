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
    <section className="w-full min-h-[calc(100vh-6rem)] bg-background px-4 md:px-12 py-20 md:py-28 flex items-start">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24">

        {/* Left — headline + info */}
        <div className="flex flex-col justify-between gap-16">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="font-sans text-foreground/60 uppercase tracking-[0.18em] text-[10px] mb-6"
            >
              Get in touch
            </motion.p>
            <motion.h1
              {...fadeUp(0.08)}
              className="font-display text-foreground uppercase"
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
            <div className="w-12 h-px bg-foreground/15" />
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1">Based in</p>
                <p className="font-sans text-sm text-foreground/70">USA / Hong Kong</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div {...fadeUp(0.15)} className="bg-background/60 backdrop-blur-sm border border-foreground/[0.07] rounded-3xl px-6 py-8 md:px-10 md:py-12">
          {submitted ? (
            <div className="flex flex-col items-start justify-center h-full gap-4 pt-8">
              <span className="font-display text-foreground uppercase text-5xl tracking-wide">
                Message sent.
              </span>
              <p className="font-sans text-foreground/65 text-sm leading-relaxed">
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                    className="w-full bg-transparent border-b border-foreground/15 pb-3 font-sans text-sm text-foreground/70 focus:text-foreground focus:border-foreground/40 outline-none appearance-none cursor-pointer transition-colors duration-200"
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
                  className="w-full bg-transparent border-b border-foreground/15 pb-3 font-sans text-sm text-foreground/70 placeholder:text-foreground/50 focus:text-foreground focus:border-foreground/40 outline-none resize-none transition-colors duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 self-start inline-flex items-center gap-2.5 bg-foreground text-background font-sans font-medium px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-foreground/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 group"
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
        className="w-full bg-transparent border-b border-foreground/15 pb-3 font-sans text-sm text-foreground/70 placeholder:text-foreground/50 focus:text-foreground focus:border-foreground/40 outline-none transition-colors duration-200"
      />
    </div>
  );
}
