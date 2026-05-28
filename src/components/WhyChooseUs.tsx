import { Truck, RotateCcw, CreditCard, Phone } from "lucide-react";

const REASONS = [
  { icon: Truck, title: "Free Nationwide Delivery", description: "We deliver to every corner of the UK at no extra cost." },
  { icon: RotateCcw, title: "Hassle Free Returns", description: "Not happy? Return within 30 days, no questions asked." },
  { icon: CreditCard, title: "Buy Now Pay Later", description: "Spread the cost with Klarna and Clearpay." },
  { icon: Phone, title: "UK Customer Support", description: "Real people, real help, whenever you need us." },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20 max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-5 font-medium">Why Furniture100</p>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3.25rem)", letterSpacing: "-0.03em" }}>
            Built around how you shop.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {REASONS.map((r) => (
            <div key={r.title}>
              <r.icon className="w-6 h-6 text-foreground mb-5" strokeWidth={1.5} />
              <h3 className="text-base font-semibold mb-2 tracking-tight">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
