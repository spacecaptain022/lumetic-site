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
    slug: "brand-identity-strategy",
    title: "Brand Identity & Strategy",
    excerpt:
      "Memorable identities built to last. Strategy, naming, packaging, and systems that stay clear everywhere you show up.",
    categories: ["Brand", "Identity", "Systems"],
    image: "/gallery/brand-identity.png",
    aspect: "16x9",
    column: "right",
  },
  {
    slug: "web-design-digital-presence",
    title: "Web Design & E-commerce",
    excerpt:
      "Sites and online stores with UX, performance, and craft. Shopify or custom, built to turn visitors into customers.",
    categories: ["Web", "E-commerce", "UX"],
    image: "/gallery/web-design-digital-v2.png",
    aspect: "4x3",
    column: "left",
  },
  {
    slug: "motion-visual-content",
    title: "Motion & Visual Content",
    excerpt:
      "Product visuals, animation, and launch content that bring your brand to life and help it sell on every channel.",
    categories: ["Motion", "Content", "Visual"],
    image: "/gallery/motion-visual-v2.png",
    aspect: "square",
    column: "right",
  },
  {
    slug: "web3-ai-dev-services",
    title: "Autonomous Systems & Software",
    excerpt:
      "Agents, automations, and custom software built around how you work, plus Web3 when it fits. Lumetic builds it, then keeps it running.",
    categories: ["Autonomous", "Software", "Web3"],
    image: "/gallery/web3-ai-dev.png",
    aspect: "16x9",
    column: "left",
  },
];
