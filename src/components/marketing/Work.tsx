import Link from "next/link";
import BlockLink, { Arrow } from "@/components/ui/BlockLink";
import ResolveImage from "@/components/ui/ResolveImage";
import SectionHead from "@/components/ui/SectionHead";
import { catalogProjects } from "@/data/catalogProjects";
import { projectImageAlt } from "@/lib/projects";

export function WorkCard({
  project,
  index,
  sizes = "(min-width: 768px) 48vw, 100vw",
}: {
  project: (typeof catalogProjects)[number];
  index: number;
  sizes?: string;
}) {
  return (
    <Link href={`/work/${project.slug}`} className="group relative block aspect-square overflow-hidden rounded-[16px] bg-card">
      <span className="absolute inset-0 transition-transform duration-[900ms] ease-swift group-hover:scale-[1.035]">
        <ResolveImage
          src={project.image}
          alt={projectImageAlt({ title: project.title, category: project.category, categories: [project.category] })}
          sizes={sizes}
        />
      </span>

      <span className="absolute left-3 top-3 flex items-start gap-4 rounded-[8px] bg-ink/25 px-3 py-2.5 text-paper backdrop-blur-md md:left-4 md:top-4">
        <span className="h-card">{project.title}</span>
        <span className="label mt-0.5 flex flex-col gap-0.5 opacity-80">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.category}</span>
        </span>
      </span>

      <span className="absolute bottom-3 left-3 flex translate-y-3 items-center gap-2 rounded-[8px] bg-paper px-3 py-2 text-[0.85rem] font-medium text-ink opacity-0 transition-[opacity,translate] duration-500 ease-swift group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:bottom-4 md:left-4">
        View project <Arrow />
      </span>
    </Link>
  );
}

export default function Work() {
  const featured = catalogProjects.slice(0, 4);
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap">
        <SectionHead title={["Selected", "work."]} tag="FEATURED" note="Identity, campaign, systems, print" />
        <ul className="mt-8 grid grid-cols-1 gap-3 md:mt-12 md:grid-cols-2">
          {featured.map((project, i) => (
            <li key={project.slug}>
              <WorkCard project={project} index={i} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center md:mt-10">
          <BlockLink href="/work">View all {catalogProjects.length} projects</BlockLink>
        </div>
      </div>
    </section>
  );
}
