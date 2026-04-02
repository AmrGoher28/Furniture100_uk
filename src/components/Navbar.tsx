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

const PROMO_IMAGES: Record<string, Array<{ src: string; label: string }>> = {
  Office: [
    { src: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80", label: "Desk Setups" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", label: "Bookshelves" },
  ],
  "Dining Room": [
    { src: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80", label: "Dining Sets" },
    { src: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80", label: "Dining Chairs" },
  ],
  "Living Room": [
    { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80", label: "Sofas" },
    { src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", label: "Coffee Tables" },
  ],
  Seating: [
    { src: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80", label: "Armchairs" },
    { src: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80", label: "Accent Chairs" },
  ],
};

interface NavbarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const Navbar = ({ activeCategory, onCategoryChange }: NavbarProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCategoryClick = (cat: string) => {
    onCategoryChange(cat);
    setHoveredCategory(null);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubClick = (mainCat: string, _sub: string) => {
    onCategoryChange(mainCat);
    setHoveredCategory(null);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseEnter = (cat: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (CATEGORIES[cat]?.length) {
      setHoveredCategory(cat);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        hoveredCategory ? "bg-[hsl(var(--cream))]" : "bg-background/90 backdrop-blur-sm"
      }`}
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
          className="absolute left-0 right-0 bg-[hsl(var(--cream))] border-t border-border/30 shadow-lg animate-fade-in"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left: Sub-categories */}
            <div className="md:col-span-1">
              <p className="text-xs tracking-[0.2em] uppercase text-[hsl(var(--bark))] mb-4 font-medium">
                {hoveredCategory}
              </p>
              <div className="w-8 h-px bg-[hsl(var(--stone))] mb-5" />
              <ul className="space-y-3">
                {CATEGORIES[hoveredCategory].map((sub) => (
                  <li key={sub}>
                    <button
                      onClick={() => handleSubClick(hoveredCategory, sub)}
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 font-light"
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCategoryClick(hoveredCategory)}
                className="mt-6 text-xs tracking-[0.15em] uppercase text-[hsl(var(--bark))] hover:text-foreground transition-colors"
              >
                Shop {hoveredCategory} →
              </button>
            </div>

            {/* Right: Promo images */}
            {PROMO_IMAGES[hoveredCategory] && (
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {PROMO_IMAGES[hoveredCategory].map((promo) => (
                  <button
                    key={promo.label}
                    onClick={() => handleCategoryClick(hoveredCategory)}
                    className="group relative aspect-[4/3] overflow-hidden"
                  >
                    <img
                      src={promo.src}
                      alt={promo.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[hsl(var(--near-black)/0.25)] group-hover:bg-[hsl(var(--near-black)/0.35)] transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-1">Explore</p>
                      <p className="text-sm tracking-[0.1em] text-white font-medium">{promo.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
