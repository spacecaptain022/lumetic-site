/**
 * Switches for features that are built but not public yet.
 * Each reads a Vercel environment variable; set it to "true" and redeploy to turn the feature on.
 */

/** "Resolve your brand" (/resolve): the name-to-image lead magnet. Off unless RESOLVE_ENABLED=true. */
export function isResolveEnabled(): boolean {
  return process.env.RESOLVE_ENABLED === "true";
}
