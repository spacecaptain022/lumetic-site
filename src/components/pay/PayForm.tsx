"use client";

import { useState } from "react";
import { Arrow } from "@/components/ui/BlockLink";
import { PAY_MAX_USD, PAY_MIN_USD, PAY_PROJECT_MAX_LENGTH, PAY_SERVICES, parseUsdToCents } from "@/lib/pay";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "service" | "amount" | "project" | "email";
type Errors = Partial<Record<Field, string>>;

const inputCls =
  "h-12 w-full rounded-[10px] border border-transparent bg-paper px-4 text-[1rem] outline-none transition-colors duration-200 placeholder:text-ink/45 hover:bg-white focus:border-ink focus:bg-white aria-[invalid=true]:border-ink";

function validate(data: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!data.service) errors.service = "Choose the service you're paying for.";
  const cents = parseUsdToCents(data.amount);
  if (cents === null) errors.amount = "Enter the amount, like 2500 or 2,500.00.";
  else if (cents < PAY_MIN_USD * 100 || cents > PAY_MAX_USD * 100)
    errors.amount = `Enter an amount between $${PAY_MIN_USD} and $${PAY_MAX_USD.toLocaleString("en-US")}.`;
  if (!data.project.trim()) errors.project = "Add the project name or what this payment is for.";
  if (!EMAIL_RE.test(data.email.trim())) errors.email = "That email doesn't look right.";
  return errors;
}

export default function PayForm() {
  const [values, setValues] = useState<Record<Field, string>>({ service: "", amount: "", project: "", email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "redirecting">("idle");
  const [sendError, setSendError] = useState("");

  const set = (field: Field) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSendError("");
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    setStatus("redirecting");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !body?.url) throw new Error(body?.error || "Couldn't start the payment. Please try again.");
      window.location.assign(body.url);
    } catch (err) {
      setStatus("idle");
      setSendError(err instanceof Error ? err.message : "Couldn't start the payment. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <fieldset aria-describedby={errors.service ? "service-error" : undefined}>
        <legend className="label mb-2.5 opacity-70">Service</legend>
        <div className="flex flex-wrap gap-2">
          {PAY_SERVICES.map((option, i) => (
            <label key={option.key} className="relative cursor-pointer">
              <input
                type="radio"
                name="service"
                value={option.key}
                data-field={i === 0 ? "service" : undefined}
                checked={values.service === option.key}
                onChange={() => set("service")(option.key)}
                className="peer absolute inset-0 opacity-0"
              />
              <span className="flex min-h-10 items-center rounded-[8px] bg-paper px-3.5 py-2 text-[0.9rem] leading-tight transition-colors duration-200 hover:bg-white peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {option.title}
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

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
        <Field label="Amount (USD)" id="amount" error={errors.amount}>
          <div className="relative">
            <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[1rem] text-ink/55">
              $
            </span>
            <input
              id="amount"
              name="amount"
              data-field="amount"
              inputMode="decimal"
              autoComplete="off"
              placeholder="2,500.00"
              value={values.amount}
              onChange={(e) => set("amount")(e.target.value)}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              className={`${inputCls} pl-8`}
            />
          </div>
        </Field>
        <Field label="Email for the receipt" id="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            data-field="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Project or reference" id="project" error={errors.project}>
        <input
          id="project"
          name="project"
          data-field="project"
          maxLength={PAY_PROJECT_MAX_LENGTH}
          placeholder="e.g. Acme storefront, 50% deposit"
          value={values.project}
          onChange={(e) => set("project")(e.target.value)}
          aria-invalid={Boolean(errors.project)}
          aria-describedby={errors.project ? "project-error" : undefined}
          className={inputCls}
        />
      </Field>

      {sendError && (
        <p role="alert" className="rounded-[10px] bg-ink px-4 py-3 text-[0.92rem] text-paper">
          {sendError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[22rem] text-[0.82rem] leading-snug text-ink/60">
          You&apos;ll finish on Stripe&apos;s secure checkout. Card, bank and wallet payments are accepted.
          Lumetic never sees your card details.
        </p>
        <button
          type="submit"
          disabled={status === "redirecting"}
          className="group inline-flex h-12 shrink-0 items-center gap-4 self-start rounded-[10px] bg-ink pl-4 pr-1.5 text-[0.92rem] font-medium text-paper transition-colors hover:bg-ink/88 disabled:opacity-60 sm:self-auto"
        >
          {status === "redirecting" ? "Opening checkout…" : "Continue to payment"}
          <span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-paper/14 transition-colors group-hover:bg-paper group-hover:text-ink">
            <Arrow />
          </span>
        </button>
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {status === "redirecting" ? "Opening secure checkout" : ""}
      </div>
    </form>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
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
