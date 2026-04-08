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
        <button className="w-full flex items-center justify-between border border-border/40 rounded-lg px-4 py-3 mb-4 hover:border-border/70 transition-colors text-left">
          <div className="flex items-center gap-2.5">
            {/* Klarna logo badge */}
            <svg viewBox="0 0 45 25" className="h-[18px] w-auto flex-shrink-0" aria-label="Klarna">
              <rect width="45" height="25" rx="4" fill="#17120F" />
              <text
                x="22.5"
                y="17"
                textAnchor="middle"
                fill="#FFB3C7"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.3"
              >
                Klarna
              </text>
            </svg>
            <span className="text-[13px] text-foreground/80">
              3 interest-free payments of{" "}
              <span className="font-medium text-foreground">£{monthly}</span>
            </span>
          </div>
          <Info className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl">
            <svg viewBox="0 0 45 25" className="h-5 w-auto" aria-label="Klarna">
              <rect width="45" height="25" rx="4" fill="#17120F" />
              <text
                x="22.5"
                y="17"
                textAnchor="middle"
                fill="#FFB3C7"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.3"
              >
                Klarna
              </text>
            </svg>
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
                { label: "1st payment — today", amount: monthly },
                { label: "2nd payment — 30 days", amount: monthly },
                { label: "3rd payment — 60 days", amount: monthly },
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
