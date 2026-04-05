import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/categories";

const FEATURED = [
  CATEGORIES[0], // Lounge Chairs
  CATEGORIES[1], // Sofas
  CATEGORIES[4], // Mirrors (middle)
  CATEGORIES[2], // Office Chairs
  CATEGORIES[3], // Dining
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-3">Shop By Category</h2>
          <p className="text-muted-foreground font-light">Find the perfect piece for every room</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {FEATURED.map((cat, index) => {
            const isLastOdd = FEATURED.length % 2 === 1 && index === FEATURED.length - 1;
            return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`group relative aspect-[3/4] overflow-hidden rounded-xl warm-shadow group-hover:warm-shadow-lg transition-shadow duration-300 ${isLastOdd ? 'col-span-2 max-w-[calc(50%-0.5rem)] mx-auto lg:col-span-1 lg:max-w-none lg:mx-0' : ''}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-primary-foreground text-sm md:text-base font-medium tracking-wide">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
