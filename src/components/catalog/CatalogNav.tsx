"use client";

import Image from "next/image";
import Link from "next/link";
import LinkCharShift from "@/components/layout/LinkCharShift";

const links = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/work", active: true },
  { label: "Contact", href: "/#contact" },
] as const;

export default function CatalogNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-background/80 px-4 py-4 backdrop-blur-md md:px-10">
      <Link href="/" className="opacity-90 transition-opacity hover:opacity-100" aria-label="Lumetic home">
        <Image src="/Lumetic logo black no text.png" alt="" width={24} height={24} />
      </Link>

      <nav className="flex items-center gap-6 md:gap-10" aria-label="Catalog">
        {links.map((link) => (
          <LinkCharShift
            key={link.href}
            href={link.href}
            className={`text-[10px] uppercase tracking-[0.2em] font-sans font-medium ${
              "active" in link && link.active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
            }`}
          >
            {link.label}
          </LinkCharShift>
        ))}
      </nav>
    </header>
  );
}
