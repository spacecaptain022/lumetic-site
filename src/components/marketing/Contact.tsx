"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/BlockLink";
import Reveal from "@/components/ui/Reveal";
import { exploreServices } from "@/data/exploreServices";
import { CONTACT_PREFILL_EVENT, type ContactPrefill } from "@/lib/contact-prefill";

const SERVICE_OPTIONS = [...exploreServices.map((s) => s.title), "Not sure yet"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "service" | "message", string>>;

function validate(data: Record<"name" | "email" | "service" | "message", string>): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = "Please add your name.";
  if (!EMAIL_RE.test(data.email.trim())) errors.email = "That email doesn't look right.";
  if (!data.service) errors.service = "Pick the closest fit, or “Not sure yet”.";
  if (!data.message.trim()) errors.message = "A sentence or two is plenty.";
  return errors;
}

const inputCls =
  "h-12 w-full rounded-[10px] border border-transparent bg-paper px-4 text-[1rem] outline-none transition-colors duration-200 placeholder:text-ink/45 hover:bg-white focus:border-ink focus:bg-white aria-[invalid=true]:border-ink";

export default function Contact() {
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function apply({ service: s, message: m }: ContactPrefill) {
      if (s && SERVICE_OPTIONS.includes(s)) setService(s);
      if (m) setMessage((current) => current || m);
    }
    // Arriving from another page: /?service=…#contact
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {
      service: params.get("service") ?? undefined,
      message: params.get("message") ?? undefined,
    };
    if (fromUrl.service || fromUrl.message) {
      apply(fromUrl);
    }
    const onPrefill = (e: Event) => apply((e as CustomEvent<ContactPrefill>).detail);
    window.addEventListener(CONTACT_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(CONTACT_PREFILL_EVENT, onPrefill);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const value = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value;
    const data = { name: value("name"), email: value("email"), service, message };

    const nextErrors = validate(data);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setSendError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(res.status === 429 && body?.error ? body.error : "send-failed");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setSendError(
        err instanceof Error && err.message !== "send-failed"
          ? err.message
          : "That didn't go through. Your message is still here, so try again, or email hello@lumetic.io."
      );
    }
  }

  return (
    <section className="pb-24 pt-20 md:pb-36 md:pt-32">
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-between gap-10 lg:col-span-5">
          <Reveal>
            <p className="label-mono mb-6">{"(    GET IN TOUCH    )"}</p>
            <h2 className="h-big max-w-[7em]">Start a project.</h2>
            <p className="lede mt-6 max-w-[26rem] text-ink/70">
              Share your brand, timeline, and ambitions. We respond with clarity and a point of view,
              not a template.
            </p>
          </Reveal>

          <dl className="grid max-w-[28rem] grid-cols-2 gap-6 border-t pt-5">
            <div>
              <dt className="label mb-1.5 opacity-60">Email</dt>
              <dd>
                <a href="mailto:hello@lumetic.io" className="group text-[1rem] font-medium">
                  <span className="link-line">hello@lumetic.io</span>
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-1.5 opacity-60">Based in</dt>
              <dd className="text-[1rem] font-medium">USA / Hong Kong</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[16px] bg-card p-5 md:p-8 lg:col-span-7">
          {status === "sent" ? (
            <div role="status" className="flex min-h-[30rem] flex-col justify-end">
              <p className="label mb-4 opacity-60">Received</p>
              <h3 className="h-big">Message sent.</h3>
              <p className="lede mt-5 max-w-[26rem] text-ink/70">
                Thanks for reaching out. We&apos;ll review your note and respond within one business day.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
                <Field label="Name" error={errors.name} id="name">
                  <input
                    id="name"
                    name="name"
                    data-field="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email" error={errors.email} id="email">
                  <input
                    id="email"
                    name="email"
                    data-field="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your@email.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputCls}
                  />
                </Field>
              </div>

              <fieldset aria-describedby={errors.service ? "service-error" : undefined}>
                <legend className="label mb-2.5 opacity-70">What do you need?</legend>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map((option, i) => (
                    <label key={option} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="service"
                        value={option}
                        data-field={i === 0 ? "service" : undefined}
                        checked={service === option}
                        onChange={() => setService(option)}
                        className="peer absolute inset-0 opacity-0"
                      />
                      <span className="flex min-h-10 items-center rounded-[8px] bg-paper px-3.5 py-2 text-[0.9rem] leading-tight transition-colors duration-200 hover:bg-white peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.service && (
                  <p id="service-error" className="mt-2 text-[0.88rem] font-medium">
                    {errors.service}
                  </p>
                )}
              </fieldset>

              <Field label="Message" error={errors.message} id="message">
                <textarea
                  id="message"
                  name="message"
                  data-field="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project, goals, and timeline..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${inputCls} h-auto resize-y py-3`}
                />
              </Field>

              {sendError && (
                <p role="alert" className="rounded-[10px] bg-ink px-4 py-3 text-[0.92rem] text-paper">
                  {sendError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[20rem] text-[0.82rem] leading-snug text-ink/60">
                  By sending this form you agree we may store your details to respond to your inquiry.
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex h-12 shrink-0 items-center gap-4 self-start rounded-[10px] bg-ink pl-4 pr-1.5 text-[0.92rem] font-medium text-paper transition-colors hover:bg-ink/88 disabled:opacity-60 sm:self-auto"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-paper/14 transition-colors group-hover:bg-paper group-hover:text-ink">
                    <Arrow />
                  </span>
                </button>
              </div>
              <div role="status" aria-live="polite" className="sr-only">
                {status === "sending" ? "Sending message" : ""}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block opacity-70">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.88rem] font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
