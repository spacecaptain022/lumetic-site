export type CatalogProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

export const catalogProjects: CatalogProject[] = [
  {
    slug: "digital-collage",
    title: "Digital Collage Systems",
    category: "Identity",
    description:
      "Layered visual worlds that merge craft and technology into a single, unmistakable brand language.",
    image: "/catalog/01-computer.png",
  },
  {
    slug: "surveillance-narrative",
    title: "Surveillance & Narrative",
    category: "Campaign",
    description:
      "Bold conceptual systems built to provoke attention and hold meaning across every touchpoint.",
    image: "/catalog/02-systems.png",
  },
  {
    slug: "modular-toolkit",
    title: "Modular Brand Toolkit",
    category: "Systems",
    description:
      "Flexible identity components designed to scale across product, print, and environmental applications.",
    image: "/catalog/03-modular.png",
  },
  {
    slug: "industrial-craft",
    title: "Industrial Craft",
    category: "Print",
    description:
      "High-contrast graphic language rooted in precision, texture, and editorial confidence.",
    image: "/catalog/04-engineering.png",
  },
  {
    slug: "tech-landscape",
    title: "Tech Landscape",
    category: "Digital",
    description:
      "Digital-first brand worlds where infrastructure and imagination share the same visual frame.",
    image: "/catalog/05-circuit.png",
  },
  {
    slug: "spatial-experience",
    title: "Spatial Experience",
    category: "Environment",
    description:
      "Immersive spatial concepts that translate identity into place, rhythm, and memorable atmosphere.",
    image: "/catalog/06-spatial.png",
  },
  {
    slug: "urban-identity",
    title: "Urban Identity",
    category: "Identity",
    description:
      "City-scale brand expression with selective color, structure, and architectural clarity.",
    image: "/catalog/07-cityscape.png",
  },
  {
    slug: "atmospheric-campaign",
    title: "Atmospheric Campaign",
    category: "Motion",
    description:
      "Cinematic brand atmospheres built for campaigns that need depth, contrast, and emotional pull.",
    image: "/catalog/08-horizon.png",
  },
];
