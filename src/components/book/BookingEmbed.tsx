"use client";

import { useState } from "react";

/**
 * Google's booking calendar inside a Lumetic card. A quiet placeholder holds the space
 * until the calendar has loaded, then the calendar fades in over it.
 */
export default function BookingEmbed({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[12px] bg-white">
      {!loaded && (
        <div aria-hidden className="absolute inset-0 flex flex-col gap-4 p-6 md:p-8">
          <div className="booking-skeleton h-5 w-40 rounded-[6px]" />
          <div className="booking-skeleton h-4 w-64 max-w-full rounded-[6px]" />
          <div className="mt-6 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="booking-skeleton aspect-square rounded-full" />
            ))}
          </div>
        </div>
      )}
      <iframe
        src={src}
        title="Book a call with Lumetic"
        onLoad={() => setLoaded(true)}
        className={`relative block h-[760px] w-full border-0 transition-opacity duration-700 md:h-[700px] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
