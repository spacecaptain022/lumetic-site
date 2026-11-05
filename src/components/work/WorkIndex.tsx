"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/BlockLink";
import { WorkCard } from "@/components/marketing/Work";
import { catalogProjects } from "@/data/catalogProjects";

type View = "grid" | "index";

/** Work catalog: filter by discipline, switch between a visual grid and a scannable index. */
export default function WorkIndex() {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<View>("grid");
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    catalogProjects.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [["All", catalogProjects.length] as const, ...Array.from(counts.entries())];
  }, []);

  const visible = catalogProjects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => filter === "All" || project.category === filter);

  // Index view: a preview image follows the pointer.
  useEffect(() => {
    if (view !== "index") return;
    const el = previewRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const tick = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx + 28}px, ${cy - 120}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [view]);

  return (
    <section className="wrap pb-20 pt-[calc(var(--nav-h)+2.5rem)] md:pb-32 md:pt-[calc(var(--nav-h)+4rem)]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        <p className="label md:col-span-3">Work / {catalogProjects.length} projects</p>
        <h1 className="h-big md:col-span-9">Brand systems built to lead.</h1>
      </div>

      <div className="sticky top-0 z-20 -mx-[var(--gutter)] mt-12 border-b bg-paper/92 px-[var(--gutter)] py-3 backdrop-blur-md md:mt-16">
        <div className="flex items-center justify-between gap-4">
          <div role="group" aria-label="Filter by discipline" className="-my-1 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
            {categories.map(([name, count]) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
                className={`flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-[0.9rem] transition-colors duration-200 ${
                  filter === name ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
                }`}
              >
                {name}
                <span className="label opacity-60">{count}</span>
              </button>
            ))}
          </div>
          <div role="group" aria-label="Layout" className="hidden shrink-0 rounded-md border border-ink/20 p-0.5 sm:flex">
            {(["grid", "index"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`label h-8 rounded-[2px] px-3 transition-colors ${view === v ? "bg-ink text-paper" : "hover:bg-ink/5"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <ul className="mt-6 grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-2 md:mt-8 lg:grid-cols-3">
          {visible.map(({ project, index }) => (
            <li key={project.slug}>
              <WorkCard project={project} index={index} sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw" />
              <p className="mt-3 max-w-[34rem] px-1 text-[0.92rem] leading-[1.5] text-ink/65">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul className="mt-6 border-t md:mt-8" onMouseLeave={() => setHovered(null)}>
            {visible.map(({ project, index }) => (
              <li key={project.slug} className="border-b">
                <Link
                  href={`/work/${project.slug}`}
                  onMouseEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-12 md:gap-8"
                >
                  <span className="label opacity-60 md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[clamp(1.5rem,2.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-transform duration-500 ease-swift group-hover:translate-x-2 md:col-span-6">
                    {project.title}
                  </span>
                  <span className="label hidden opacity-70 md:col-span-2 md:block">{project.category}</span>
                  <span className="hidden text-[0.9rem] leading-snug text-ink/70 lg:col-span-2 lg:block">
                    {project.description.split(".")[0]}.
                  </span>
                  <span className="justify-self-end md:col-span-1 md:col-start-12">
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div
            ref={previewRef}
            aria-hidden
            className={`pointer-events-none fixed left-0 top-0 z-30 hidden h-60 w-60 overflow-hidden rounded-[12px] transition-opacity duration-300 md:block ${
              hovered === null ? "opacity-0" : "opacity-100"
            }`}
          >
            {catalogProjects.map((p, i) => (
              <Image
                key={p.slug}
                src={p.image}
                alt=""
                fill
                sizes="240px"
                className={`object-cover ${hovered === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
