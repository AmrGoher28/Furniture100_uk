import { Truck, RotateCcw, ShieldCheck, Phone } from "lucide-react";

const TRUST_ICONS = [
  { icon: Truck, label: "Free Delivery" },
  { icon: RotateCcw, label: "30 Day Returns" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Phone, label: "UK Support" },
];

const ProductTrustBadges = () => (
  <div className="grid grid-cols-4 gap-2 py-4 px-1">
    {TRUST_ICONS.map((t) => (
      <div
        key={t.label}
        className="flex flex-col items-center gap-2 text-center bg-secondary/40 border border-border/50 rounded-lg py-3 px-1"
      >
        <t.icon className="w-5 h-5 text-gold" />
        <span className="text-[10px] md:text-[11px] text-muted-foreground leading-tight font-light">
          {t.label}
        </span>
      </div>
    ))}
  </div>
);

export default ProductTrustBadges;
