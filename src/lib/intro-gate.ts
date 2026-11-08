/** Shared by the server-rendered gate script and the client intro, so no React here. */
export const INTRO_SEEN_KEY = "lumetic:intro";

/** Runs before first paint. Inlined as a string, so it must stay plain ES5. */
export const INTRO_GATE_SCRIPT = `try{var d=document.documentElement,r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=sessionStorage.getItem("${INTRO_SEEN_KEY}");d.dataset.intro=r||s?"skip":"play"}catch(e){document.documentElement.dataset.intro="skip"}`;
