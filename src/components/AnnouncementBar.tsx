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
    <div className="bg-walnut-dark text-primary-foreground py-1.5 overflow-hidden">
      <div ref={trackRef} className="flex items-center whitespace-nowrap will-change-transform">
        {items.map((msg, i) => (
          <span key={i} className="flex items-center text-[10px] sm:text-xs tracking-widest uppercase font-light">
            <span className="px-4 sm:px-6">{msg}</span>
            <span className="text-gold/60">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
