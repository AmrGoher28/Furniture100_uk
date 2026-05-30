import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, X, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { trackBeginCheckout } from "@/lib/gtag";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      trackBeginCheckout({
        items: items.map((i) => ({
          itemId: i.variantId,
          itemName: i.product?.node?.title ?? i.variantTitle,
          price: parseFloat(i.price.amount),
          quantity: i.quantity,
        })),
        totalValue: totalPrice,
      });
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="relative p-2"
          aria-label={totalItems > 0 ? `Open shopping bag, ${totalItems} item${totalItems !== 1 ? "s" : ""}` : "Open shopping bag"}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center" aria-hidden="true">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full border-l border-border bg-background">
        <SheetHeader className="flex-shrink-0 pb-6 border-b border-border">
          <SheetTitle className="text-lg tracking-[0.1em]">Your Bag</SheetTitle>
          <SheetDescription className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-light">
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" strokeWidth={1} />
                <p className="text-muted-foreground font-light text-sm">Nothing here yet</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-20 h-24 bg-card overflow-hidden flex-shrink-0 rounded-lg">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-normal">{item.product.node.title}</h4>
                        <button onClick={() => removeItem(item.variantId)} className="p-1 text-muted-foreground hover:text-foreground" aria-label={`Remove ${item.product.node.title} from bag`}>
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      {item.selectedOptions.length > 0 && item.selectedOptions[0].value !== "Default Title" && (
                        <p className="text-xs text-muted-foreground mt-0.5 font-light">{item.selectedOptions.map(o => o.value).join(" / ")}</p>
                      )}
                      <p className="text-sm mt-1">{item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-7 h-7 border border-border rounded-md flex items-center justify-center hover:bg-card transition-colors" aria-label="Decrease quantity">
                          <Minus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <span className="text-xs w-4 text-center" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-7 h-7 border border-border rounded-md flex items-center justify-center hover:bg-card transition-colors" aria-label="Increase quantity">
                          <Plus className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0 pt-6 border-t border-border space-y-5 pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.2em] uppercase font-light">Total</span>
                  <span className="text-lg">{items[0]?.price.currencyCode || "USD"} {totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 rounded-full text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
