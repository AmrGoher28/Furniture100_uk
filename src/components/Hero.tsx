import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 animate-fade-in">
        <div className="grid grid-cols-12 border-t border-border">
          {/* Headline */}
          <div className="col-span-12 py-10 md:py-24 border-b border-border">
            <h1
              className="font-semibold tracking-tighter leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem, 9vw, 7.5rem)", letterSpacing: "-0.04em" }}
            >
              Premium Furniture.<br />
              Delivered Nationwide.
            </h1>
          </div>

          {/* Main image placeholder */}
          <div className="col-span-12 md:col-span-8 md:border-r border-b border-border bg-[#FAFAFA] aspect-[16/10] md:aspect-[16/9] flex items-center justify-center relative">
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-foreground/30">
              Feature 01
            </span>
            <div className="w-full h-full bg-[#ECECEC] flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                Main Image
              </span>
            </div>
          </div>

          {/* Right column: copy + detail + CTA */}
          <div className="col-span-12 md:col-span-4 border-b border-border p-6 md:p-8 flex flex-col justify-between bg-background gap-8">
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-foreground/60 max-w-[280px] font-light">
                Curated collections of timeless design, crafted for the modern home. Sourced
                globally, shipped directly to your door.
              </p>
              <div className="w-full aspect-square bg-[#FAFAFA] border border-border flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                  Detail 02
                </span>
              </div>
            </div>

            <Link
              to="/shop"
              className="group flex items-center justify-between border border-foreground px-6 py-4 transition-colors duration-300 hover:bg-foreground hover:text-background"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Shop Now</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Meta footer */}
          <div className="col-span-12 flex justify-between items-center py-5 text-[10px] uppercase tracking-[0.25em] text-foreground/50 border-b border-border">
            <div className="flex gap-6 md:gap-12 items-center">
              <span className="text-foreground font-semibold">Collection 2026</span>
              <div className="hidden sm:flex gap-4">
                <span className="text-foreground">01</span>
                <span>02</span>
                <span>03</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Scroll</span>
              <div className="w-px h-6 bg-border" />
              <div className="w-px h-10 bg-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
