"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Mosaic column counts, coarse to fine. The image comes into focus: clarity out of noise. */
const STEPS = [7, 12, 20, 34, 58, 104];
const STEP_MS = 85;

/**
 * An image that resolves from a coarse mosaic to sharp when it enters view,
 * or whenever `active` flips to true. No WebGL: one small canvas drawn a few times.
 * With reduced motion or no JS it is just the image.
 */
export default function ResolveImage({
  src,
  alt,
  sizes,
  priority = false,
  active = true,
  className = "object-cover",
  onDone,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  active?: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const img = box.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const img = box?.querySelector("img");
    if (!box || !canvas || !img || !loaded) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone?.();
      return;
    }

    const ctx = canvas.getContext("2d");
    const { clientWidth: w, clientHeight: h } = box;
    if (!ctx || !w || !h) return;

    const draw = (cols: number) => {
      // object-fit: cover crop
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const sw = w / scale;
      const sh = h / scale;
      canvas.width = cols;
      canvas.height = Math.max(1, Math.round((cols * h) / w));
      ctx.drawImage(
        img,
        (img.naturalWidth - sw) / 2,
        (img.naturalHeight - sh) / 2,
        sw,
        sh,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    if (!active) return;

    // Hold on the coarsest frame until it scrolls into view.
    canvas.style.transition = "none";
    canvas.style.opacity = "1";
    draw(STEPS[0]);
    if (!inView) return;

    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      if (step < STEPS.length) {
        draw(STEPS[step]);
        return;
      }
      window.clearInterval(timer);
      canvas.style.transition = "opacity 260ms cubic-bezier(0.16, 1, 0.3, 1)";
      canvas.style.opacity = "0";
      onDone?.();
    }, STEP_MS);

    return () => window.clearInterval(timer);
    // onDone is intentionally not a dependency: it must not restart the sequence.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, inView, active]);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-ink/10">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onLoad={() => setLoaded(true)}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
