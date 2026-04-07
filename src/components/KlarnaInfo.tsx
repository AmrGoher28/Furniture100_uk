import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface KlarnaInfoProps {
  price: number;
}

const KlarnaInfo = ({ price }: KlarnaInfoProps) => {
  const monthly = (price / 3).toFixed(2);

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
      <span>Or 3 interest-free payments of</span>
      <span className="font-medium text-foreground">£{monthly}</span>
      <span>with</span>
      <Dialog>
        <DialogTrigger asChild>
          <button className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity">
            <span
              className="font-semibold text-[#FFB3C7] bg-[#0A0B09] px-1.5 py-0.5 rounded text-[10px] tracking-wide"
            >
              klarna.
            </span>
            <span className="underline underline-offset-2 text-muted-foreground/80 text-[11px]">
              Learn more
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Pay in 3 with Klarna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Split your purchase into <span className="font-medium text-foreground">3 equal interest-free payments</span>.
              The first payment is taken when you place your order, and the remaining two are automatically collected every 30 days.
            </p>
            <div className="bg-card rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-foreground mb-3">Example for this item:</p>
              <div className="flex justify-between text-xs">
                <span>1st payment (today)</span>
                <span className="font-medium text-foreground">£{monthly}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>2nd payment (30 days)</span>
                <span className="font-medium text-foreground">£{monthly}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>3rd payment (60 days)</span>
                <span className="font-medium text-foreground">£{monthly}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70">
              18+. T&Cs apply. A soft credit check may be performed. Late fees may apply if you miss a payment.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KlarnaInfo;
