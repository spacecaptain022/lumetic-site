import Mark from "@/components/ui/Mark";
import SectionHead from "@/components/ui/SectionHead";

export default function About() {
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap">
        <SectionHead title={["Lumetic", "today."]} tag="EST. 2025" note="USA / Hong Kong" />

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          <div className="flex min-h-[22rem] flex-col justify-between rounded-[16px] bg-ink p-6 text-paper lg:aspect-[3/4]">
            <div className="flex items-start gap-4">
              <p className="text-[clamp(3.5rem,5vw,5rem)] font-semibold leading-none tracking-[-0.045em]">30+</p>
              <p className="mt-1 max-w-[12rem] text-[0.9rem] leading-snug text-paper/70">
                Projects delivered for people building what comes next.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mark className="h-7 w-auto" />
              <p className="label text-paper/70">Bespoke work, every time</p>
            </div>
          </div>

          <div className="flex min-h-[22rem] flex-col justify-between rounded-[16px] bg-card p-6 sm:col-span-1 lg:col-span-1 lg:aspect-[3/4]">
            <p className="text-[clamp(1.25rem,1.6vw,1.55rem)] font-semibold leading-[1.2] tracking-[-0.02em]">
              We&apos;re builders, designers, and engineers. If you can imagine it, we can build it, from
              the first sketch to systems that run on their own.
            </p>
            <p className="label opacity-60">Lumetic Studio</p>
          </div>

          {[
            { value: "6+", label: "Industries served", note: "From Web3 and AI to consumer goods and e-commerce." },
            { value: "100%", label: "Bespoke client work", note: "No templates. Everything built for one client and one problem." },
          ].map((stat) => (
            <div key={stat.label} className="flex min-h-[22rem] flex-col justify-between rounded-[16px] bg-card p-6 lg:aspect-[3/4]">
              <p className="label opacity-60">{stat.label}</p>
              <div>
                <p className="text-[clamp(3.5rem,5vw,5rem)] font-semibold leading-none tracking-[-0.045em]">{stat.value}</p>
                <p className="mt-3 max-w-[16rem] text-[0.95rem] leading-snug text-ink/70">{stat.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
