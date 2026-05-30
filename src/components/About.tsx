export const About = () => {
  const stats = [
    { value: "12", label: "Years of Craft" },
    { value: "6", label: "Countries" },
    { value: "40+", label: "Artisans" },
    { value: "100%", label: "Handmade" },
  ];

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
              Our Story
            </p>
            <h2 className="text-4xl md:text-5xl mb-8 leading-[1.1]">
              Made by Hand,<br />Built to Stay
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-6">
              furniture100 was born from a simple belief: the things we live with should be worth keeping. Every piece in our collection is shaped by artisan hands - carved, joined, and finished with the kind of attention that machines cannot replicate.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed">
              We work with small workshops across six countries, sourcing responsibly harvested timber, natural stone, and heritage textiles. The result is furniture that ages beautifully and tells a story.
            </p>
          </div>
          <div className="aspect-[4/5] bg-muted/40" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 md:mt-32 pt-16 border-t border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl mb-2">{stat.value}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
