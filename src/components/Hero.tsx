import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center px-6">
      <img
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80"
        alt="Premium lounge chair in a beautifully designed room"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/45" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
          Premium Furniture.<br />Delivered Nationwide.
        </h1>
        <p className="text-white/80 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Transform your home with our curated collection of premium furniture. Free UK delivery on every order.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
          <a
            href="#best-sellers"
            className="border border-white text-white px-8 py-3.5 rounded-md text-sm font-medium tracking-wide hover:bg-white hover:text-foreground transition-colors"
          >
            View Best Sellers
          </a>
        </div>
      </div>
    </section>
  );
};
