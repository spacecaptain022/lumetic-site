"use client";

import AutoVideo from "@/components/ui/AutoVideo";
import BlockLink from "@/components/ui/BlockLink";
import Reveal from "@/components/ui/Reveal";

/** Closing call to action in a rounded media frame, leading straight down to the form. */
export default function VideoCta() {
  return (
    <section className="p-[6px] md:p-2">
      <div className="relative flex min-h-[82svh] items-center justify-center overflow-hidden rounded-[16px] bg-ink text-paper md:min-h-[92svh] md:rounded-[20px]">
        <AutoVideo
          sources={[
            { src: "/services-cta.webm", type: "video/webm" },
            { src: "/services-cta.mp4", type: "video/mp4" },
          ]}
          poster="/services-cta.png"
          label="Lumetic motion study"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/55" />

        <Reveal className="relative px-5 py-24 text-center">
          <h2 className="h-big mx-auto max-w-[9em]">Imagine it. Lumetic builds it.</h2>
          <p className="lede mx-auto mt-6 max-w-[30rem] text-paper/75">
            Describe the idea or the problem in a few lines. Lumetic shapes it into a plan and builds
            the solution, whatever it turns out to be.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BlockLink href="#contact" tone="paper">
              Start a project
            </BlockLink>
            <BlockLink href="mailto:hello@lumetic.io" tone="glass">
              Email Lumetic
            </BlockLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
