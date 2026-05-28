import { useEffect, useRef } from "react";

const MESSAGES = [
  "Free UK Delivery",
  "2–5 Day Dispatch",
  "30 Day Returns",
  "Lincoln, UK",
  "Buy Now, Pay Later",
];

export const AnnouncementBar = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animId: number;
    let pos = 0;
    const speed = 0.4;

    const step = () => {
      pos -= speed;
      const half = track.scrollWidth / 2;
      if (Math.abs(pos) >= half) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div className="bg-foreground text-background py-2 overflow-hidden">
      <div ref={trackRef} className="flex items-center whitespace-nowrap will-change-transform">
        {items.map((msg, i) => (
          <span key={i} className="flex items-center text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-medium">
            <span className="px-5 sm:px-8">{msg}</span>
            <span className="text-background/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
