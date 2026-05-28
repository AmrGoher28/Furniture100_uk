import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";

const FEATURED = [
  CATEGORIES[0],
  CATEGORIES[1],
  CATEGORIES[4],
  CATEGORIES[2],
  CATEGORIES[3],
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

  const CategoryCard = ({ cat, className = "" }: { cat: typeof CATEGORIES[0]; className?: string }) => (
    <Link
      to={`/category/${cat.slug}`}
      className={`group flex flex-col ${className}`}
    >
      <div className="relative overflow-hidden bg-card aspect-[4/5] mb-4">
        <img
          src={cat.image}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="text-sm md:text-base font-semibold tracking-tight text-foreground">{cat.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">Shop now</p>
    </Link>
  );

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-5 font-medium">Categories</p>
            <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3.25rem)", letterSpacing: "-0.03em" }}>
              Shop by category.
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">
            View all
          </Link>
        </div>
      </div>

      {/* Mobile: carousel */}
      <div className="md:hidden relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} className="flex-shrink-0 w-[160px] snap-start" />
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {FEATURED.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};
