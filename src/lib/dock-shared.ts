/** Brief fields and types shared by the dock UI and its server routes. No server-only imports here. */

export const BRIEF_FIELDS = [
  { key: "project", label: "Project" },
  { key: "need", label: "What they need" },
  { key: "audience", label: "Audience" },
  { key: "timeline", label: "Timeline" },
  { key: "engagement", label: "Best fit" },
] as const;

export type BriefKey = (typeof BRIEF_FIELDS)[number]["key"];
export type DockBrief = Record<BriefKey, string>;
export type DockMessage = { role: "user" | "assistant"; content: string };
export type DockTurn = { reply: string; brief: DockBrief; ready: boolean };

export const EMPTY_BRIEF: DockBrief = { project: "", need: "", audience: "", timeline: "", engagement: "" };
