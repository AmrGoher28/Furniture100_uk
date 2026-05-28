import { Link } from "react-router-dom";

const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "New Arrivals", to: "/shop" },
      { label: "Best Sellers", to: "/shop" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Delivery", to: "/delivery" },
      { label: "Returns", to: "/returns" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "hello@furniture100.co.uk", to: "/contact" },
      { label: "Mon – Fri, 9am – 5pm", to: "/contact" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-5 text-foreground">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Furniture100. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/70 font-medium">
            Furniture100
          </p>
        </div>
      </div>
    </footer>
  );
};
