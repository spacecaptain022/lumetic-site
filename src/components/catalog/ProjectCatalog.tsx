"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { catalogProjects } from "@/data/catalogProjects";
import { MOTION_EASE_SWIFT } from "@/lib/motion";

const CARD_WIDTH = 260;

function CatalogCard({
  project,
  isActive,
  onFocus,
  index,
}: {
  project: (typeof catalogProjects)[number];
  isActive: boolean;
  onFocus: () => void;
  index: number;
}) {
  return (
    <button
      type="button"
      data-catalog-index={index}
      onClick={onFocus}
      className="group shrink-0 snap-center focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`View ${project.title}`}
      aria-current={isActive ? "true" : undefined}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: CARD_WIDTH,
          height: Math.round(CARD_WIDTH * (4 / 3)),
          transform: isActive ? "scale(1.06)" : "scale(0.9)",
          opacity: isActive ? 1 : 0.42,
        }}
      >
        <Image
          src={project.image}
          alt=""
          fill
          sizes="260px"
          className="object-cover"
          priority={index < 2}
        />
      </div>
    </button>
  );
}

export default function ProjectCatalog() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveFromScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const centerX = scrollerRect.left + scrollerRect.width / 2;
    const cards = scroller.querySelectorAll<HTMLElement>("[data-catalog-index]");

    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const index = Number(card.dataset.catalogIndex);
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(centerX - cardCenterX);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const card = scroller.querySelector<HTMLElement>(`[data-catalog-index="${index}"]`);
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateActiveFromScroll();
    scroller.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaY) < 1) return;
      event.preventDefault();
      scroller.scrollLeft += event.deltaY;
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      scroller.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
      scroller.removeEventListener("wheel", onWheel);
    };
  }, [updateActiveFromScroll]);

  const active = catalogProjects[activeIndex];

  return (
    <div className="bg-background">
      <section className="flex min-h-screen flex-col pt-20 md:pt-24" aria-label="Project catalog">
        <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 md:px-10 md:pb-10">
          <p
            className="font-sans font-medium text-foreground"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
            }}
          >
            Brand systems built to lead.
          </p>
          <p className="mt-3 font-sans text-[0.65rem] uppercase tracking-[0.24em] text-foreground/45">
            Scroll horizontally to explore
          </p>
        </div>

        <div
          ref={scrollerRef}
          data-lenis-prevent
          className="catalog-scroller flex w-full min-w-0 touch-pan-x items-center gap-5 overflow-x-auto overflow-y-visible overscroll-x-contain pb-6 pt-2 md:gap-[1.25rem]"
          style={{
            scrollSnapType: "x mandatory",
            scrollPaddingInline: "max(1rem, calc(50vw - 8.125rem))",
            WebkitOverflowScrolling: "touch",
            paddingLeft: "max(1rem, calc(50vw - 8.125rem))",
            paddingRight: "max(1rem, calc(50vw - 8.125rem))",
          }}
        >
          {catalogProjects.map((project, i) => (
            <CatalogCard
              key={project.slug}
              project={project}
              index={i}
              isActive={i === activeIndex}
              onFocus={() => scrollToIndex(i)}
            />
          ))}
        </div>

        <div className="mt-auto border-t border-foreground/10 px-4 py-8 md:px-10 md:py-10">
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-6">
            <div className="min-w-0 flex-1">
              <motion.p
                key={active.category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: MOTION_EASE_SWIFT }}
                className="font-sans text-sm font-medium text-foreground"
              >
                {active.category}
              </motion.p>
              <motion.p
                key={active.description}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: MOTION_EASE_SWIFT, delay: 0.04 }}
                className="mt-3 max-w-md font-sans text-[0.85rem] leading-relaxed text-foreground/55"
              >
                {active.description}
              </motion.p>
            </div>

            <div className="flex shrink-0 items-end gap-4 md:gap-6">
              <div
                className="flex h-[7.5rem] flex-col items-center justify-center overflow-hidden rounded-full border border-foreground/15 px-3 md:h-[8.5rem] md:px-3.5"
                aria-label="Project index"
              >
                <div
                  className="flex flex-col items-center transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateY(${((catalogProjects.length - 1) / 2 - activeIndex) * 1.75}rem)`,
                  }}
                >
                  {catalogProjects.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className={`font-sans text-[0.65rem] tabular-nums leading-[1.75rem] transition-colors md:text-xs md:leading-[1.85rem] ${
                        i === activeIndex
                          ? "font-medium text-foreground"
                          : "text-foreground/30 hover:text-foreground/55"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden h-[8.5rem] w-[min(14rem,28vw)] overflow-hidden md:block">
                <div
                  className="flex flex-col transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateY(${-activeIndex * 2.35}rem)`,
                  }}
                >
                  {catalogProjects.map((project, i) => (
                    <button
                      key={project.slug}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className={`h-[2.35rem] truncate text-left font-sans text-[0.72rem] leading-[2.35rem] transition-colors ${
                        i === activeIndex
                          ? "font-medium text-foreground"
                          : "text-foreground/28 hover:text-foreground/50"
                      }`}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-lg text-center font-sans text-sm font-medium text-foreground md:hidden">
            {active.title}
          </p>
        </div>
      </section>

      <section className="border-t border-foreground/10 px-4 py-16 md:px-12 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-foreground/55">Next step</p>
            <h2
              className="mt-3 font-sans font-medium text-foreground"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "-0.02em" }}
            >
              Ready to start a project?
            </h2>
          </div>
          <Link
            href="/#contact"
            className="inline-flex rounded-full bg-foreground px-6 py-3 font-sans text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-85"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
