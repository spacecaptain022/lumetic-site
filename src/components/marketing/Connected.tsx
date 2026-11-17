import PixelGlyph, { type GlyphName } from "@/components/ui/PixelGlyph";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";

/*
 * The tech under what Lumetic builds: headless systems that plug into the tools a business
 * already uses. Said plainly, so an owner knows what they get without knowing the jargon.
 */
const APPS = [
  "Gmail",
  "Outlook",
  "Google Calendar",
  "HubSpot",
  "Salesforce",
  "Zoho",
  "Slack",
  "Microsoft Teams",
  "Shopify",
  "WooCommerce",
  "Square",
  "Stripe",
  "QuickBooks",
  "Xero",
  "Google Sheets",
  "Airtable",
  "Notion",
  "Zapier",
  "Calendly",
  "Twilio",
  "WhatsApp",
  "Mailchimp",
  "Zendesk",
  "DocuSign",
  "UPS",
  "Claude",
  "ChatGPT",
];

const CAPABILITIES: { tag: string; title: string; body: string; glyph: GlyphName }[] = [
  {
    tag: "Headless",
    title: "Any screen, or none",
    body: "No new dashboard to learn. Your system works through your inbox, your phone, team chat, or an API. A screen is there when you want one.",
    glyph: "web",
  },
  {
    tag: "Integrations",
    title: "1,700+ apps, connected",
    body: "CRM, payments, store, shipping, calendar, chat, and signatures wired together, so information moves on its own instead of by copy and paste.",
    glyph: "spark",
  },
  {
    tag: "Your own AI",
    title: "Works with Claude and ChatGPT",
    body: "Connects over MCP, so your AI or your own agents can ask it questions, look things up, and hand you the day's work to approve.",
    glyph: "chip",
  },
  {
    tag: "CRM",
    title: "Two-way sync",
    body: "HubSpot, Salesforce, and Zoho stay in step both ways. Records are matched by website and email, so nothing doubles.",
    glyph: "web3",
  },
  {
    tag: "Developers",
    title: "Webhooks & Zapier",
    body: "Signed events go out the moment something happens, plus no-code triggers into thousands of apps.",
    glyph: "motion",
  },
  {
    tag: "Controls",
    title: "You set how far it goes",
    body: "Every step is Off, Ask first, or Automatic. A weekly spending cap and one pause switch stop everything at once.",
    glyph: "calendar",
  },
  {
    tag: "Audit trail",
    title: "Receipts for everything",
    body: "Every step it took on its own, with why and what it cost. It forecasts the cost before it runs, too.",
    glyph: "brand",
  },
  {
    tag: "Voice",
    title: "Answers and makes calls",
    body: "Picks up the phone, answers from your facts, and books the meeting. Calls it makes always say it's an AI.",
    glyph: "spark",
  },
  {
    tag: "White-label",
    title: "Your brand, your data",
    body: "A private build on your own domain and brand, with your data walled off from everyone else's.",
    glyph: "commerce",
  },
];

export default function Connected() {
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap">
        <SectionHead title={["Headless,", "and plugged in."]} tag="THE TECH" note="Under everything we build" />
        <p className="lede mt-6 max-w-[38rem] text-ink/70">
          What Lumetic builds doesn&apos;t have to live behind another login. It runs headless, in the
          places you already work, and plugs into the tools you already pay for.
        </p>
      </div>

      {/* Dark frame: the headline number and the app strip */}
      <div className="mt-10 px-[6px] md:mt-14 md:px-2">
        <div className="overflow-hidden rounded-[16px] bg-ink py-14 text-paper md:rounded-[20px] md:py-20">
          <div className="wrap flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p className="text-[clamp(3.5rem,9vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.05em]">
                1,700<span className="opacity-50">+</span>
              </p>
              <p className="mt-3 text-[clamp(1.25rem,2vw,1.75rem)] font-semibold tracking-[-0.02em]">
                apps, connected.
              </p>
            </Reveal>
            <p className="max-w-[24rem] text-[0.98rem] leading-[1.5] text-paper/65">
              Use something that isn&apos;t listed? Name it. If it has an API, we connect it, on the
              same rules as everything else: it only does what you allow.
            </p>
          </div>

          <div className="marquee mt-12 overflow-hidden md:mt-16" aria-label="Apps we connect">
            <ul className="marquee-track flex w-max gap-2 pr-2">
              {[0, 1].map((copy) =>
                APPS.map((app) => (
                  <li
                    key={`${copy}-${app}`}
                    aria-hidden={copy === 1}
                    className="shrink-0 rounded-full border border-paper/15 px-4 py-2 text-[0.92rem] font-medium text-paper/80"
                  >
                    {app}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <ul className="wrap mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((item) => (
          <li key={item.title} className="flex flex-col gap-8 rounded-[16px] bg-card p-5 md:p-6">
            <span className="flex items-center justify-between">
              <span className="label-mono opacity-60">{`(  ${item.tag.toUpperCase()}  )`}</span>
              <PixelGlyph name={item.glyph} className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[1.15rem] font-semibold leading-[1.2] tracking-[-0.02em]">{item.title}</span>
              <span className="mt-2 block text-[0.95rem] leading-[1.5] text-ink/65">{item.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
