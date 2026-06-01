export type ImageOrientation = "square" | "landscape" | "portrait";

export type ScrollerCard = {
  src: string;
  alt: string;
  rotate: number;
  zIndex: number;
  scale: number;
  /** vw offset from viewport center */
  scatterXVw: number;
  scatterYVh: number;
  driftXVw: number;
  driftYVh: number;
};

/** Card scroller: wide scattered layout, drifts outward from center */
export const scrollerCards: ScrollerCard[] = [
  {
    src: "/gallery/cityscape.png",
    alt: "Cityscape study",
    rotate: -11,
    zIndex: 2,
    scale: 0.88,
    scatterXVw: -36,
    scatterYVh: -28,
    driftXVw: -16,
    driftYVh: -10,
  },
  {
    src: "/gallery/collage.png",
    alt: "Collage composition",
    rotate: 8,
    zIndex: 5,
    scale: 1.06,
    scatterXVw: 6,
    scatterYVh: -32,
    driftXVw: 14,
    driftYVh: 8,
  },
  {
    src: "/gallery/cars.png",
    alt: "Vintage car colour study",
    rotate: -5,
    zIndex: 3,
    scale: 0.92,
    scatterXVw: 34,
    scatterYVh: -20,
    driftXVw: 20,
    driftYVh: -14,
  },
  {
    src: "/gallery/new-york.png",
    alt: "New York surreal skyline",
    rotate: 10,
    zIndex: 7,
    scale: 1.04,
    scatterXVw: -30,
    scatterYVh: 6,
    driftXVw: -18,
    driftYVh: 12,
  },
  {
    src: "/gallery/people.png",
    alt: "Crowd portrait study",
    rotate: -7,
    zIndex: 4,
    scale: 0.9,
    scatterXVw: 26,
    scatterYVh: 18,
    driftXVw: 22,
    driftYVh: -8,
  },
  {
    src: "/gallery/birds.png",
    alt: "Birds of prey composition",
    rotate: 6,
    zIndex: 8,
    scale: 1.08,
    scatterXVw: -8,
    scatterYVh: 30,
    driftXVw: -12,
    driftYVh: -16,
  },
  {
    src: "/gallery/airplanes.png",
    alt: "Airplanes in cloudscape",
    rotate: -12,
    zIndex: 6,
    scale: 0.86,
    scatterXVw: -38,
    scatterYVh: 22,
    driftXVw: -14,
    driftYVh: 10,
  },
  {
    src: "/gallery/terrace.png",
    alt: "Architectural terrace scene",
    rotate: 4,
    zIndex: 9,
    scale: 1.02,
    scatterXVw: 32,
    scatterYVh: 28,
    driftXVw: 24,
    driftYVh: -6,
  },
  {
    src: "/gallery/mountains.png",
    alt: "Mountain eclipse study",
    rotate: -9,
    zIndex: 1,
    scale: 0.94,
    scatterXVw: 18,
    scatterYVh: -8,
    driftXVw: 16,
    driftYVh: 18,
  },
];
