"use client";

import { useEffect, useRef } from "react";

export type VideoSource = { src: string; type: string; media?: string };

/**
 * Looping muted background video. It pauses when off screen (saves battery and data)
 * and stays still for anyone who prefers reduced motion.
 */
export default function AutoVideo({
  sources,
  poster,
  label,
  lazy = false,
  onPlaying,
}: {
  sources: VideoSource[];
  poster?: string;
  label: string;
  /** Below the fold: fetch nothing until the video scrolls into view. */
  lazy?: boolean;
  onPlaying?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      // Lazy videos start loading a little before they arrive.
      { threshold: lazy ? 0 : 0.05, rootMargin: lazy ? "300px 0px" : "0px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [lazy]);

  return (
    <video
      ref={ref}
      autoPlay={!lazy}
      muted
      loop
      playsInline
      preload={lazy ? "none" : "metadata"}
      poster={poster}
      onPlaying={onPlaying}
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} media={s.media} />
      ))}
    </video>
  );
}
