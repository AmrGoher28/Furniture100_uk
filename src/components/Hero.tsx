import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide1Mobile from "@/assets/hero-slide-1-mobile.jpg";
import heroSlide2Mobile from "@/assets/hero-slide-2-mobile.jpg";

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
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={i}
          src={isMobile ? slide.mobile : slide.desktop}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-walnut-dark/40" />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-2">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-4 md:mb-6 leading-tight">
          Premium Furniture.<br />Delivered Nationwide.
        </h1>
        <p className="text-primary-foreground/75 text-sm sm:text-lg md:text-xl font-light max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed hidden sm:block">
          Transform your home with our curated collection of premium furniture. Free UK delivery on every order.
        </p>
        <p className="text-primary-foreground/75 text-sm font-light max-w-xs mx-auto mb-8 leading-relaxed sm:hidden">
          Premium furniture with free UK delivery.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
          <a
            href="#best-sellers"
            className="border border-primary-foreground/60 text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-primary-foreground/10 transition-colors"
          >
            View Best Sellers
          </a>
        </div>
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
