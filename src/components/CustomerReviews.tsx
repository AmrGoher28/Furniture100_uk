const FEATURED = {
  text: "Really pleased with the quality. They look fantastic in our kitchen and were easy to assemble.",
  name: "Daryl Y.",
  product: "Set of 2 Brown Suede Bar Stools",
};

const SECONDARY = [
  { text: "Gorgeous chair, exactly as described. Fast delivery — would definitely order again.", name: "Becky C." },
  { text: "Beautiful piece of furniture. The colour is spot on and it's incredibly comfortable.", name: "Karen T." },
  { text: "Absolutely love this sofa. A real statement piece and brilliant quality for the price.", name: "Samantha C." },
];

export const CustomerReviews = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-14 md:mb-20 font-medium text-center">
          Loved by homes across the UK
        </p>

        <blockquote className="max-w-3xl mx-auto text-center">
          <p
            className="text-foreground"
            style={{
              fontSize: "clamp(1.375rem, 2.6vw, 2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              fontWeight: 400,
            }}
          >
            "{FEATURED.text}"
          </p>
          <footer className="mt-8">
            <p className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium">{FEATURED.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{FEATURED.product}</p>
          </footer>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mt-20 md:mt-28 max-w-5xl mx-auto">
          {SECONDARY.map((r) => (
            <div key={r.name}>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{r.text}"</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
