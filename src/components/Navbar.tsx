import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Heart, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminMode } from "@/hooks/useAdminMode";
import { SearchResults } from "./SearchResults";
import { CartDrawer } from "./CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { CATEGORIES } from "@/lib/categories";

const NAV_LINKS = [
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdminMode();

  const handleMouseEnterShop = () => {
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
      className="sticky top-0 z-50 bg-background border-b border-border"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="shrink-0 text-foreground">
          <span className="text-[15px] md:text-base font-bold tracking-[0.22em] uppercase">
            Furniture100
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-12">
          <button
            onMouseEnter={handleMouseEnterShop}
            onClick={() => navigate("/shop")}
            className="text-[11px] font-medium tracking-[0.18em] uppercase text-foreground/75 hover:text-foreground transition-colors"
          >
            Shop
          </button>
          {NAV_LINKS.filter((l) => l.label !== "Shop").map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[11px] font-medium tracking-[0.18em] uppercase text-foreground/75 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5 md:gap-6 text-foreground">
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="hover:opacity-60 transition-opacity">
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <Link to="/account" className="hidden md:block hover:opacity-60 transition-opacity" aria-label="Wishlist">
            <Heart className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <Link to="/account" className="hidden md:block hover:opacity-60 transition-opacity" aria-label="Account">
            <User className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <CartDrawer />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden hover:opacity-60 transition-opacity" aria-label="Menu">
                <Menu className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background p-0 overflow-y-auto">
              <div className="px-6 py-5 border-b border-border">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <span className="text-[15px] font-bold tracking-[0.22em] uppercase text-foreground">
                    Furniture100
                  </span>
                </Link>
              </div>

              <div className="px-6 py-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="shop" className="border-border">
                    <AccordionTrigger className="text-[11px] tracking-[0.18em] uppercase font-medium text-foreground py-4 hover:no-underline">
                      Shop
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-2 pb-2">
                        {SHOP_CHILDREN.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-sm text-muted-foreground hover:text-foreground py-1.5"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {NAV_LINKS.filter((l) => l.label !== "Shop").map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-[11px] tracking-[0.18em] uppercase font-medium text-foreground border-b border-border"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-6 flex flex-col gap-1">
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-foreground py-2.5">
                    <User className="w-4 h-4" strokeWidth={1.5} /> Account
                  </Link>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-foreground py-2.5">
                    <Heart className="w-4 h-4" strokeWidth={1.5} /> Wishlist
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
            <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          <SearchResults query={searchQuery} onClose={() => { setSearchOpen(false); setSearchQuery(""); }} />
        </div>
      )}

      {/* Mega menu — type-only, calm */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 bg-background border-t border-border animate-fade-in"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={() => setMegaOpen(false)}
                  className="block text-[11px] tracking-[0.18em] uppercase font-medium text-foreground hover:opacity-60 transition-opacity mb-4"
                >
                  {cat.name}
                </Link>
                <ul className="space-y-2">
                  {cat.subcategories.slice(0, 5).map((sub) => (
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
