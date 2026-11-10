"use client";

import { Arrow } from "@/components/ui/BlockLink";
import SectionHead from "@/components/ui/SectionHead";
import { ENGAGEMENTS } from "@/data/studio";
import { prefillContact } from "@/lib/contact-prefill";

/** Four starting points, one line each. Every row opens the contact form with it filled in. */
export default function Approach() {
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap">
        <SectionHead title={["Four ways", "to work with Lumetic."]} tag="ENGAGEMENTS" note="Pick a starting point" />

        <ul className="mt-10 border-t md:mt-14">
          {ENGAGEMENTS.map((item) => (
            <li key={item.title} className="border-b">
              <a
                href="#contact"
                onClick={() => prefillContact({ message: `I'm interested in the ${item.title}. ` })}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 md:grid-cols-12 md:gap-8 md:py-8"
              >
                <span className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] transition-transform duration-500 ease-swift group-hover:translate-x-1.5 md:col-span-5">
                  {item.title}
                </span>
                <Arrow className="col-start-2 row-start-1 opacity-50 transition-opacity duration-300 group-hover:opacity-100 md:col-start-12 md:justify-self-end" />
                <span className="col-span-2 max-w-[34rem] text-[0.98rem] leading-[1.5] text-ink/65 md:col-span-6 md:col-start-6 md:row-start-1">
                  {item.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
