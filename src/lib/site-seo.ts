export const SITE_URL = "https://www.lumetic.io";
export const SITE_NAME = "Lumetic";
export const SITE_TAGLINE = "Clarity over noise.";
export const SITE_DESCRIPTION =
  "Lumetic is a branding studio blending strategy and creative craft. We build brand identity systems, web design, motion, and Web3/AI development for forward-thinking companies.";

export const SITE_KEYWORDS = [
  "branding studio",
  "brand identity",
  "brand strategy",
  "brand systems",
  "web design",
  "digital design",
  "motion design",
  "visual identity",
  "Web3 design",
  "AI development",
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
      "Memorable identities built to last. Strategy, naming, and systems that stay clear everywhere you show up.",
  },
  {
    name: "Web Design & Digital Presence",
    description:
      "Intuitive sites with UX, performance, and craft. Fast, confident, and built to turn visitors into believers.",
  },
  {
    name: "Motion & Visual Content",
    description:
      "Visuals, animation, and content that bring your brand to life. Intentional motion on every channel.",
  },
  {
    name: "Web3, AI & Dev Services",
    description:
      "Web3, AI, and contracts: integration, deployment, and setup. Tools that fit how you already work.",
  },
] as const;

export const SITE_FACTS = {
  founded: 2025,
  brandSystemsDelivered: "30+",
  industriesServed: "6+",
  bespokeWork: "100%",
  positioning:
    "A studio of strategists and designers bringing distinctive brand systems to life through clarity, craft, and intentional design.",
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
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Lumetic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lumetic is a branding studio that blends strategy and creative craft to build brand identity systems, web design, motion, and Web3/AI development for forward-thinking companies.",
        },
      },
      {
        "@type": "Question",
        name: "What services does Lumetic offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lumetic offers Brand Identity & Strategy, Web Design & Digital Presence, Motion & Visual Content, and Web3, AI & Dev Services.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact Lumetic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact Lumetic at hello@lumetic.io or through the contact form at lumetic.io. The studio responds within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "What is Lumetic's tagline?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Clarity over noise.",
        },
      },
    ],
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
- Brand systems delivered: ${SITE_FACTS.brandSystemsDelivered}
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
`;
}
