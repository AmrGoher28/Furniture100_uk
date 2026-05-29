import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="bg-[#FAFAFA] text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-10 md:pb-16">
        <div className="w-full h-px bg-border mb-12 md:mb-16" />

        <div className="flex flex-col space-y-8 animate-fade-in">
          <h1
            className="font-semibold tracking-tighter leading-[0.9]"
            style={{ fontSize: "clamp(2.75rem, 9vw, 7.5rem)", letterSpacing: "-0.04em" }}
          >
            Premium Furniture.<br />
            Delivered Nationwide.
          </h1>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between pt-8 md:pt-20 gap-10 md:gap-12">
            <p className="max-w-xs text-sm md:text-base text-foreground/60 leading-relaxed font-light">
              Curated collections of timeless design, crafted for the modern home. Sourced
              globally, shipped directly to your door.
            </p>

            <Link to="/shop" className="group flex items-center gap-4 self-start md:self-end">
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Shop Now</span>
              <span className="w-12 h-12 rounded-full border border-border flex items-center justify-center transition-colors duration-300 group-hover:bg-foreground group-hover:border-foreground">
                <ArrowRight className="w-4 h-4 transition-colors group-hover:text-background" />
              </span>
            </Link>
          </div>
        </div>

        <div className="w-full h-px bg-border mt-16 md:mt-24" />

        <div className="flex justify-between items-center py-5 text-[10px] tracking-[0.2em] uppercase font-semibold text-foreground/40">
          <span>Collection 2026</span>
          <div className="hidden sm:flex gap-4">
            <span className="text-foreground">01</span>
            <span>02</span>
            <span>03</span>
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};
