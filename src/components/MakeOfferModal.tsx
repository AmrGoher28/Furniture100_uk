import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Tag } from "lucide-react";

interface MakeOfferModalProps {
  productTitle: string;
  productHandle: string;
  productImage?: string;
  variantId?: string;
  variantTitle?: string;
  originalPrice: number;
}

const MakeOfferModal = ({
  productTitle,
  productHandle,
  productImage,
  variantId,
  variantTitle,
  originalPrice,
}: MakeOfferModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(offerAmount);
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
        buyer_email: email.trim(),
        buyer_name: name.trim() || null,
      });

      if (error) throw error;

      // Trigger notification edge function
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
            buyerEmail: email.trim(),
            buyerName: name.trim(),
          },
        });
      } catch {
        // Non-critical — offer is saved even if notification fails
        console.warn("Offer notification failed");
      }

      toast.success("Offer submitted!", {
        description: "We'll review your offer and get back to you via email.",
        position: "top-center",
      });
      setOpen(false);
      setName("");
      setEmail("");
      setOfferAmount("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          <Tag className="w-4 h-4" />
          Make an Offer
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Make an Offer</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {productTitle}
            {variantTitle && variantTitle !== "Default Title" && (
              <span> — {variantTitle}</span>
            )}
          </p>
          <p className="text-sm font-medium mt-1">
            Listed price: <span className="text-foreground">£{originalPrice.toFixed(2)}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="offer-name" className="text-sm">Your Name</Label>
            <Input
              id="offer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="offer-email" className="text-sm">Your Email *</Label>
            <Input
              id="offer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="offer-amount" className="text-sm">Your Offer (£) *</Label>
            <Input
              id="offer-amount"
              type="number"
              required
              min="1"
              step="0.01"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder={`e.g. ${(originalPrice * 0.85).toFixed(0)}`}
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit Offer"
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We'll review your offer and respond via email within 24 hours.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
