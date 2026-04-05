import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Loader2, Check, X, ArrowLeftRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Offer {
  id: string;
  product_title: string;
  product_handle: string;
  product_image: string | null;
  variant_title: string | null;
  variant_id: string | null;
  original_price: number;
  offer_amount: number;
  counter_amount: number | null;
  buyer_email: string;
  buyer_name: string | null;
  status: string;
  shopify_draft_order_id: string | null;
  shopify_invoice_url: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  countered: "bg-blue-100 text-blue-800",
  counter_accepted: "bg-green-100 text-green-800",
  counter_declined: "bg-red-100 text-red-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const AdminOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [counterAmounts, setCounterAmounts] = useState<Record<string, string>>({});

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Failed to load offers");
    } else {
      setOffers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
    // Real-time subscription
    const channel = supabase
      .channel("offers-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "offers" }, () => {
        fetchOffers();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAction = async (offerId: string, action: "accept" | "decline" | "counter", counterAmount?: number) => {
    setActionLoading(offerId);
    try {
      const { data, error } = await supabase.functions.invoke("handle-offer", {
        body: { action, offerId, counterAmount },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(
        action === "accept" ? "Offer accepted! Draft order created." :
        action === "decline" ? "Offer declined." :
        "Counter offer sent!"
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} offer`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif mb-2">Offer Management</h1>
          <p className="text-muted-foreground mb-8">Review and manage customer offers</p>

          {offers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No offers yet</p>
              <p className="text-sm mt-2">Offers from customers will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-border rounded-lg p-5 bg-card">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product info */}
                    {offer.product_image && (
                      <img
                        src={offer.product_image}
                        alt={offer.product_title}
                        className="w-20 h-20 object-cover rounded-md shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{offer.product_title}</h3>
                          {offer.variant_title && offer.variant_title !== "Default Title" && (
                            <p className="text-xs text-muted-foreground">{offer.variant_title}</p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${statusColors[offer.status] || "bg-muted text-muted-foreground"}`}>
                          {offer.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground text-xs">Listed Price</p>
                          <p className="font-medium">£{offer.original_price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Offer</p>
                          <p className="font-medium text-foreground">£{offer.offer_amount.toFixed(2)}</p>
                        </div>
                        {offer.counter_amount && (
                          <div>
                            <p className="text-muted-foreground text-xs">Counter</p>
                            <p className="font-medium">£{offer.counter_amount.toFixed(2)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground text-xs">Buyer</p>
                          <p className="font-medium truncate">{offer.buyer_name || offer.buyer_email}</p>
                          <p className="text-xs text-muted-foreground truncate">{offer.buyer_email}</p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        {new Date(offer.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>

                      {/* Actions for pending offers */}
                      {offer.status === "pending" && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAction(offer.id, "accept")}
                            disabled={actionLoading === offer.id}
                            className="gap-1"
                          >
                            {actionLoading === offer.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(offer.id, "decline")}
                            disabled={actionLoading === offer.id}
                            className="gap-1"
                          >
                            <X className="h-3 w-3" />
                            Decline
                          </Button>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              placeholder="Counter £"
                              value={counterAmounts[offer.id] || ""}
                              onChange={(e) => setCounterAmounts((prev) => ({ ...prev, [offer.id]: e.target.value }))}
                              className="w-28 h-9 text-sm"
                              min="1"
                              step="0.01"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const amt = parseFloat(counterAmounts[offer.id]);
                                if (!amt || amt <= 0) {
                                  toast.error("Enter a valid counter amount");
                                  return;
                                }
                                handleAction(offer.id, "counter", amt);
                              }}
                              disabled={actionLoading === offer.id}
                              className="gap-1"
                            >
                              <ArrowLeftRight className="h-3 w-3" />
                              Counter
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Shopify link */}
                      {offer.shopify_invoice_url && (
                        <a
                          href={offer.shopify_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Shopify Invoice
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default AdminOffers;
