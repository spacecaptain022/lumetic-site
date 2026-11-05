import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import BlockLink, { Arrow } from "@/components/ui/BlockLink";
import ResolveImage from "@/components/ui/ResolveImage";
import { exploreServices } from "@/data/exploreServices";
import { contactHref } from "@/lib/contact-prefill";
import { allWorkProjects, getAllWorkSlugs, getWorkProject, projectImageAlt } from "@/lib/projects";
import { SITE_NAME, SITE_URL } from "@/lib/site-seo";

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

  const position = allWorkProjects.findIndex((p) => p.slug === slug);
  const next = allWorkProjects[(position + 1) % allWorkProjects.length];
  const more = allWorkProjects
    .filter((p) => p.slug !== slug && p.slug !== next.slug && p.source === project.source)
    .slice(0, 3);

  // Service pages pre-select their service in the contact form.
  const service =
    project.source === "featured"
      ? exploreServices.find((s) => s.tags.includes(project.categories[0]?.toUpperCase() as never))
          ?.title
      : undefined;

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
    <>
      <SiteNav />
      <main id="main" className="bg-paper">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="wrap pb-20 pt-[calc(var(--nav-h)+2rem)] md:pb-28 md:pt-[calc(var(--nav-h)+3rem)]">
          <nav aria-label="Breadcrumb" className="label flex items-center gap-2 opacity-70">
            <Link href="/work" className="hover:opacity-100">
              Work
            </Link>
            <span aria-hidden>/</span>
            <span>{project.category}</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
                <h1 className="h-big">{project.title}</h1>
                <p className="lede mt-6 max-w-[30rem]">{project.description}</p>

                <dl className="mt-10 grid grid-cols-2 border-t">
                  <div className="border-b py-4 pr-4">
                    <dt className="label opacity-70">Discipline</dt>
                    <dd className="mt-1.5 text-[1rem] font-medium">{project.category}</dd>
                  </div>
                  <div className="border-b py-4">
                    <dt className="label opacity-70">Focus</dt>
                    <dd className="mt-1.5 text-[1rem] font-medium">{project.categories.join(", ")}</dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <BlockLink href={contactHref({ service })}>Start a project</BlockLink>
                  <Link href="/work" className="group text-[0.95rem] font-medium">
                    <span className="link-line">All work</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-square overflow-hidden rounded-[16px] lg:aspect-[4/3]">
                <ResolveImage
                  src={project.image}
                  alt={projectImageAlt(project)}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </article>

        <section className="border-t">
          <Link href={`/work/${next.slug}`} className="group wrap grid grid-cols-1 items-center gap-6 py-12 md:grid-cols-12 md:gap-8 md:py-16">
            <span className="label md:col-span-3">Next project</span>
            <span className="h-section md:col-span-6">
              <span className="link-line">{next.title}</span>
            </span>
            <span className="relative hidden aspect-square w-full max-w-[9rem] justify-self-end overflow-hidden rounded-[12px] md:col-span-3 md:block">
              <Image src={next.image} alt="" fill sizes="144px" className="object-cover transition-transform duration-700 ease-swift group-hover:scale-105" />
            </span>
          </Link>
        </section>

        {more.length > 0 && (
          <section className="border-t">
            <div className="wrap py-14 md:py-20">
              <p className="label mb-8">More work</p>
              <ul className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3 lg:gap-x-6">
                {more.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/work/${p.slug}`} className="group block">
                      <span className="relative block aspect-square overflow-hidden rounded-[16px] bg-card">
                        <Image
                          src={p.image}
                          alt={projectImageAlt(p)}
                          fill
                          sizes="(min-width: 640px) 31vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.03]"
                        />
                      </span>
                      <span className="mt-4 flex items-center justify-between gap-4 text-[1.2rem] font-medium tracking-[-0.02em]">
                        <span className="link-line">{p.title}</span>
                        <Arrow />
                      </span>
                      <span className="label mt-1 block opacity-70">{p.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
