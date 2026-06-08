import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-foreground/45">
        404
      </p>
      <h1
        className="mt-4 font-sans font-medium text-foreground"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
      >
        Page not found
      </h1>
      <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-foreground/60">
        This page doesn&apos;t exist or may have moved. Head back to Lumetic to explore our work and
        services.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex rounded-full bg-foreground px-6 py-3 font-sans text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-85"
        >
          Back to home
        </Link>
        <Link
          href="/work"
          className="inline-flex rounded-full border border-foreground/15 px-6 py-3 font-sans text-sm font-medium tracking-wide text-foreground transition-colors hover:border-foreground/30"
        >
          View work
        </Link>
      </div>
    </main>
  );
}
