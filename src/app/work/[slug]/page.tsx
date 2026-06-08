import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CatalogNav from "@/components/catalog/CatalogNav";
import { SITE_NAME, SITE_URL } from "@/lib/site-seo";
import { getAllWorkSlugs, getWorkProject, projectImageAlt } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) return {};

  const title = `${project.title} — ${project.category}`;
  const description = `${project.description} Brand and design work by Lumetic Studio.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/work/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/work/${slug}`,
      images: [{ url: project.image, alt: projectImageAlt(project) }],
    },
  };
}

export default async function WorkProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: `${SITE_URL}${project.image}`,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    genre: project.categories.join(", "),
    url: `${SITE_URL}/work/${slug}`,
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CatalogNav />

      <article className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-12 md:pt-32">
        <Link
          href="/work"
          className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-foreground/45 transition-colors hover:text-foreground/70"
        >
          ← All work
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/[0.04]">
            <Image
              src={project.image}
              alt={projectImageAlt(project)}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-foreground/55">
              {project.category}
            </p>
            <h1
              className="mt-4 font-sans font-medium text-foreground"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              {project.title}
            </h1>
            <p className="mt-6 max-w-prose font-sans text-[0.95rem] leading-relaxed text-foreground/70">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.categories.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-foreground/10 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-[0.18em] text-foreground/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="inline-flex rounded-full bg-foreground px-6 py-3 font-sans text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-85"
              >
                Start a project
              </Link>
              <Link
                href="/work"
                className="inline-flex rounded-full border border-foreground/15 px-6 py-3 font-sans text-sm font-medium tracking-wide text-foreground transition-colors hover:border-foreground/30"
              >
                View more work
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
