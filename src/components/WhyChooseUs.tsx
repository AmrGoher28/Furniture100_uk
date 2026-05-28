const REASONS = [
  { title: "Free Nationwide Delivery", description: "Delivered to every corner of the UK at no extra cost." },
  { title: "Hassle-Free Returns", description: "Return within 30 days, no questions asked." },
  { title: "Buy Now, Pay Later", description: "Spread the cost with Klarna and Clearpay." },
  { title: "UK Customer Support", description: "Real people, real help, whenever you need us." },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto border-y border-border py-20 md:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3 className="text-xs md:text-[13px] tracking-[0.15em] uppercase font-medium mb-4 text-foreground">
                {r.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
