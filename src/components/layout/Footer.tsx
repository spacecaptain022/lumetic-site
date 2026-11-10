import Link from "next/link";
import Mark from "@/components/ui/Mark";
import { isResolveEnabled } from "@/lib/features";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  ...(isResolveEnabled() ? [{ label: "Resolve your brand", href: "/resolve" }] : []),
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap grid grid-cols-1 gap-14 pb-8 pt-16 md:grid-cols-2 md:gap-8 md:pt-24">
        <div className="flex flex-col justify-between gap-10">
          <Mark className="h-24 w-auto self-start md:h-32" />
          <p className="max-w-[26rem] text-[0.95rem] leading-[1.5] text-paper/70">
            Lumetic is a studio and venture firm that builds whatever you can imagine: brands, websites
            and online stores, motion, custom software, and AI systems that run on their own.
          </p>
        </div>

        <div>
          <nav aria-label="Footer">
            <ul className="border-t border-paper/15">
              {NAV.map((item) => (
                <li key={item.label} className="border-b border-paper/15">
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between py-2.5 text-[clamp(1.75rem,2.6vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em]"
                  >
                    <span className="transition-transform duration-500 ease-swift group-hover:translate-x-2">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.92rem] text-paper/70">
            <a href="mailto:hello@lumetic.io" className="hover:text-paper">
              hello@lumetic.io
            </a>
            <a href="https://x.com/LumeticStudio" target="_blank" rel="noopener noreferrer" className="hover:text-paper">
              X / @LumeticStudio
            </a>
            <Link href="/privacy" className="hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-paper">
              Terms
            </Link>
          </div>
        </div>
      </div>
      <div className="wrap label flex items-center justify-between border-t border-paper/15 py-5 text-paper/55">
        <p>© 2026 Lumetic LLC.</p>
        <p>USA / Hong Kong</p>
      </div>
    </footer>
  );
}
