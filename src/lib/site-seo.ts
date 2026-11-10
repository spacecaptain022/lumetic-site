import { FAQ } from "@/data/studio";
import { allWorkProjects } from "@/lib/projects";

export const SITE_URL = "https://www.lumetic.io";
export const SITE_NAME = "Lumetic";
export const SITE_TAGLINE = "Clarity over noise.";

/** Short copy for link previews (Open Graph, X), which crop anything long. */
export const SHARE_TITLE = `${SITE_NAME} · Autonomous by design`;
export const SHARE_DESCRIPTION = "Imagine it. Lumetic builds it. Then it runs on its own.";

/** Search result title for the home page: the brand line plus what Lumetic makes. */
export const HOME_TITLE = `${SHARE_TITLE} | Brands, Websites & Systems`;

/** 1200×630 share card. Child pages that set their own openGraph must include it again. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Lumetic, autonomous by design. Imagine it. Lumetic builds it. Then it runs on its own.",
} as const;
export const SITE_DESCRIPTION =
  "Lumetic is an autonomous, agentic builder. Bring it the idea or the problem, and it designs and builds the solution: brands, websites and online stores, motion, custom software, and systems that run on their own.";

export const SITE_KEYWORDS = [
  "design and build studio",
  "custom solutions",
  "autonomous systems",
  "branding studio",
  "brand identity",
  "brand strategy",
  "brand systems",
  "web design",
  "e-commerce design",
  "Shopify design",
  "Shopify development",
  "online store design",
  "packaging design",
  "digital design",
  "motion design",
  "visual identity",
  "Web3 design",
  "agentic systems",
  "autonomous agents",
  "business automation",
  "workflow automation",
  "custom software development",
  "Lumetic",
  "Lumetic Studio",
] as const;

export const SITE_SOCIAL = {
  x: "https://x.com/LumeticStudio",
  email: "hello@lumetic.io",
} as const;

export const SITE_SERVICES = [
  {
    name: "Brand Identity & Strategy",
    description:
      "Memorable identities built to last. Strategy, naming, packaging, and systems that stay clear everywhere you show up.",
  },
  {
    name: "Web Design & E-commerce",
    description:
      "Sites and online stores with UX, performance, and craft. Shopify or custom, built to turn visitors into customers.",
  },
  {
    name: "Motion & Visual Content",
    description:
      "Product visuals, animation, and launch content that bring your brand to life and help it sell on every channel.",
  },
  {
    name: "Autonomous Systems & Software",
    description:
      "Agents, automations, and custom software built around how you work, plus Web3 when it fits. Lumetic builds it, then keeps it running.",
  },
] as const;

export const SITE_FACTS = {
  founded: 2025,
  brandSystemsDelivered: "30+",
  industriesServed: "6+",
  bespokeWork: "100%",
  positioning:
    "An autonomous, agentic builder that turns ideas into working things, from the first sketch to systems that run on their own.",
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Lumetic Studio",
    url: SITE_URL,
    logo: `${SITE_URL}/Lumetic%20logo%20black%20no%20text.png`,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    foundingDate: String(SITE_FACTS.founded),
    email: SITE_SOCIAL.email,
    sameAs: [SITE_SOCIAL.x],
    knowsAbout: SITE_SERVICES.map((service) => service.name),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    email: SITE_SOCIAL.email,
    areaServed: "Worldwide",
    serviceType: SITE_SERVICES.map((service) => service.name),
    provider: { "@id": `${SITE_URL}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lumetic Services",
      itemListElement: SITE_SERVICES.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      })),
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function llmsTxt() {
  return `# Lumetic
> ${SITE_TAGLINE}

## About
${SITE_DESCRIPTION}

${SITE_FACTS.positioning}

## Services
${SITE_SERVICES.map((service) => `- **${service.name}**: ${service.description}`).join("\n")}

## Facts
- Founded: ${SITE_FACTS.founded}
- Projects delivered: ${SITE_FACTS.brandSystemsDelivered}
- Industries served: ${SITE_FACTS.industriesServed}
- Client work: ${SITE_FACTS.bespokeWork} bespoke

## Contact
- Email: ${SITE_SOCIAL.email}
- Website: ${SITE_URL}
- X: ${SITE_SOCIAL.x}

## Pages
- Home: ${SITE_URL}/
- Work: ${SITE_URL}/work
- Contact: ${SITE_URL}/#contact
- Intake: ${SITE_URL}/intake

## Selected work
${allWorkProjects.map((project) => `- ${project.title}: ${SITE_URL}/work/${project.slug}`).join("\n")}
`;
}
