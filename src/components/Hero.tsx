import { useEffect, useState, useRef } from "react";

const CATEGORY_IMAGES: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80",
  ],
  Office: [
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1920&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  ],
  "Dining Room": [
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1920&q=80",
    "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=1920&q=80",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1920&q=80",
  ],
  "Living Room": [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80",
  ],
  Seating: [
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1920&q=80",
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1920&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80",
  ],
};

interface HeroProps {
  hoveredCategory?: string | null;
}

export const Hero = ({ hoveredCategory }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImages, setActiveImages] = useState(CATEGORY_IMAGES.default);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const images = hoveredCategory && CATEGORY_IMAGES[hoveredCategory]
      ? CATEGORY_IMAGES[hoveredCategory]
      : CATEGORY_IMAGES.default;

    setActiveImages(images);
    setCurrentIndex(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hoveredCategory]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32">
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        {activeImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Luxury furniture showroom"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-[hsl(var(--near-black)/0.55)]" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-white/70 mb-6">
          Artisan-Crafted Furniture
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 text-white">
          Furniture Worth<br />Living With
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          Every piece is shaped by hand, built to last, and designed to bring quiet beauty to your everyday life.
        </p>
        <a
          href="#collection"
          className="inline-block text-xs tracking-[0.25em] uppercase border border-white/80 text-white px-10 py-4 hover:bg-white hover:text-[hsl(var(--near-black))] transition-colors duration-300"
        >
          Browse the Collection
        </a>
      </div>
    </section>
  );
};
