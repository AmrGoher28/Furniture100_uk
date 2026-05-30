import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Tag, Lock, Minus, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MakeOfferModalProps {
  productTitle: string;
  productHandle: string;
  productImage?: string;
  variantId?: string;
  variantTitle?: string;
  originalPrice: number;
}

const suggestPercents = [5, 10, 15] as const;

const OfferForm = ({
  productTitle,
  productImage,
  variantTitle,
  originalPrice,
  productHandle,
  variantId,
  onClose,
}: MakeOfferModalProps & { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const amount = parseFloat(offerAmount) || 0;
  const discount = amount > 0 && amount < originalPrice
    ? Math.round(((originalPrice - amount) / originalPrice) * 100)
    : 0;

  const suggestions = suggestPercents.map((pct) => ({
    pct,
    value: Math.round(originalPrice * (1 - pct / 100)),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("offers").insert({
        product_handle: productHandle,
        product_title: productTitle,
        product_image: productImage || null,
        variant_id: variantId || null,
        variant_title: variantTitle || null,
        original_price: originalPrice,
        offer_amount: amount,
        quantity,
        buyer_email: email.trim(),
        buyer_name: name.trim() || null,
      });
      if (error) throw error;

      try {
        await supabase.functions.invoke("handle-offer", {
          body: {
            action: "new_offer",
            productTitle,
            productHandle,
            productImage,
            variantTitle,
            originalPrice,
            offerAmount: amount,
            quantity,
            buyerEmail: email.trim(),
            buyerName: name.trim(),
          },
        });
      } catch {
        console.warn("Offer notification failed");
      }

      toast.success("Offer submitted!", {
        description: "We'll review your offer and get back to you via email.",
        position: "top-center",
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Product preview */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50">
        {productImage && (
          <img
            src={productImage}
            alt={productTitle}
            className="w-[60px] h-[60px] rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium">{productTitle}</p>
          {variantTitle && variantTitle !== "Default Title" && (
            <p className="text-xs text-muted-foreground">{variantTitle}</p>
          )}
          <p className="text-sm font-semibold mt-0.5">£{originalPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <p className="text-[11px] text-muted-foreground/70 font-normal">Quantity</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-xs font-medium tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Offer amount */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Your Offer (per item)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-lg">£</span>
          <Input
            type="number"
            required
            min="1"
            step="0.01"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            placeholder="0.00"
            className="pl-8 h-14 text-xl font-semibold rounded-xl border-border/60 focus-visible:ring-gold/30"
          />
        </div>
        {discount > 0 && (
          <p className="text-xs text-muted-foreground mt-1.5">
            That's <span className="font-medium text-foreground">{discount}% off</span> per item
          </p>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-2">
        {suggestions.map(({ pct, value }) => (
          <button
            key={pct}
            type="button"
            onClick={() => setOfferAmount(String(value))}
            className={`flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${
              offerAmount === String(value)
                ? "border-foreground bg-foreground text-background"
                : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-foreground/40"
            }`}
          >
            £{value} <span className="text-[10px] opacity-70">(-{pct}%)</span>
          </button>
        ))}
      </div>

      {/* Total line */}
      {amount > 0 && quantity > 1 && (
        <p className="text-xs font-medium text-muted-foreground -mt-2">
          Total for {quantity} items: <span className="text-foreground">£{(amount * quantity).toFixed(2)}</span>
        </p>
      )}

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Input
            id="offer-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
            className="peer h-12 rounded-xl pt-4 pb-1 px-3"
          />
          <label
            htmlFor="offer-name"
            className="absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]"
          >
            Your Name
          </label>
        </div>
        <div className="relative">
          <Input
            id="offer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer h-12 rounded-xl pt-4 pb-1 px-3"
          />
          <label
            htmlFor="offer-email"
            className="absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]"
          >
            Email Address *
          </label>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-13 rounded-xl text-sm font-medium gap-2"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Lock className="w-3.5 h-3.5" />
            Send My Offer
          </>
        )}
      </Button>
      <p className="text-[11px] text-muted-foreground text-center -mt-2">
        No obligation — we'll respond within 24 hours
      </p>
    </form>
  );
};

const MakeOfferModal = (props: MakeOfferModalProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const trigger = (
    <button
      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
      aria-label={`Make an offer on ${props.productTitle}`}
    >
      <Tag className="w-3.5 h-3.5" aria-hidden="true" />
      Make an Offer
    </button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh] rounded-t-2xl border-border/50">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-lg">Make an Offer</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
            <OfferForm {...props} onClose={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px] rounded-2xl bg-background border-border/50 shadow-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Make an Offer</DialogTitle>
        </DialogHeader>
        <OfferForm {...props} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
