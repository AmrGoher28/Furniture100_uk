import { Link } from "react-router-dom";

export const LifestyleBanner = () => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] min-h-[420px] flex items-end overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=70&fm=webp"
        alt="Beautifully styled living space"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
        <h2 className="text-background max-w-2xl" style={{ fontSize: "clamp(1.875rem, 4.5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Furniture that transforms your space.
        </h2>
        <div className="mt-8">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-background text-foreground h-12 px-9 rounded-full text-sm font-medium hover:bg-background/90 transition-colors"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
};
