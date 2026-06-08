import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "Project Intake",
  description:
    "Start your Lumetic project with a guided intake conversation. Share your brand goals, timeline, and ambitions.",
  alternates: { canonical: `${SITE_URL}/intake` },
  openGraph: {
    title: `Project Intake | ${SITE_NAME}`,
    description:
      "Start your Lumetic project with a guided intake conversation. Share your brand goals, timeline, and ambitions.",
    url: `${SITE_URL}/intake`,
  },
  robots: { index: true, follow: true },
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
