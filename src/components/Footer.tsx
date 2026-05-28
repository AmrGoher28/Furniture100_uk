import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-5 tracking-tight">
              <span className="text-lg font-bold text-foreground">FURNITURE100</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Premium furniture delivered nationwide. Curated pieces for modern British living.
            </p>
            <div className="flex gap-5 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Facebook</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Pinterest</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-5 text-foreground tracking-[0.15em] uppercase">Shop</p>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/shop" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Shop All</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-5 text-foreground tracking-[0.15em] uppercase">Support</p>
            <div className="space-y-3">
              <Link to="/delivery" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Delivery</Link>
              <Link to="/returns" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Returns</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Track Order</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-5 text-foreground tracking-[0.15em] uppercase">Contact</p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">hello@furniture100.co.uk</p>
              <p className="text-sm text-muted-foreground">Mon – Fri, 9am – 5pm</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Furniture100. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Visa</span><span>Mastercard</span><span>PayPal</span><span>Klarna</span><span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
