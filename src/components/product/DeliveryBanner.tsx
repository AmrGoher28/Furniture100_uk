import { Truck } from "lucide-react";

const DeliveryBanner = () => (
  <div className="flex items-center gap-2.5 bg-secondary/50 border-l-2 border-l-gold rounded-xl px-4 py-3 text-sm text-muted-foreground">
    <Truck className="w-4 h-4 text-gold shrink-0" />
    <span>
      Order today, delivered in <strong className="text-foreground">3–5 working days</strong>
    </span>
  </div>
);

export default DeliveryBanner;
