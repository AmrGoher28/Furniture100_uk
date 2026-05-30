import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/categories";

export const CategoryNav = () => {
  return (
    <nav
      aria-label="Shop categories"
      className="border-y border-border bg-background"
    >
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm font-medium tracking-wide">
          <li>
            <Link
              to="/shop"
              className="uppercase text-foreground transition-colors hover:text-primary"
            >
              Shop All
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/category/${c.slug}`}
                className="uppercase text-foreground transition-colors hover:text-primary"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
