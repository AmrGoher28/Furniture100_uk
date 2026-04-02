import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

const CATEGORIES: Record<string, string[]> = {
  All: [],
  Office: ["Desks", "Office Chairs", "Bookshelves"],
  "Dining Room": ["Dining Tables", "Dining Chairs", "Sideboards"],
  "Living Room": ["Sofas", "Coffee Tables", "TV Units", "Shelving"],
  Seating: ["Armchairs", "Accent Chairs", "Benches", "Stools"],
};

interface NavbarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onCategoryHover?: (cat: string | null) => void;
}

export const Navbar = ({ activeCategory, onCategoryChange, onCategoryHover }: NavbarProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCategoryClick = (cat: string) => {
    onCategoryChange(cat);
    setHoveredCategory(null);
    onCategoryHover?.(null);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubClick = (mainCat: string, _sub: string) => {
    onCategoryChange(mainCat);
    setHoveredCategory(null);
    onCategoryHover?.(null);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseEnter = (cat: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (CATEGORIES[cat]?.length) {
      setHoveredCategory(cat);
      onCategoryHover?.(cat);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      onCategoryHover?.(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm"
      onMouseLeave={handleMouseLeave}
    >
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link to="/" className="text-2xl tracking-[0.3em] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
          SWIFLIVING
        </Link>
        <div className="flex items-center gap-8">
          <a href="#about" className="hidden md:inline-block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <CartDrawer />
        </div>
      </div>

      {/* Category row */}
      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center gap-6 md:gap-10 h-12 overflow-x-auto">
          {Object.keys(CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              onMouseEnter={() => handleMouseEnter(cat)}
              className={`text-xs tracking-[0.2em] uppercase pb-0.5 transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "text-foreground border-b border-[hsl(var(--bark))]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mega-menu dropdown */}
      {hoveredCategory && CATEGORIES[hoveredCategory]?.length > 0 && (
        <div
          className="absolute left-0 right-0 bg-[hsl(var(--near-black)/0.92)] backdrop-blur-md animate-fade-in"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-center gap-8 md:gap-12">
            {CATEGORIES[hoveredCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubClick(hoveredCategory, sub)}
                className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-200"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
