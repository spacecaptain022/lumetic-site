import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy | Lumetic",
  description: "How Lumetic Studio LLC collects, uses, and protects your information.",
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

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <h1
        className="mb-3 font-sans font-medium text-foreground"
        style={{ fontSize: "clamp(2rem, 6vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
      >
        Privacy Policy
      </h1>
      <p className="font-sans text-xs text-foreground/50 mb-12">
        Effective May 29, 2026 · Lumetic Studio LLC
      </p>

      <Section title="Overview">
        <p>
          Lumetic Studio LLC (&quot;Lumetic,&quot; &quot;we,&quot; &quot;us&quot;) respects your privacy.
          This policy explains what information we collect when you visit lumetic.io, use our contact
          forms, or participate in our client intake experience, and how we use it.
        </p>
      </Section>

      <Section title="Information We Collect">
        <p>
          <strong className="text-foreground/85 font-medium">Information you provide.</strong> When
          you submit our contact form, quick contact form, or AI intake flow, we may collect your
          name, email address, service interest, message content, and any details you share during
          the intake conversation.
        </p>
        <p>
          <strong className="text-foreground/85 font-medium">Automatically collected data.</strong>{" "}
          Like most websites, we may receive basic technical information such as browser type, device
          type, pages visited, and referring URL through our hosting and analytics providers.
        </p>
      </Section>

      <Section title="How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Respond to inquiries and project requests</li>
          <li>Generate and review client intake briefs</li>
          <li>Communicate with you about Lumetic services</li>
          <li>Improve our website and client experience</li>
          <li>Maintain the security and reliability of our site</li>
        </ul>
      </Section>

      <Section title="Third-Party Services">
        <p>
          We use trusted third-party providers to operate parts of our site, including email delivery
          (Resend), AI-assisted intake (Anthropic), and website hosting. These providers process data
          on our behalf according to their own privacy policies and applicable agreements.
        </p>
        <p>
          We do not sell your personal information to third parties.
        </p>
      </Section>

      <Section title="Data Retention">
        <p>
          We retain contact and intake information for as long as needed to respond to your inquiry,
          evaluate potential projects, and maintain business records, unless a longer retention period
          is required by law.
        </p>
      </Section>

      <Section title="Your Choices">
        <p>
          You may request access to, correction of, or deletion of personal information we hold about
          you by contacting us at{" "}
          <a href="mailto:hello@lumetic.io" className="text-foreground/85 underline underline-offset-2 hover:text-foreground">
            hello@lumetic.io
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Our site may use essential cookies and similar technologies required for basic functionality.
          We do not use cookies for third-party advertising purposes.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may update this policy from time to time. The effective date at the top of this page
          will reflect the latest revision. Continued use of the site after changes constitutes
          acceptance of the updated policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:hello@lumetic.io" className="text-foreground/85 underline underline-offset-2 hover:text-foreground">
            hello@lumetic.io
          </a>
          .
        </p>
      </Section>
    </LegalPageShell>
  );
}
