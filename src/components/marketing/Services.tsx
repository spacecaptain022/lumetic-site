import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/BlockLink";
import PixelGlyph, { type GlyphName } from "@/components/ui/PixelGlyph";
import SectionHead from "@/components/ui/SectionHead";
import { featuredProjects } from "@/data/featuredProjects";

const GLYPH_BY_SLUG: Record<string, GlyphName> = {
  "brand-identity-strategy": "brand",
  "web-design-digital-presence": "web",
  "motion-visual-content": "motion",
  "web3-ai-dev-services": "chip",
};

export default function Services() {
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap">
        <SectionHead title={["Four", "practices."]} tag="WHAT WE DO" note="Strategy through launch" />
        <p className="lede mt-6 max-w-[36rem] text-ink/70">
          Brands thrive by forging deeper connections with their audience. What we create matters, but
          what we make possible matters more.
        </p>
      </div>

      {/* Scrolls sideways on small screens, a row of four on large ones */}
      <ul className="mt-10 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mt-12 lg:wrap lg:grid lg:grid-cols-4 lg:overflow-visible">
        {featuredProjects.map((service, i) => (
          <li key={service.slug} className="w-[78vw] max-w-[22rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <Link
              href={`/work/${service.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[16px] bg-card p-5 transition-colors duration-500 hover:text-paper focus-visible:text-paper md:p-6"
            >
              <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-swift group-hover:opacity-100 group-focus-visible:opacity-100">
                <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 25vw, 78vw" className="object-cover" />
                <span className="absolute inset-0 bg-ink/55" />
              </span>

              <span className="label-mono relative">{`(     ${String(i + 1).padStart(3, "0")}     )`}</span>

              <span className="relative flex justify-center transition-transform duration-700 ease-swift group-hover:scale-75 group-hover:opacity-0">
                <PixelGlyph name={GLYPH_BY_SLUG[service.slug] ?? "spark"} className="h-16 w-16 md:h-20 md:w-20" />
              </span>

              <span className="relative">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.82rem] font-semibold uppercase tracking-[0.01em]">{service.title}</span>
                  <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
                <span className="mt-2 block text-[0.95rem] leading-[1.45] opacity-70">{service.excerpt}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
