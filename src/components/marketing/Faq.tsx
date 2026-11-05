import Reveal from "@/components/ui/Reveal";
import { FAQ } from "@/data/studio";

export default function Faq() {
  return (
    <section className="pb-24 md:pb-36">
      <div className="wrap grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <Reveal>
          <h2 className="h-section">
            Questions,
            <br />
            answered.
          </h2>
        </Reveal>
        <div className="border-t">
          {FAQ.map((item) => (
            <details key={item.q} className="faq group border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.05rem] font-semibold tracking-[-0.01em] md:text-[1.1rem]">
                {item.q}
                <span aria-hidden className="relative h-3 w-3 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 ease-swift group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[34rem] pb-5 text-[0.98rem] leading-[1.55] text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
