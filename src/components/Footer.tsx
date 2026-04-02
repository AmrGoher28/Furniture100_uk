import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <Link to="/" className="text-xl tracking-[0.3em]" style={{ fontFamily: "'Playfair Display', serif" }}>
              SWIFLIVING
            </Link>
            <p className="text-sm text-muted-foreground font-light mt-4 leading-relaxed max-w-xs">
              Artisan-crafted furniture for those who value beauty, quality, and quiet confidence.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-4">Navigate</p>
            <div className="space-y-3">
              <a href="#collection" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">Collection</a>
              <a href="#about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">About</a>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-4">Contact</p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-light">hello@swifliving.com</p>
              <p className="text-sm text-muted-foreground font-light">London, United Kingdom</p>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground font-light">
            © {new Date().getFullYear()} SWIFLIVING. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
