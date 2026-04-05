import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="tracking-[0.15em] inline-block mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-xl font-medium text-foreground">Furniture</span>
              <span className="text-xs font-normal text-gold ml-0.5">100</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Premium furniture delivered nationwide. Curated pieces for modern British living.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <span className="text-xs hover:text-foreground cursor-pointer transition-colors">Instagram</span>
              <span className="text-xs hover:text-foreground cursor-pointer transition-colors">Facebook</span>
              <span className="text-xs hover:text-foreground cursor-pointer transition-colors">Pinterest</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-semibold mb-4">Quick Links</p>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/shop" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Shop All</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <p className="text-sm font-semibold mb-4">Customer Care</p>
            <div className="space-y-2.5">
              <Link to="/delivery" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Delivery Information</Link>
              <Link to="/returns" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Returns Policy</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Track Order</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold mb-4">Contact Us</p>
            <div className="space-y-2.5">
              <p className="text-sm text-muted-foreground">01234 567 890</p>
              <p className="text-sm text-muted-foreground">hello@furniture100.co.uk</p>
              <p className="text-sm text-muted-foreground">Mon – Fri, 9am – 5pm</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Furniture100. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span>Klarna</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
