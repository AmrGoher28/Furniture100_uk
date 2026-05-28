import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Heart, Menu, ChevronDown, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminMode } from "@/hooks/useAdminMode";
import { SearchResults } from "./SearchResults";
import { CartDrawer } from "./CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { CATEGORIES } from "@/lib/categories";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SHOP_CHILDREN = [
  { label: "Shop All", href: "/shop" },
  ...CATEGORIES.map((cat) => ({ label: cat.name, href: `/category/${cat.slug}` })),
];

export const Navbar = () => {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, setShowLogin } = useAdminMode();

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled && !searchOpen && !megaOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
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

  const linkColor = transparent ? "text-background/85 hover:text-background" : "text-foreground/70 hover:text-foreground";
  const iconColor = transparent ? "text-background hover:text-background/80" : "text-foreground hover:text-foreground/70";

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent border-b border-transparent" : "bg-background border-b border-border"
      }`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className={`tracking-tight shrink-0 transition-colors ${transparent ? "text-background" : "text-foreground"}`}>
          <span className="text-base md:text-lg font-bold">FURNITURE100</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.filter((l) => l.label !== "Shop").map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm font-medium tracking-tight transition-colors ${linkColor}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onMouseEnter={handleMouseEnterCategories}
            onClick={() => setMegaOpen(!megaOpen)}
            className={`flex items-center gap-1 text-sm font-medium tracking-tight transition-colors ${linkColor}`}
          >
            Shop
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <button onClick={() => setSearchOpen(!searchOpen)} className={`transition-colors ${iconColor}`} aria-label="Search">
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <Link to="/account" className={`hidden md:block transition-colors ${iconColor}`} aria-label="Wishlist">
            <Heart className="w-5 h-5" strokeWidth={1.75} />
          </Link>
          <Link to="/account" className={`hidden md:block transition-colors ${iconColor}`} aria-label="Account">
            <User className="w-5 h-5" strokeWidth={1.75} />
          </Link>
          <div className={transparent ? "[&_*]:text-background" : ""}>
            <CartDrawer />
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className={`md:hidden transition-colors ${iconColor}`} aria-label="Menu">
                <Menu className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background p-0 overflow-y-auto">
              <div className="px-6 py-5 border-b border-border">
                <Link to="/" onClick={() => setMobileOpen(false)} className="tracking-tight">
                  <span className="text-base font-bold text-foreground">FURNITURE100</span>
                </Link>
              </div>

              <div className="px-6 py-4">
                {NAV_LINKS.filter((l) => l.label !== "Shop").map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3.5 text-sm font-medium text-foreground border-b border-border"
                  >
                    {link.label}
                  </Link>
                ))}

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="shop" className="border-border">
                    <AccordionTrigger className="text-sm font-medium text-foreground py-3.5 hover:no-underline">Shop</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-2 pb-2">
                        {SHOP_CHILDREN.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-sm text-muted-foreground hover:text-foreground py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="border-t border-border mt-4 pt-4 flex flex-col gap-2">
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-foreground py-2.5">
                    <User className="w-4 h-4" strokeWidth={1.75} /> Account
                  </Link>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-foreground py-2.5">
                    <Heart className="w-4 h-4" strokeWidth={1.75} /> Wishlist
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="border-t border-border bg-background animate-fade-in">
          <div className="max-w-xl mx-auto flex items-center gap-3 px-6 md:px-12 py-5">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
          <SearchResults query={searchQuery} onClose={() => { setSearchOpen(false); setSearchQuery(""); }} />
        </div>
      )}

      {/* Mega menu */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 bg-background border-t border-border animate-fade-in"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={() => setMegaOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors mb-3 block tracking-tight"
                >
                  {cat.name}
                </Link>
                <ul className="space-y-2">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
