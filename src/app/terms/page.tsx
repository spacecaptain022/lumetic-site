import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — Lumetic",
  description: "Terms governing use of the Lumetic website and services.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-4">
        {title}
      </h2>
      <div className="flex flex-col gap-4 font-sans text-sm text-foreground/70 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <h1
        className="font-display text-foreground uppercase mb-3"
        style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", letterSpacing: "0.03em", lineHeight: 0.95 }}
      >
        Terms of Service
      </h1>
      <p className="font-sans text-xs text-foreground/50 mb-12">
        Effective May 29, 2026 · Lumetic Studio LLC
      </p>

      <Section title="Agreement">
        <p>
          By accessing lumetic.io (the &quot;Site&quot;), you agree to these Terms of Service. If you
          do not agree, please do not use the Site. These terms apply to all visitors and users.
        </p>
      </Section>

      <Section title="Use of the Site">
        <p>You agree to use the Site only for lawful purposes. You may not:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Attempt to gain unauthorized access to our systems or data</li>
          <li>Interfere with the Site&apos;s operation or security</li>
          <li>Use automated tools to scrape or overload the Site without permission</li>
          <li>Submit false, misleading, or harmful information through our forms</li>
        </ul>
      </Section>

      <Section title="Services">
        <p>
          Lumetic provides branding, design, and related creative services. Information on the Site
          is for general purposes and does not constitute a binding offer. Any engagement with Lumetic
          is subject to a separate written agreement or statement of work.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          All content on the Site — including text, graphics, logos, images, and design — is owned
          by Lumetic Studio LLC or its licensors and is protected by applicable intellectual property
          laws. You may not copy, reproduce, or distribute Site content without our prior written
          consent.
        </p>
      </Section>

      <Section title="User Submissions">
        <p>
          When you submit information through our contact or intake forms, you represent that you
          have the right to share that information and that it is accurate to the best of your
          knowledge. You grant Lumetic a non-exclusive license to use submitted materials solely to
          evaluate and respond to your inquiry.
        </p>
      </Section>

      <Section title="AI Intake">
        <p>
          Our client intake experience may use AI-assisted tools to help structure project briefs.
          AI-generated summaries are provided for convenience and may require human review. Lumetic
          does not guarantee the accuracy or completeness of AI-generated content.
        </p>
      </Section>

      <Section title="Disclaimer">
        <p>
          The Site is provided &quot;as is&quot; without warranties of any kind, express or implied.
          We do not warrant that the Site will be uninterrupted, error-free, or free of harmful
          components.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Lumetic Studio LLC shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of the Site.
          Our total liability for any claim related to the Site shall not exceed one hundred U.S.
          dollars (USD $100).
        </p>
      </Section>

      <Section title="Governing Law">
        <p>
          These terms are governed by the laws of the United States and the State of Delaware,
          without regard to conflict-of-law principles. Any disputes shall be resolved in the courts
          located in Delaware, unless otherwise required by applicable law.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may revise these terms at any time. Updated terms will be posted on this page with a
          revised effective date. Your continued use of the Site after changes constitutes acceptance
          of the updated terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@lumetic.io" className="text-foreground/85 underline underline-offset-2 hover:text-foreground">
            hello@lumetic.io
          </a>
          .
        </p>
      </Section>
    </LegalPageShell>
  );
}
