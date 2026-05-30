import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="bg-cream text-foreground">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center animate-fade-in">
        <p className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-foreground/60 font-medium mb-8">
          Furniture100 · Collection 2026
        </p>
        <h1
          className="font-serif-display text-foreground"
          style={{
            fontSize: "clamp(3rem, 10vw, 8rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          <em className="italic font-normal">Timeless</em> Design.
        </h1>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-foreground/85 transition-colors"
          >
            Shop Collection
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-full border border-foreground/30 text-foreground px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-medium hover:border-foreground transition-colors"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
};
