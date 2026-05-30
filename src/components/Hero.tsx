import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    document.addEventListener("touchstart", tryPlay, { once: true });
    document.addEventListener("click", tryPlay, { once: true });
    return () => {
      document.removeEventListener("touchstart", tryPlay);
      document.removeEventListener("click", tryPlay);
    };
  }, []);

  return (
    <section className="relative bg-cream text-foreground overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src="/videos/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(180,140,70,0.18) 0%, rgba(212,178,110,0.14) 50%, rgba(120,85,40,0.20) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center animate-fade-in">
        <p className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-foreground/70 font-medium mb-8">
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
            className="inline-flex items-center justify-center rounded-full border border-foreground/40 text-foreground px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-medium hover:border-foreground transition-colors bg-cream/40 backdrop-blur-sm"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
};
