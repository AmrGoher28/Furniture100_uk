import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-end px-6 md:px-12 pb-20 md:pb-28">
      <img
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80"
        alt="Premium lounge chair in a beautifully designed room"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.05]">
          Premium<br />Furniture.
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-light max-w-md mb-10 leading-relaxed">
          Curated pieces for modern British living. Free delivery nationwide.
        </p>
        <Link
          to="/shop"
          className="inline-block border border-white/60 text-white px-8 py-3.5 rounded-md text-sm font-medium tracking-wide hover:bg-white hover:text-foreground transition-all duration-300 ease-in-out"
        >
          Shop the Collection
        </Link>
      </div>
    </section>
  );
};
