"use client";

import { m as motion } from "framer-motion";
import { Arrow } from "@/components/ui/BlockLink";
import SectionHead from "@/components/ui/SectionHead";
import { ENGAGEMENTS } from "@/data/studio";
import { prefillContact } from "@/lib/contact-prefill";
import { MOTION_EASE_SWIFT } from "@/lib/motion";

/** Bars on a shared 0–2 week scale. Ongoing runs off the end. */
const TIMELINE: Record<string, { solid: number; soft: number; format: string }> = {
  "Launch Sprint": { solid: 0.5, soft: 0, format: "Sprint" },
  "Full Brand Build": { solid: 0.75, soft: 0.25, format: "Full build" },
  "Studio Partnership": { solid: 1, soft: 0, format: "Retainer" },
  "Build & Run": { solid: 1, soft: 0, format: "Build + run" },
};

export default function Approach() {
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap">
        <SectionHead title={["Four ways", "to work with us."]} tag="ENGAGEMENTS" note="Pick a starting point" />

        <div className="mt-10 md:mt-14">
          <div className="label hidden grid-cols-[1.5fr_0.7fr_1.4fr_auto] gap-8 pb-3 opacity-55 md:grid">
            <span>Engagement</span>
            <span>Format</span>
            <span className="flex justify-between">
              <span>Week 0</span>
              <span>Week 2</span>
            </span>
            <span className="w-16" />
          </div>
          <ul className="border-t">
            {ENGAGEMENTS.map((item, i) => {
              const t = TIMELINE[item.title];
              return (
                <li key={item.title} className="border-b">
                  <a
                    href="#contact"
                    onClick={() => prefillContact({ message: `I'm interested in the ${item.title}. ` })}
                    className="group grid grid-cols-1 gap-4 py-6 md:grid-cols-[1.5fr_0.7fr_1.4fr_auto] md:items-center md:gap-8 md:py-7"
                  >
                    <span>
                      <span className="block text-[1.4rem] font-semibold tracking-[-0.02em] transition-transform duration-500 ease-swift group-hover:translate-x-1">
                        {item.title}
                      </span>
                      <span className="mt-1.5 block max-w-[30rem] text-[0.92rem] leading-[1.45] text-ink/65">
                        {item.description}
                      </span>
                    </span>
                    <span className="label opacity-70">{t.format}</span>
                    <span>
                      <span className="label mb-2 flex justify-between">
                        <span>{item.timing}</span>
                        {t.solid < 1 && <span className="opacity-50 md:hidden">of 2 weeks</span>}
                      </span>
                      <span className="relative block h-[3px] overflow-hidden rounded-full bg-ink/10">
                        <motion.span
                          className="absolute inset-y-0 left-0 origin-left rounded-full bg-ink"
                          style={{ width: `${t.solid * 100}%` }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 1.2, ease: MOTION_EASE_SWIFT, delay: 0.1 + i * 0.1 }}
                        />
                        {t.soft > 0 && (
                          <span
                            className="absolute inset-y-0 rounded-full bg-ink/30"
                            style={{ left: `${t.solid * 100}%`, width: `${t.soft * 100}%` }}
                          />
                        )}
                      </span>
                    </span>
                    <span className="label flex w-16 items-center gap-1.5 md:justify-end">
                      Enquire <Arrow />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
