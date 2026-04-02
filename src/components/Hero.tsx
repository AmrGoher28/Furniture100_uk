export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">
          Artisan-Crafted Furniture
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-8">
          Furniture Worth<br />Living With
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          Every piece is shaped by hand, built to last, and designed to bring quiet beauty to your everyday life.
        </p>
        <a
          href="#collection"
          className="inline-block text-xs tracking-[0.25em] uppercase border border-foreground px-10 py-4 hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          Browse the Collection
        </a>
      </div>
    </section>
  );
};
