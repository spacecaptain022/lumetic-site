This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stripe (invoices + payment alerts)

Lumetic bills by invoice: projects are scoped on a call, then invoices are sent from the Stripe Dashboard and paid on Stripe's hosted invoice page. The site only listens for what happens next.

- `src/lib/stripe.ts`: server-only Stripe client (API version `2026-09-30.endive`).
- `src/app/api/stripe/webhook/route.ts`: verifies the Stripe signature, then sends a Telegram message and an email to Lumetic.io@gmail.com for `invoice.paid`, `invoice.payment_failed`, `invoice.overdue`, `charge.refunded` and `charge.dispute.created`. It returns 500 (so Stripe retries) if neither channel succeeds.
- `scripts/stripe-catalog.mjs`: creates one Product per service line. Invoices set their own amount, so products have no fixed price.

Environment variables (`.env.local` locally, sensitive variables in Vercel for production):

| Variable | Local | Production |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | sandbox `sk_test_` / `rk_test_` | live restricted key `rk_live_` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_` | `pk_live_` (not used by the site yet) |
| `STRIPE_WEBHOOK_SECRET` | from `stripe listen --print-secret` | from the live webhook endpoint in the Dashboard |

Local testing:

```bash
npm run stripe:catalog   # create/update the service products in the sandbox
npm run stripe:listen    # forward sandbox events to localhost:3000 (needs STRIPE_API_KEY or `stripe login`)
stripe trigger invoice.paid
```
