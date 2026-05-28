import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    desktop: "/hero-slide-1.webp",
    mobile: "/hero-slide-1-mobile.webp",
    alt: "Stylish lounge chairs in a modern living room",
  },
  {
    desktop: "/hero-slide-2.webp",
    mobile: "/hero-slide-2-mobile.webp",
    alt: "Contemporary furniture in a beautifully styled space",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="relative h-[52vh] md:h-[88vh] min-h-[380px] flex items-end overflow-hidden bg-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <picture key={i}>
          <source media="(max-width: 767px)" srcSet={slide.mobile} />
          <source media="(min-width: 768px)" srcSet={slide.desktop} />
          <img
            src={slide.desktop}
            alt={slide.alt}
            fetchPriority={i === 0 ? "high" : undefined}
            loading={i === 0 ? undefined : "lazy"}
            decoding={i === 0 ? "sync" : "async"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      ))}

      {/* Subtle bottom gradient for legibility only */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent z-[1]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
        <h1
          className="text-background max-w-3xl"
          style={{
            fontSize: "clamp(2rem, 6vw, 5.25rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            fontWeight: 600,
          }}
        >
          Premium Furniture.<br className="hidden md:block" /> Delivered Nationwide.
        </h1>
        <div className="mt-8 md:mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-background text-foreground h-12 px-9 rounded-full text-sm font-medium tracking-tight hover:bg-background/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Minimal line indicators */}
      <div className="absolute bottom-6 right-6 md:right-12 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[2px] transition-all duration-300 ${
              i === current ? "w-10 bg-background" : "w-6 bg-background/40 hover:bg-background/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
