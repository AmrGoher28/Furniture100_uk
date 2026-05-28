import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/categories";
import { SectionHeader } from "./SectionHeader";

const FEATURED = [CATEGORIES[0], CATEGORIES[1], CATEGORIES[2]];

export const FeaturedCategories = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-14 md:mb-20">
        <SectionHeader eyebrow="Categories" title="Shop by category." linkLabel="View all" linkHref="/shop" />
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden">
        <div
          className="flex gap-4 overflow-x-auto px-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex-shrink-0 w-[180px] snap-start"
            >
              <div className="relative overflow-hidden bg-[#FAFAFA] aspect-square mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-foreground font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: 3-up editorial grid */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 gap-6 lg:gap-10">
          {FEATURED.map((cat) => (
            <Link key={cat.slug} to={`/category/${cat.slug}`} className="group flex flex-col">
              <div className="relative overflow-hidden bg-[#FAFAFA] aspect-square mb-5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <p className="text-xs tracking-[0.18em] uppercase text-foreground font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
