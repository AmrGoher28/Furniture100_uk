import { Truck, RotateCcw, ShieldCheck, Phone } from "lucide-react";

const TRUST_ICONS = [
  { icon: Truck, label: "Free Delivery" },
  { icon: RotateCcw, label: "30 Day Returns" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Phone, label: "UK Support" },
];

const ProductTrustBadges = () => (
  <div className="flex items-center justify-between gap-2 py-3 px-1">
    {TRUST_ICONS.map((t) => (
      <div key={t.label} className="flex flex-col items-center gap-1.5 text-center">
        <t.icon className="w-5 h-5 text-gold" />
        <span className="text-[11px] text-muted-foreground leading-tight">{t.label}</span>
      </div>
    ))}
  </div>
);

export default ProductTrustBadges;
