import { Truck, RotateCcw, CreditCard, Phone } from "lucide-react";

const REASONS = [
  {
    icon: Truck,
    title: "Free Nationwide Delivery",
    description: "We deliver to every corner of the UK at no extra cost",
  },
  {
    icon: RotateCcw,
    title: "Hassle Free Returns",
    description: "Not happy? Return within 30 days, no questions asked",
  },
  {
    icon: CreditCard,
    title: "Buy Now Pay Later",
    description: "Spread the cost with Klarna and Clearpay",
  },
  {
    icon: Phone,
    title: "UK Customer Support",
    description: "Real people, real help, whenever you need us",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((r) => (
            <div key={r.title} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <r.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
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
