import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/BlockLink";
import PixelGlyph, { type GlyphName } from "@/components/ui/PixelGlyph";
import SectionHead from "@/components/ui/SectionHead";

/*
 * What Lumetic does, said as the result a business owner gets. Each card opens the closest
 * practice page in /work. Get found and Get booked share the web page, which covers both.
 */
const OUTCOMES: { title: string; body: string; glyph: GlyphName; href: string; image: string }[] = [
  {
    title: "Get found",
    body: "A site that works on every phone, a Google listing filled out right, and local ads nearby.",
    glyph: "web",
    href: "/work/web-design-digital-presence",
    image: "/gallery/web-design-digital-v2.png",
  },
  {
    title: "Get booked",
    body: "Online booking, quote forms, and tap-to-call, so a visit turns into an appointment.",
    glyph: "calendar",
    href: "/work/web-design-digital-presence",
    image: "/gallery/motion-visual-v2.png",
  },
  {
    title: "Runs on its own",
    body: "Reminders, follow-ups, review requests, and payment links that go out by themselves.",
    glyph: "chip",
    href: "/work/web3-ai-dev-services",
    image: "/gallery/web3-ai-dev.png",
  },
  {
    title: "Look the part",
    body: "A brand, photos, and content that look as good as the work you do.",
    glyph: "brand",
    href: "/work/brand-identity-strategy",
    image: "/gallery/brand-identity.png",
  },
];

export default function Services() {
  return (
    <section className="pb-24 pt-24 md:pb-36 md:pt-36">
      <div className="wrap">
        <SectionHead title={["What we", "do for you."]} tag="WHAT WE DO" note="One piece or all four" />
        <p className="lede mt-6 max-w-[36rem] text-ink/70">
          Most businesses don&apos;t need more tech. They need more people finding them, less time
          on the phone, and fewer things to keep track of. Here&apos;s how Lumetic helps.
        </p>
      </div>

      {/* Scrolls sideways on small screens, a row of four on large ones */}
      <ul className="mt-10 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mt-12 lg:wrap lg:grid lg:grid-cols-4 lg:overflow-visible">
        {OUTCOMES.map((item, i) => (
          <li key={item.title} className="w-[78vw] max-w-[22rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <Link
              href={item.href}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[16px] bg-card p-5 transition-colors duration-500 hover:text-paper focus-visible:text-paper md:p-6"
            >
              <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-swift group-hover:opacity-100 group-focus-visible:opacity-100">
                <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 25vw, 78vw" className="object-cover" />
                <span className="absolute inset-0 bg-ink/55" />
              </span>

              <span className="label-mono relative">{`(     ${String(i + 1).padStart(3, "0")}     )`}</span>

              <span className="relative flex justify-center transition-transform duration-700 ease-swift group-hover:scale-75 group-hover:opacity-0">
                <PixelGlyph name={item.glyph} className="h-16 w-16 md:h-20 md:w-20" />
              </span>

              <span className="relative">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.82rem] font-semibold uppercase tracking-[0.01em]">{item.title}</span>
                  <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
                <span className="mt-2 block text-[0.95rem] leading-[1.45] opacity-70">{item.body}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
