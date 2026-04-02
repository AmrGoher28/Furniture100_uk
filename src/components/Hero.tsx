export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80"
          alt="Luxury furniture showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[hsl(var(--near-black)/0.55)]" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-white/70 mb-6">
          Artisan-Crafted Furniture
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 text-white">
          Furniture Worth<br />Living With
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          Every piece is shaped by hand, built to last, and designed to bring quiet beauty to your everyday life.
        </p>
        <a
          href="#collection"
          className="inline-block text-xs tracking-[0.25em] uppercase border border-white/80 text-white px-10 py-4 hover:bg-white hover:text-[hsl(var(--near-black))] transition-colors duration-300"
        >
          Browse the Collection
        </a>
      </div>
    </section>
  );
};
