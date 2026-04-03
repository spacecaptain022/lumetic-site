/** Single source for Explore-more cards + contact form “Service” dropdown (same order and titles). */

export const exploreServices = [
  {
    title: "Web3, AI & Dev Services",
    titleLines: ["WEB3", "AI DEV", "SERVICES"] as const,
    description:
      "Web3, AI, and contracts: integration, deployment, and setup. Tools that fit how you already work.",
    image: "/Card 4 graphic.png",
    exp: "EXP 001",
    year: "2026",
    tags: ["WEB3", "AI", "DEV"],
  },
  {
    title: "Brand Identity & Strategy",
    titleLines: ["BRAND", "IDENTITY", "& STRATEGY"] as const,
    description:
      "Memorable identities built to last. Strategy, naming, and systems that stay clear everywhere you show up.",
    image: "/Card 1 graphic.jpg",
    exp: "EXP 002",
    year: "2026",
    tags: ["BRAND", "IDENTITY", "SYSTEMS"],
  },
  {
    title: "Web Design & Digital Presence",
    titleLines: ["WEB DESIGN", "& DIGITAL", "PRESENCE"] as const,
    description:
      "Intuitive sites with UX, performance, and craft. Fast, confident, and built to turn visitors into believers.",
    image: "/Card 2 graphic.jpg",
    exp: "EXP 003",
    year: "2026",
    tags: ["WEB", "UX", "DIGITAL"],
  },
  {
    title: "Motion & Visual Content",
    titleLines: ["MOTION", "& VISUAL", "CONTENT"] as const,
    description:
      "Visuals, animation, and content that bring your brand to life. Intentional motion on every channel.",
    image: "/Card 3 graphic.jpg",
    exp: "EXP 004",
    year: "2026",
    tags: ["MOTION", "CONTENT", "VISUAL"],
  },
] as const;
