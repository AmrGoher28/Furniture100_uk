import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const FEATURED = [
  CATEGORIES[0], // Lounge Chairs
  CATEGORIES[1], // Sofas
  CATEGORIES[4], // Mirrors
  CATEGORIES[2], // Office Chairs
  CATEGORIES[3], // Dining
];

export const FeaturedCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const CategoryCard = ({ cat, className = "" }: { cat: typeof CATEGORIES[0]; className?: string }) => (
    <Link
      to={`/category/${cat.slug}`}
      className={`group relative overflow-hidden rounded-xl warm-shadow hover:warm-shadow-lg transition-shadow duration-300 ${className}`}
    >
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-t md:from-black/60 md:to-transparent" />
      {/* Top-down gradient only on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent md:hidden" />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <p className="text-primary-foreground text-xs md:text-sm font-medium tracking-wide">
          {cat.name}
        </p>
      </div>
    </Link>
  );

  return (
    <section className="py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-3">Shop By Category</h2>
          <p className="text-muted-foreground font-light text-sm">Find the perfect piece for every room</p>
        </div>
      </div>

      {/* Mobile: sliding carousel */}
      <div className="md:hidden relative">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              cat={cat}
              className="flex-shrink-0 w-[140px] aspect-[3/4] snap-start"
            />
          ))}
        </div>
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {FEATURED.map((cat) => (
            <CategoryCard
              key={cat.slug}
              cat={cat}
              className="aspect-[3/4]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
