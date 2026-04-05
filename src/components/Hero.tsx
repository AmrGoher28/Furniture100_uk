import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";

const slides = [
  { src: heroSlide1, alt: "Stylish lounge chairs in a modern living room" },
  { src: heroSlide2, alt: "Contemporary furniture in a beautifully styled space" },
  { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80", alt: "Premium sofa in an elegant interior setting" },
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
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-foreground/45" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
          Premium Furniture.<br />Delivered Nationwide.
        </h1>
        <p className="text-white/80 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Transform your home with our curated collection of premium furniture. Free UK delivery on every order.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
          <a
            href="#best-sellers"
            className="border border-white text-white px-8 py-3.5 rounded-md text-sm font-medium tracking-wide hover:bg-white hover:text-foreground transition-colors"
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
                ? "bg-[#C9A84C] scale-110"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
