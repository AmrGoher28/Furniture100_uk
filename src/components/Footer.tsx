import { Link } from "react-router-dom";
import { useState } from "react";
import { Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Shop */}
          <div>
            <p className="text-sm font-semibold text-neutral-200 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Shop</p>
            <div className="space-y-2.5">
              <Link to="/shop" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">All Furniture</Link>
              <Link to="/category/sofas" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Sofas</Link>
              <Link to="/category/dining" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Dining</Link>
              <Link to="/category/bedroom" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Bedroom</Link>
              <Link to="/category/office" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Office</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-neutral-200 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Company</p>
            <div className="space-y-2.5">
              <Link to="/about" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">About Us</Link>
              <Link to="/contact" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Contact</Link>
              <Link to="/privacy" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Terms & Conditions</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="text-sm font-semibold text-neutral-200 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Support</p>
            <div className="space-y-2.5">
              <Link to="/delivery" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Delivery Information</Link>
              <Link to="/returns" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">Returns Policy</Link>
              <Link to="/contact" className="block text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-300">FAQs</Link>
              <p className="text-sm text-neutral-400">01234 567 890</p>
              <p className="text-sm text-neutral-400">hello@furniture100.co.uk</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-sm font-semibold text-neutral-200 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Stay in Touch</p>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">Get 10% off your first order and hear about new arrivals.</p>
            <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="px-3.5 py-2.5 rounded-md bg-white/5 border border-neutral-700 text-neutral-200 placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button type="submit" className="bg-gold text-white px-4 py-2.5 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-all duration-300">
                Subscribe
              </button>
            </form>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-neutral-500 hover:text-neutral-300 transition-colors duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-300 transition-colors duration-300" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Furniture100. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
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
