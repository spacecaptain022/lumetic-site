/** Single source for Explore-more cards + contact form “Service” dropdown (same order and titles). */

export const exploreServices = [
  {
    title: "Brand Identity & Strategy",
    titleLines: ["BRAND", "IDENTITY", "& STRATEGY"] as const,
    description:
      "Memorable identities built to last. Strategy, naming, packaging, and systems that stay clear everywhere you show up.",
    image: "/Card 1 graphic.jpg",
    exp: "EXP 002",
    year: "2026",
    tags: ["BRAND", "IDENTITY", "SYSTEMS"],
  },
  {
    title: "Web Design & E-commerce",
    titleLines: ["WEB DESIGN", "& E-COM-", "MERCE"] as const,
    description:
      "Sites and online stores with UX, performance, and craft. Shopify or custom, built to turn visitors into customers.",
    image: "/Card 2 graphic.jpg",
    exp: "EXP 003",
    year: "2026",
    tags: ["WEB", "E-COMMERCE", "UX"],
  },
  {
    title: "Motion & Visual Content",
    titleLines: ["MOTION", "& VISUAL", "CONTENT"] as const,
    description:
      "Product visuals, animation, and launch content that bring your brand to life and help it sell on every channel.",
    image: "/Card 3 graphic.jpg",
    exp: "EXP 004",
    year: "2026",
    tags: ["MOTION", "CONTENT", "VISUAL"],
  },
  {
    title: "AI Systems & Custom Software",
    titleLines: ["AI SYSTEMS", "& CUSTOM", "SOFTWARE"] as const,
    description:
      "AI agents, automations, and custom software built around how you work, plus Web3 when it fits. We build it and keep it running.",
    image: "/card-4-graphic.webp",
    exp: "EXP 001",
    year: "2026",
    tags: ["AI", "SOFTWARE", "WEB3"],
  },
] as const;
