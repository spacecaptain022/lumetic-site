import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/BlockLink";

type LegalPageShellProps = {
  title: string;
  children: React.ReactNode;
};

export default function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="shrink-0 w-full px-6 py-4 md:px-12 border-b border-foreground/[0.07] flex items-center justify-between">
        <Link
          href="/"
          className="opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Back to Lumetic home"
        >
          <Image
            src="/Lumetic logo black no text.png"
            alt="Lumetic"
            width={22}
            height={22}
          />
        </Link>
        <p className="label text-foreground/55">
          {title}
        </p>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 md:py-16 md:px-8">
        {children}
      </main>

      <footer className="shrink-0 border-t border-foreground/[0.07] px-6 py-8 md:px-12">
        <Link
          href="/"
          className="label inline-flex items-center gap-1.5 text-foreground/55 hover:text-foreground transition-colors"
        >
          <Arrow dir="left" />
          Back to Lumetic
        </Link>
      </footer>
    </div>
  );
}
