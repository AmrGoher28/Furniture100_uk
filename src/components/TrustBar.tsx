import { Truck, RotateCcw, Star, ShieldCheck, Phone } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free UK Delivery" },
  { icon: RotateCcw, label: "30 Day Returns" },
  { icon: Star, label: "Rated Excellent" },
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: Phone, label: "UK Based Support" },
];

export const TrustBar = () => {
  return (
    <section className="bg-card py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <item.icon className="w-6 h-6 text-primary" />
            <span className="text-xs md:text-sm font-light tracking-wide text-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
