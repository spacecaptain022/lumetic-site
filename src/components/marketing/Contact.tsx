"use client";

import { useState } from "react";
import { m as motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LinkCharShift from "@/components/layout/LinkCharShift";
import InteractiveHeadline from "@/components/marketing/InteractiveHeadline";
import { exploreServices } from "@/data/exploreServices";
import { fadeUpReveal, MOTION_EASE_CSS_STANDARD } from "@/lib/motion";

const HEADLINE = "Let's build something great.";
const HEADLINE_ACCENT = ["build", "something", "great"];

const serviceSelectOptions = [...exploreServices.map((s) => s.title), "Not sure yet"];

const contactDetails = [
  {
    label: "Email",
    value: "hello@lumetic.io",
    href: "mailto:hello@lumetic.io",
  },
  {
    label: "Based in",
    value: "USA / Hong Kong",
  },
] as const;

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
      setError("Something went wrong. Please try again or email hello@lumetic.io directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative isolate w-full overflow-hidden border-t border-foreground/10 bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_100%,rgba(213,149,175,0.07),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(0,0,0,0.03),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 py-20 md:px-12 md:py-32 lg:py-36">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10 lg:gap-16">
          <div className="flex flex-col justify-between gap-12 md:col-span-5 md:min-h-[min(560px,72vh)] lg:col-span-5">
            <div>
              <motion.p
                {...fadeUpReveal(0)}
                className="mb-6 font-sans text-[0.62rem] font-medium uppercase tracking-[0.22em] text-foreground/55"
              >
                Get in touch
              </motion.p>

              <motion.div {...fadeUpReveal(0.06)}>
                <InteractiveHeadline
                  as="h2"
                  text={HEADLINE}
                  accentWords={HEADLINE_ACCENT}
                  className="cursor-default font-medium"
                  style={{
                    fontSize: "clamp(2.35rem, 5.8vw, 4.75rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.06,
                  }}
                />
              </motion.div>

              <motion.p
                {...fadeUpReveal(0.12)}
                className="mt-8 max-w-[34ch] font-sans text-[0.92rem] leading-relaxed text-foreground/58 md:text-[0.95rem]"
              >
                Share your brand, timeline, and ambitions. We respond with clarity and a point of view,
                not a template.
              </motion.p>
            </div>

            <motion.div {...fadeUpReveal(0.18)} className="flex flex-col gap-8">
              <div className="h-px w-full max-w-[12rem] bg-foreground/12" />
              <dl className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {contactDetails.map((item) => (
                  <div key={item.label}>
                    <dt className="mb-1.5 font-sans text-[0.58rem] uppercase tracking-[0.2em] text-foreground/48">
                      {item.label}
                    </dt>
                    <dd className="font-sans text-[0.9rem] text-foreground/82">
                      {"href" in item ? (
                        <LinkCharShift
                          href={item.href}
                          className="text-foreground/82 hover:text-foreground"
                        >
                          {item.value}
                        </LinkCharShift>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>

          <motion.div
            {...fadeUpReveal(0.1)}
            className="relative md:col-span-7 lg:col-span-7"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] bg-background p-8 shadow-[0_28px_90px_rgba(0,0,0,0.07)] ring-1 ring-foreground/[0.07] md:p-11 md:pl-12 lg:p-12">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D595AF]/10 blur-3xl"
                aria-hidden
              />

              {submitted ? (
                <div className="relative flex min-h-[min(420px,52vh)] flex-col justify-center gap-5 py-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D595AF]/15 font-sans text-sm font-medium text-foreground">
                    ✓
                  </span>
                  <h3
                    className="font-sans font-medium text-foreground"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.1,
                    }}
                  >
                    Message sent.
                  </h3>
                  <p className="max-w-sm font-sans text-sm leading-relaxed text-foreground/58">
                    Thanks for reaching out. We&apos;ll review your note and respond within one business
                    day.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  aria-describedby={error ? "contact-form-error" : undefined}
                  className="relative flex flex-col gap-9"
                >
                  <div role="status" aria-live="polite" className="sr-only">
                    {loading ? "Sending message…" : ""}
                  </div>

                  {error && (
                    <p
                      id="contact-form-error"
                      role="alert"
                      className="rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-3 font-sans text-sm text-red-600/90"
                    >
                      {error}
                    </p>
                  )}

                  <div className="grid gap-9 sm:grid-cols-2">
                    <Field label="Name" id="name" type="text" placeholder="Your name" required />
                    <Field label="Email" id="email" type="email" placeholder="your@email.com" required />
                  </div>

                  <SelectField label="Service" id="service" options={serviceSelectOptions} />

                  <TextareaField
                    label="Message"
                    id="message"
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={5}
                    required
                  />

                  <div className="flex flex-col gap-4 border-t border-foreground/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs font-sans text-[0.72rem] leading-relaxed text-foreground/45">
                      By sending this form you agree we may store your details to respond to your inquiry.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-foreground px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-background transition-[opacity,transform] duration-300 hover:opacity-88 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                      style={{ transitionTimingFunction: MOTION_EASE_CSS_STANDARD }}
                    >
                      {loading ? "Sending..." : "Send message"}
                      {!loading && (
                        <ArrowRight
                          size={14}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                          style={{ transitionTimingFunction: MOTION_EASE_CSS_STANDARD }}
                        />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const fieldClass =
  "w-full bg-transparent pb-3 font-sans text-[0.92rem] text-foreground outline-none transition-[border-color,color] duration-300 placeholder:text-foreground/38 focus:border-[#D595AF]";

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
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`${fieldClass} border-b border-foreground/16`}
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  options,
}: {
  label: string;
  id: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </label>
      <div className="relative border-b border-foreground/16 focus-within:border-[#D595AF] transition-colors duration-300">
        <select
          id={id}
          name={id}
          defaultValue=""
          required
          className={`${fieldClass} cursor-pointer appearance-none pr-8`}
        >
          <option value="" disabled>
            Select a service
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 bottom-3 text-[0.65rem] text-foreground/40">
          ▾
        </span>
      </div>
    </div>
  );
}

function TextareaField({
  label,
  id,
  placeholder,
  rows,
  required,
}: {
  label: string;
  id: string;
  placeholder: string;
  rows: number;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`${fieldClass} min-h-[7.5rem] resize-none border-b border-foreground/16`}
      />
    </div>
  );
}
