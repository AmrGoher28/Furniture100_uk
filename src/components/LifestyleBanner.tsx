import { Link } from "react-router-dom";
import lifestyleImage from "@/assets/lifestyle-banner.webp";

export const LifestyleBanner = () => {
  return (
    <section className="relative h-[70vh] md:h-[90vh] min-h-[500px] flex items-end overflow-hidden bg-cream-deep">
      <img
        src={lifestyleImage}
        alt="Accent chair in a warm modern living space"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

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
