import IntroPlayer from "@/components/intro/IntroPlayer";
import { INTRO_GATE_SCRIPT } from "@/lib/intro-gate";

/**
 * The logo intro for the home page. The gate script runs while the HTML is parsed, so the
 * overlay is either there from the first frame or never shown. Without JS it never shows.
 */
export default function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
      <IntroPlayer />
    </>
  );
}
