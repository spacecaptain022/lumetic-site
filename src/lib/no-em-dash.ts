/**
 * House style: no em dashes. Prompts ask the model not to use them; this catches any that slip
 * through, turning "Welcome — we're glad" into "Welcome, we're glad".
 */
export function withoutEmDashes(text: string): string {
  return text
    .replace(/^\s*—\s*/gm, "")
    .replace(/\s*—\s*/g, ", ")
    .replace(/,\s*([.,!?;:])/g, "$1");
}
