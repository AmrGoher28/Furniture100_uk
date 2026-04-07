import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import heroSlide1 from "@/assets/hero-slide-1.webp";
import heroSlide2 from "@/assets/hero-slide-2.webp";
import heroSlide1Mobile from "@/assets/hero-slide-1-mobile.webp";
import heroSlide2Mobile from "@/assets/hero-slide-2-mobile.webp";

const slides = [
  {
    desktop: heroSlide1,
    mobile: heroSlide1Mobile,
    alt: "Stylish lounge chairs in a modern living room",
  },
  {
    desktop: heroSlide2,
    mobile: heroSlide2Mobile,
    alt: "Contemporary furniture in a beautifully styled space",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile();

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
      className="relative min-h-[400px] md:min-h-[470px] flex items-center justify-center px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={i}
          src={isMobile ? slide.mobile : slide.desktop}
          alt={slide.alt}
          fetchPriority={i === 0 ? "high" : undefined}
          loading={i === 0 ? undefined : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-black/30 md:bg-none md:bg-black/30 z-[1]" />
      <div className="absolute inset-0 hidden md:block bg-black/30 z-[1]" />
      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />


      <div className="relative z-10 text-center max-w-3xl mx-auto px-2">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-6 md:mb-8 leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)' }}>
          Premium Furniture.<br />Delivered Nationwide
        </h1>
        <p className="text-primary-foreground/70 text-xs sm:text-sm font-light mb-8 tracking-wide" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
          Don't like the price? Make an offer.
        </p>
        <Link
          to="/shop"
          className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-opacity inline-block"
        >
          Shop Now
        </Link>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-gold scale-110"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
