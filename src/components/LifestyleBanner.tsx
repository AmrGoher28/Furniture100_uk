import { Link } from "react-router-dom";

export const LifestyleBanner = () => {
  return (
    <section className="relative h-[70vh] md:h-[90vh] min-h-[500px] flex items-end overflow-hidden bg-cream-deep">
      {/* Placeholder gradient — replace with uploaded image */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-deep via-cream to-cream-deep" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/30">
          Lifestyle Image Placeholder
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-14 md:pb-20">
        <h2
          className="font-serif-display text-background max-w-2xl"
          style={{
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            lineHeight: 1.05,
            fontWeight: 500,
          }}
        >
          A <em className="italic font-normal">Feel</em> FOR THE{" "}
          <em className="italic font-normal">Indoors</em>
        </h2>
        <p className="text-background/80 text-[11px] tracking-[0.25em] uppercase mt-5">
          Furniture that speaks to the senses
        </p>
        <div className="mt-8">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-background text-foreground px-7 py-3 text-xs tracking-[0.18em] uppercase font-medium hover:bg-background/90 transition-colors"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </section>
  );
};
