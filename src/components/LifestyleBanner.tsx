import { Link } from "react-router-dom";

export const LifestyleBanner = () => {
  return (
    <section className="relative h-[65vh] md:h-[85vh] min-h-[440px] flex items-end overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=70&fm=webp"
        alt="Beautifully styled living space"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-14 md:pb-24">
        <h2
          className="text-background max-w-md"
          style={{
            fontSize: "clamp(1.625rem, 3.6vw, 3rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
            fontWeight: 500,
          }}
        >
          Furniture that transforms your space.
        </h2>
        <div className="mt-7">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm text-background border-b border-background/60 hover:border-background pb-0.5 transition-colors"
          >
            Explore the collection
          </Link>
        </div>
      </div>
    </section>
  );
};
