import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link to="/" className="text-2xl tracking-[0.3em] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
          SWIFLIVING
        </Link>
        <div className="flex items-center gap-8">
          <a href="#collection" className="hidden md:inline-block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Collection
          </a>
          <a href="#about" className="hidden md:inline-block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <CartDrawer />
        </div>
      </div>
    </nav>
  );
};
