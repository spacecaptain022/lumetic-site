import type Stripe from "stripe";
import { formatStripeAmount } from "@/lib/stripe";

export type StripeNotice = {
  /** Short line used as the email subject and the first Telegram line. */
  title: string;
  /** Label/value rows shown in Telegram and the email table. */
  rows: [label: string, value: string][];
  /** Optional link to the hosted invoice or the Dashboard. */
  link?: { label: string; url: string };
};

/** Events the webhook acts on. Anything else is acknowledged and ignored. */
export const HANDLED_STRIPE_EVENTS = [
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.overdue",
  "charge.refunded",
  "charge.dispute.created",
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
] as const;

export type HandledStripeEvent = (typeof HANDLED_STRIPE_EVENTS)[number];

export function isHandledStripeEvent(type: string): type is HandledStripeEvent {
  return (HANDLED_STRIPE_EVENTS as readonly string[]).includes(type);
}

function dashboardUrl(path: string, livemode: boolean): string {
  return `https://dashboard.stripe.com/${livemode ? "" : "test/"}${path}`;
}

function customerLabel(name?: string | null, email?: string | null): string {
  if (name && email) return `${name} <${email}>`;
  return name || email || "Unknown customer";
}

function invoiceRows(invoice: Stripe.Invoice): [string, string][] {
  return [
    ["Client", customerLabel(invoice.customer_name, invoice.customer_email)],
    ["Invoice", invoice.number ?? invoice.id ?? "(draft)"],
    ...(invoice.description ? ([["Memo", invoice.description]] as [string, string][]) : []),
  ];
}

/** Turns a verified Stripe event into a notification for Telegram + email. */
export function describeStripeEvent(event: Stripe.Event): StripeNotice | null {
  const mode = event.livemode ? "" : " [test]";

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object;
      return {
        title: `💸 Invoice paid: ${formatStripeAmount(invoice.amount_paid, invoice.currency)}${mode}`,
        rows: invoiceRows(invoice),
        link: invoice.hosted_invoice_url ? { label: "View invoice", url: invoice.hosted_invoice_url } : undefined,
      };
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      return {
        title: `⚠️ Invoice payment failed: ${formatStripeAmount(invoice.amount_due, invoice.currency)}${mode}`,
        rows: [...invoiceRows(invoice), ["Attempts", String(invoice.attempt_count)]],
        link: invoice.hosted_invoice_url ? { label: "View invoice", url: invoice.hosted_invoice_url } : undefined,
      };
    }
    case "invoice.overdue": {
      const invoice = event.data.object;
      const due = invoice.due_date ? new Date(invoice.due_date * 1000).toISOString().slice(0, 10) : "—";
      return {
        title: `⏰ Invoice overdue: ${formatStripeAmount(invoice.amount_remaining, invoice.currency)}${mode}`,
        rows: [...invoiceRows(invoice), ["Was due", due]],
        link: invoice.hosted_invoice_url ? { label: "View invoice", url: invoice.hosted_invoice_url } : undefined,
      };
    }
    case "charge.refunded": {
      const charge = event.data.object;
      return {
        title: `↩️ Refund issued: ${formatStripeAmount(charge.amount_refunded, charge.currency)}${mode}`,
        rows: [
          ["Client", customerLabel(charge.billing_details?.name, charge.billing_details?.email ?? charge.receipt_email)],
          ["Original charge", formatStripeAmount(charge.amount, charge.currency)],
        ],
        link: { label: "Open in Stripe", url: dashboardUrl(`payments/${charge.payment_intent ?? charge.id}`, event.livemode) },
      };
    }
    case "charge.dispute.created": {
      const dispute = event.data.object;
      const respondBy = dispute.evidence_details?.due_by
        ? new Date(dispute.evidence_details.due_by * 1000).toISOString().slice(0, 10)
        : "—";
      return {
        title: `🚨 Chargeback opened: ${formatStripeAmount(dispute.amount, dispute.currency)}${mode}`,
        rows: [
          ["Reason", dispute.reason.replace(/_/g, " ")],
          ["Respond by", respondBy],
        ],
        link: { label: "Respond in Stripe", url: dashboardUrl(`disputes/${dispute.id}`, event.livemode) },
      };
    }
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      // A completed session can still be unpaid (bank debits clear days later). Only
      // announce money once it's paid; the async events report the final outcome.
      if (event.type === "checkout.session.completed" && session.payment_status === "unpaid") {
        return {
          title: `🕒 Website payment started, waiting to clear: ${formatStripeAmount(session.amount_total ?? 0, session.currency ?? "usd")}${mode}`,
          rows: checkoutRows(session),
          link: paymentLink(session, event.livemode),
        };
      }
      const failed = event.type === "checkout.session.async_payment_failed";
      return {
        title: `${failed ? "⚠️ Website payment failed" : "💳 Website payment received"}: ${formatStripeAmount(session.amount_total ?? 0, session.currency ?? "usd")}${mode}`,
        rows: checkoutRows(session),
        link: paymentLink(session, event.livemode),
      };
    }
    default:
      return null;
  }
}

function checkoutRows(session: Stripe.Checkout.Session): [string, string][] {
  return [
    ["Client", customerLabel(session.customer_details?.name, session.customer_details?.email ?? session.customer_email)],
    ["Service", session.metadata?.lumetic_service ?? "—"],
    ["Project", session.metadata?.project ?? "—"],
  ];
}

function paymentLink(session: Stripe.Checkout.Session, livemode: boolean): StripeNotice["link"] {
  const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  return pi ? { label: "Open in Stripe", url: dashboardUrl(`payments/${pi}`, livemode) } : undefined;
}

export function formatNoticeText(notice: StripeNotice): string {
  const lines = [notice.title, "", ...notice.rows.map(([label, value]) => `${label}: ${value}`)];
  if (notice.link) lines.push("", `${notice.link.label}: ${notice.link.url}`);
  return lines.join("\n");
}
