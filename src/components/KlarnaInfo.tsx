import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface KlarnaInfoProps {
  price: number;
}

const KlarnaInfo = ({ price }: KlarnaInfoProps) => {
  const monthly = (price / 3).toFixed(2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full group flex items-center justify-between bg-[#0B0B0B] rounded-xl px-5 py-4 hover:bg-[#1a1a1a] transition-colors text-left">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-white/90">
              3 interest-free payments of{" "}
              <span className="font-semibold text-white">£{monthly}</span>{" "}
              with
            </span>
            {/* Klarna pink pill */}
            <span className="flex-shrink-0 inline-flex items-center bg-[#FFB3C7] rounded-md px-2 py-0.5">
              <span className="text-[#0B0B0B] font-bold text-[12px] tracking-tight leading-none">
                Klarna.
              </span>
            </span>
          </div>
          <Info className="h-[18px] w-[18px] text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" strokeWidth={1.5} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl">
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#0B0B0B] rounded-md px-2.5 py-1.5">
              <span className="text-[#FFB3C7] font-bold text-[11px] tracking-wide leading-none">
                Klarna
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#FFB3C7]">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Pay in 3
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <p>
            Split your purchase into{" "}
            <span className="font-medium text-foreground">
              3 equal interest-free payments
            </span>
            . The first payment is taken when you place your order, and the
            remaining two are automatically collected every 30 days.
          </p>

          <div className="rounded-lg border border-border/40 overflow-hidden">
            <div className="bg-muted/30 px-4 py-2.5 border-b border-border/30">
              <p className="text-xs font-medium text-foreground">
                Payment schedule for this item
              </p>
            </div>
            <div className="divide-y divide-border/30">
              {[
                { label: "1st payment - today", amount: monthly },
                { label: "2nd payment - 30 days", amount: monthly },
                { label: "3rd payment - 60 days", amount: monthly },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-2.5 text-[13px]"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground tabular-nums">
                    £{item.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 border-t border-border/50 bg-muted/20">
              <span className="text-[13px] font-medium text-foreground">Total</span>
              <span className="text-[13px] font-semibold text-foreground tabular-nums">
                £{price.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            18+, T&Cs apply. Credit subject to status. A soft credit check may
            be performed. Late fees may apply if you miss a payment.{" "}
            <a
              href="https://www.klarna.com/uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground/60"
            >
              klarna.com
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KlarnaInfo;
