import { catalogProjects } from "@/data/catalogProjects";
import { featuredProjects } from "@/data/featuredProjects";

export type WorkProject = {
  slug: string;
  title: string;
  category: string;
  categories: string[];
  description: string;
  image: string;
  source: "featured" | "catalog";
};

function toWorkProject(
  project: (typeof featuredProjects)[number],
  source: "featured"
): WorkProject {
  return {
    slug: project.slug,
    title: project.title,
    category: project.categories[0] ?? "Work",
    categories: [...project.categories],
    description: project.excerpt,
    image: project.image,
    source,
  };
}

function catalogToWorkProject(project: (typeof catalogProjects)[number]): WorkProject {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    categories: [project.category],
    description: project.description,
    image: project.image,
    source: "catalog",
  };
}

const featuredWork = featuredProjects.map((project) => toWorkProject(project, "featured"));
const catalogWork = catalogProjects.map(catalogToWorkProject);

export const allWorkProjects: WorkProject[] = [
  ...featuredWork,
  ...catalogWork.filter((project) => !featuredWork.some((item) => item.slug === project.slug)),
];

export function getWorkProject(slug: string): WorkProject | undefined {
  return allWorkProjects.find((project) => project.slug === slug);
}

export function getAllWorkSlugs(): string[] {
  return allWorkProjects.map((project) => project.slug);
}

export function projectImageAlt(project: Pick<WorkProject, "title" | "category" | "categories">): string {
  const tags = project.categories.length > 0 ? project.categories.join(", ") : project.category;
  return `${project.title} — ${tags} project by Lumetic`;
}
