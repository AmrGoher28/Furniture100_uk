import { Link } from "react-router-dom";
import { PackageCheck, Sprout, Undo2, Lock } from "lucide-react";

const PROMISES = [
  { icon: PackageCheck, title: "Free UK delivery", desc: "On thousands of pieces" },
  { icon: Undo2, title: "30 day returns", desc: "Hassle-free exchanges" },
  { icon: Sprout, title: "Sustainably sourced", desc: "Responsible materials" },
  { icon: Lock, title: "Secure checkout", desc: "Klarna & PayPal available" },
];

const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { label: "All Furniture", to: "/shop" },
      { label: "Lounge Chairs", to: "/category/lounge-chairs" },
      { label: "Dining", to: "/category/dining" },
      { label: "Bar Stools", to: "/category/bar-stools" },
      { label: "Office Chairs", to: "/category/office-chairs" },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Delivery Info", to: "/delivery" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Track My Order", to: "/account" },
      { label: "FAQs", to: "/contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Sustainability", to: "/about" },
      { label: "Reviews", to: "/about" },
      { label: "Trade Enquiries", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Cookie Policy", to: "/privacy" },
    ],
  },
];

const PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal", "Klarna", "Apple Pay"];

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border text-foreground">
      {/* Promises strip */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {PROMISES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="w-6 h-6 mt-0.5 text-foreground/80" strokeWidth={1} />
              <div>
                <p className="text-sm font-medium leading-tight">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand block */}
          <div className="md:col-span-4">
            <Link to="/" className="font-serif-display italic text-3xl text-foreground">
              Furniture100
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xs">
              A UK online furniture boutique. Editorial design pieces - lounge,
              dining, bar and office - delivered to your door.
            </p>
            <div className="mt-6 space-y-1">
              <p className="text-sm text-foreground">hello@furniture100.co.uk</p>
              <p className="text-xs text-muted-foreground">Mon - Fri, 9am - 5pm</p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.25} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10">
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
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Furniture100. All rights reserved. Registered in England & Wales.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 border border-border rounded text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
