import { Truck, CreditCard, RotateCcw, Leaf } from "lucide-react";

const REASONS = [
  { Icon: Truck, title: "Fast Delivery", description: "Are you in a rush? We have 24 hour dispatch on 1000s of products." },
  { Icon: CreditCard, title: "Pay in 3", description: "Want to split the cost over 3 months and pay zero interest? Be our guest." },
  { Icon: RotateCcw, title: "Hassle Free Returns", description: "Everyone has the right to change their mind; we offer easy, quibble-free returns." },
  { Icon: Leaf, title: "Sustainable Shopping", description: "We're on a journey to make affordable, eco-friendly products the norm." },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2
          className="font-serif-display italic text-center text-olive mb-16 md:mb-20"
          style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 500, lineHeight: 1.1 }}
        >
          Why shop with us?
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10">
          {REASONS.map(({ Icon, title, description }) => (
            <div key={title} className="text-center flex flex-col items-center">
              <Icon className="w-10 h-10 md:w-12 md:h-12 text-foreground mb-6" strokeWidth={1} />
              <h3 className="text-sm md:text-lg font-medium uppercase tracking-[0.06em] mb-4 text-foreground">
                {title}
              </h3>
              <p className="text-xs md:text-sm text-foreground/70 leading-relaxed max-w-[240px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
