import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-walnut-dark text-primary-foreground/90">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="tracking-[0.15em] inline-block mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-xl font-medium text-primary-foreground">Furniture</span>
              <span className="text-xs font-normal text-gold ml-0.5">100</span>
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed mb-4 font-light">
              Premium furniture delivered nationwide. Curated pieces for modern British living.
            </p>
            <div className="flex gap-4 text-primary-foreground/50">
              <span className="text-xs hover:text-primary-foreground cursor-pointer transition-colors">Instagram</span>
              <span className="text-xs hover:text-primary-foreground cursor-pointer transition-colors">Facebook</span>
              <span className="text-xs hover:text-primary-foreground cursor-pointer transition-colors">Pinterest</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-medium mb-4 text-primary-foreground">Quick Links</p>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">Home</Link>
              <Link to="/shop" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">Shop All</Link>
              <Link to="/about" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">About Us</Link>
              <Link to="/contact" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">Contact</Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <p className="text-sm font-medium mb-4 text-primary-foreground">Customer Care</p>
            <div className="space-y-2.5">
              <Link to="/delivery" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">Delivery Information</Link>
              <Link to="/returns" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">Returns Policy</Link>
              <Link to="/contact" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">FAQs</Link>
              <Link to="/contact" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors font-light">Track Order</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium mb-4 text-primary-foreground">Contact Us</p>
            <div className="space-y-2.5">
              <p className="text-sm text-primary-foreground/60 font-light">hello@furniture100.co.uk</p>
              <p className="text-sm text-primary-foreground/60 font-light">Mon – Fri, 9am – 5pm</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40 font-light">
            © {new Date().getFullYear()} Furniture100. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/40">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors font-light">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors font-light">Terms & Conditions</Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-primary-foreground/40 font-light">
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
