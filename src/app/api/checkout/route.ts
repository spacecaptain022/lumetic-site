import { NextRequest, NextResponse } from "next/server";
import {
  PAY_MAX_USD,
  PAY_MIN_USD,
  PAY_PROJECT_MAX_LENGTH,
  PAY_SERVICES,
  isPayServiceKey,
  parseUsdToCents,
  type PayServiceKey,
} from "@/lib/pay";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site-seo";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECKOUT_RATE_LIMIT = 5;
const CHECKOUT_RATE_WINDOW_MS = 15 * 60 * 1000;
// Tags these sessions in the Stripe Dashboard so this flow can be told apart from others.
const INTEGRATION_IDENTIFIER = "lumetic-pay-page-qvkmrtzh";

// Product IDs differ between the sandbox and live, so look them up by metadata once.
let productIdsByService: Map<PayServiceKey, string> | null = null;

async function getProductId(service: PayServiceKey): Promise<string | undefined> {
  if (!productIdsByService) {
    const map = new Map<PayServiceKey, string>();
    for await (const product of getStripe().products.list({ active: true, limit: 100 })) {
      const key = product.metadata?.lumetic_service;
      if (isPayServiceKey(key) && !map.has(key)) map.set(key, product.id);
    }
    productIdsByService = map;
  }
  return productIdsByService.get(service);
}

function originFor(req: NextRequest): string {
  // Local dev and Vercel previews return to themselves; everything else to the live site.
  const host = req.headers.get("host") ?? "";
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) return `http://${host}`;
  if (host.endsWith(".vercel.app")) return `https://${host}`;
  return SITE_URL;
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`checkout:${getClientIp(req)}`, CHECKOUT_RATE_LIMIT, CHECKOUT_RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Payments aren't available right now. Email hello@lumetic.io." }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const service = body?.service;
  const amountCents = typeof body?.amount === "string" ? parseUsdToCents(body.amount) : null;
  const project = typeof body?.project === "string" ? body.project.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isPayServiceKey(service)) {
    return NextResponse.json({ error: "Choose a service." }, { status: 400 });
  }
  if (amountCents === null || amountCents < PAY_MIN_USD * 100 || amountCents > PAY_MAX_USD * 100) {
    return NextResponse.json(
      { error: `Enter an amount between $${PAY_MIN_USD} and $${PAY_MAX_USD.toLocaleString("en-US")}.` },
      { status: 400 }
    );
  }
  if (!project || project.length > PAY_PROJECT_MAX_LENGTH) {
    return NextResponse.json({ error: "Add a short project name or reference." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  const serviceTitle = PAY_SERVICES.find((s) => s.key === service)!.title;

  try {
    const productId = await getProductId(service);
    const origin = originFor(req);

    // Payment methods come from the Dashboard (dynamic payment methods), so none are listed here.
    // Automatic tax stays off until Lumetic has a tax registration.
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      customer_creation: "always",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            ...(productId
              ? { product: productId }
              : { product_data: { name: serviceTitle } }),
          },
        },
      ],
      payment_intent_data: {
        description: `${serviceTitle}: ${project}`,
        metadata: { lumetic_service: service, project },
      },
      metadata: { lumetic_service: service, project },
      integration_identifier: INTEGRATION_IDENTIFIER,
      success_url: `${origin}/pay/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay`,
    });

    if (!session.url) throw new Error("Checkout Session has no URL.");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Couldn't start the payment. Please try again or email hello@lumetic.io." },
      { status: 500 }
    );
  }
}
