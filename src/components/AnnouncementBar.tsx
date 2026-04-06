import { useEffect, useRef } from "react";

const MESSAGES = [
  "Free UK Delivery on All Orders",
  "2–5 Working Day Delivery",
  "30 Day Hassle-Free Returns",
  "Based in Lincoln, UK",
  "Rated Excellent by Our Customers",
  "Buy Now, Pay Later Available",
];

export const AnnouncementBar = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animId: number;
    let pos = 0;
    const speed = 0.5;

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
    <div className="bg-walnut-dark text-primary-foreground py-2 overflow-hidden">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((msg, i) => (
          <span
            key={i}
            className="text-[10px] sm:text-xs md:text-sm tracking-wide font-light px-6 md:px-10"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};
