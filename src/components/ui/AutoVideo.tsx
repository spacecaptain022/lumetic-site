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
}: {
  sources: VideoSource[];
  poster: string;
  label: string;
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
      { threshold: 0.05 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} media={s.media} />
      ))}
    </video>
  );
}
