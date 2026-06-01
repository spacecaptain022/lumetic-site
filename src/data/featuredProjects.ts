export type FeaturedProject = {
  slug: string;
  title: string;
  excerpt: string;
  categories: string[];
  image: string;
  aspect: "16x9" | "4x3" | "square";
  column: "left" | "right";
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "web3-ai-dev-services",
    title: "Web3 AI Dev Services",
    excerpt:
      "Web3, AI, and contracts: integration, deployment, and setup. Tools that fit how you already work.",
    categories: ["Web3", "AI", "Dev"],
    image: "/gallery/web3-ai-dev.png",
    aspect: "16x9",
    column: "left",
  },
  {
    slug: "web-design-digital-presence",
    title: "Web Design & Digital Presence",
    excerpt:
      "Intuitive sites with UX, performance, and craft. Fast, confident, and built to turn visitors into believers.",
    categories: ["Web", "UX", "Digital"],
    image: "/gallery/web-design-digital-v2.png",
    aspect: "4x3",
    column: "left",
  },
  {
    slug: "brand-identity-strategy",
    title: "Brand Identity & Strategy",
    excerpt:
      "Memorable identities built to last. Strategy, naming, and systems that stay clear everywhere you show up.",
    categories: ["Brand", "Identity", "Systems"],
    image: "/gallery/brand-identity.png",
    aspect: "16x9",
    column: "right",
  },
  {
    slug: "motion-visual-content",
    title: "Motion & Visual Content",
    excerpt:
      "Visuals, animation, and content that bring your brand to life. Intentional motion on every channel.",
    categories: ["Motion", "Content", "Visual"],
    image: "/gallery/motion-visual-v2.png",
    aspect: "square",
    column: "right",
  },
];
