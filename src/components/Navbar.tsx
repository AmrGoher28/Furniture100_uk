import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, Menu, X, ChevronDown } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { CATEGORIES } from "@/lib/categories";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnterCategories = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <nav
      className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-[72px]">
        {/* Left: Logo */}
        <Link to="/" className="tracking-[0.15em] flex items-baseline shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className={`text-xl md:text-2xl font-medium transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>Furniture</span>
          <span className="text-xs md:text-sm font-normal text-gold ml-0.5">100</span>
        </Link>

        {/* Centre: Navigation (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onMouseEnter={handleMouseEnterCategories}
            onClick={() => setMegaOpen(!megaOpen)}
            className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${
              scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Categories
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`transition-colors duration-300 ${scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button className={`hidden md:block transition-colors duration-300 ${scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`} aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </button>
          <button className={`hidden md:block transition-colors duration-300 ${scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`} aria-label="Account">
            <User className="w-5 h-5" />
          </button>
          <CartDrawer />

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className={`md:hidden transition-colors duration-300 ${scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`} aria-label="Menu">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background p-0 overflow-y-auto">
              <div className="px-6 py-4 border-b border-border">
                <Link to="/" onClick={() => setMobileOpen(false)} className="tracking-[0.15em]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-xl font-medium text-foreground">Furniture</span>
                  <span className="text-xs font-normal text-gold ml-0.5">100</span>
                </Link>
              </div>

              <div className="px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-sm font-medium text-foreground/80 hover:text-foreground border-b border-border/30"
                  >
                    {link.label}
                  </Link>
                ))}

                <Accordion type="single" collapsible className="w-full mt-2">
                  {CATEGORIES.map((cat) => (
                    <AccordionItem key={cat.slug} value={cat.slug} className="border-border/30">
                      <AccordionTrigger className="text-sm font-medium text-foreground/80 hover:text-foreground py-3 hover:no-underline">
                        {cat.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 pl-4 pb-2">
                          <Link
                            to={`/category/${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-sm text-muted-foreground hover:text-foreground font-light"
                          >
                            All {cat.name}
                          </Link>
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              to={`/category/${cat.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-sm text-muted-foreground hover:text-foreground font-light"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="border-t border-border/30 mt-4 pt-4 flex flex-col gap-3">
                  <button className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground py-2">
                    <User className="w-4 h-4" /> Account
                  </button>
                  <button className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground py-2">
                    <Heart className="w-4 h-4" /> Wishlist
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="border-t border-border px-6 md:px-12 py-3 bg-background animate-fade-in">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for furniture..."
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mega menu dropdown */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 bg-background border-t border-border shadow-lg animate-fade-in"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={() => setMegaOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-gold transition-colors duration-300 mb-3 block"
                >
                  {cat.name}
                </Link>
                <ul className="space-y-1.5">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
