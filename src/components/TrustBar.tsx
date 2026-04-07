import { useEffect, useRef } from "react";
import { Truck, RotateCcw, Star, ShieldCheck, HandCoins } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free UK Delivery" },
  { icon: RotateCcw, label: "30 Day Returns" },
  { icon: Star, label: "Rated Excellent" },
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: HandCoins, label: "Make an Offer" },
];

export const TrustBar = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animId: number;
    let pos = 0;
    const speed = 0.35;

    const step = () => {
      if (!pausedRef.current) {
        pos -= speed;
        const half = track.scrollWidth / 2;
        if (Math.abs(pos) >= half) pos = 0;
        track.style.transform = `translateX(${pos}px)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <section
      className="bg-card py-3 overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div ref={trackRef} className="flex items-center whitespace-nowrap will-change-transform">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-6 md:px-8">
            <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs md:text-sm font-light tracking-wide text-foreground">
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
};
