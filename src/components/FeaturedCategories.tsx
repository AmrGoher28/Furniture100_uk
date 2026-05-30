import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

// Bento mosaic — bar stools gets a large feature tile
const TILES = [
  { ...CATEGORIES[0], span: "md:col-span-5 md:row-span-2" }, // Lounge Chairs — tall
  { ...CATEGORIES[3], span: "md:col-span-7 md:row-span-2" }, // Bar Stools — large feature
  { ...CATEGORIES[1], span: "md:col-span-6" },               // Office Chairs — wide
  { ...CATEGORIES[2], span: "md:col-span-6" },               // Dining Chairs — wide
];

export const FeaturedCategories = () => {
  return (
    <section className="bg-background">
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-0 auto-rows-[260px] md:auto-rows-[340px]">
          {TILES.map((cat, i) => (
            <Link
              key={`${cat.slug}-${i}`}
              to={cat.slug === "shop" ? "/shop" : `/category/${cat.slug}`}
              className={`group relative overflow-hidden bg-cream-deep ${cat.span}`}
            >
              {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] ${i === 0 ? 'object-[75%_center]' : i === 2 ? 'object-[center_60%]' : ''}`}
              />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-foreground/30">
                  Placeholder
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
              <div className="absolute top-5 left-5 md:top-7 md:left-7">
                <h3 className="text-white text-base md:text-xl font-medium tracking-tight uppercase">
                  {cat.name}
                </h3>
              </div>
              <div className="absolute bottom-5 right-5 md:bottom-7 md:right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
