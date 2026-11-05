import Reveal from "@/components/ui/Reveal";

/** Two-line section title on the left, a bracketed tag and a short line on the right. */
export default function SectionHead({
  title,
  tag,
  note,
  id,
  as: Tag = "h2",
}: {
  title: [string, string];
  tag: string;
  note?: string;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <Reveal>
        <Tag id={id} className="h-section">
          {title[0]}
          <br />
          {title[1]}
        </Tag>
      </Reveal>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="label-mono">{`(    ${tag}    )`}</p>
        {note && <p className="label mt-1.5 opacity-70">{note}</p>}
      </div>
    </div>
  );
}
