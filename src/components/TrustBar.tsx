import { Truck, RotateCcw, ShieldCheck, MapPin } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free Delivery" },
  { icon: RotateCcw, label: "30-Day Returns" },
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: MapPin, label: "UK Nationwide" },
];

export const TrustBar = () => {
  return (
    <section className="py-4 md:py-5 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 md:gap-12">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] md:text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
