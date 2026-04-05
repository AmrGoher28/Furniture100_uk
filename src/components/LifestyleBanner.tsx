import { Link } from "react-router-dom";

export const LifestyleBanner = () => {
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      <img
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
        alt="Beautifully styled living space"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h2 className="text-3xl md:text-5xl text-white mb-4">
          Furniture That Transforms Your Space
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Handpicked pieces for modern living
        </p>
        <Link
          to="/shop"
          className="inline-block bg-gold text-white px-8 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
        >
          Explore The Collection
        </Link>
      </div>
    </section>
  );
};
