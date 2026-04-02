import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

const CATEGORIES = ["All", "Office", "Dining Room", "Living Room", "Seating"];

interface NavbarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const Navbar = ({ activeCategory, onCategoryChange }: NavbarProps) => {
  const handleCategoryClick = (cat: string) => {
    onCategoryChange(cat);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
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
    </nav>
  );
};
