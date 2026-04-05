import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.4/cors";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "";
const shopifyAdminToken = Deno.env.get("SHOPIFY_ADMIN_TOKEN") || "";
const shopifyStoreDomain = "swifliving-showroom-build-xw1vp.myshopify.com";
const siteUrl = Deno.env.get("SITE_URL") || "https://luxe-calm-shop.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { action } = body;

    if (action === "new_offer") {
      // Send notification email to admin
      const { productTitle, originalPrice, offerAmount, buyerEmail, buyerName, variantTitle } = body;
      
      if (adminEmail) {
        const emailHtml = `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F5F0EB; padding: 30px;">
            <h1 style="color: #2C2C2C; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 20px;">New Offer Received</h1>
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="color: #2C2C2C; margin: 0 0 8px;"><strong>Product:</strong> ${productTitle}${variantTitle && variantTitle !== "Default Title" ? ` — ${variantTitle}` : ""}</p>
              <p style="color: #2C2C2C; margin: 0 0 8px;"><strong>Listed Price:</strong> £${Number(originalPrice).toFixed(2)}</p>
              <p style="color: #5C4033; margin: 0 0 8px; font-size: 18px;"><strong>Offer: £${Number(offerAmount).toFixed(2)}</strong></p>
              <p style="color: #7A7168; margin: 0 0 4px;"><strong>Buyer:</strong> ${buyerName || "N/A"}</p>
              <p style="color: #7A7168; margin: 0;"><strong>Email:</strong> ${buyerEmail}</p>
            </div>
            <p style="color: #7A7168; font-size: 14px;">
              <a href="${siteUrl}/admin/offers" style="color: #5C4033; text-decoration: underline;">Manage this offer →</a>
            </p>
          </div>
        `;

        // Use Supabase's built-in email or a configured service
        // For now, log the notification (email service will be configured separately)
        console.log(`[OFFER NOTIFICATION] New offer from ${buyerEmail} for ${productTitle}: £${offerAmount}`);
        console.log(`Admin email would be sent to: ${adminEmail}`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "accept" || action === "decline" || action === "counter") {
      const { offerId, counterAmount } = body;

      // Fetch offer
      const { data: offer, error: fetchErr } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

      if (fetchErr || !offer) {
        return new Response(JSON.stringify({ error: "Offer not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "decline") {
        await supabase.from("offers").update({ status: "declined" }).eq("id", offerId);
        
        // TODO: Send decline email to buyer
        console.log(`[OFFER] Declined offer ${offerId} from ${offer.buyer_email}`);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "counter") {
        if (!counterAmount || counterAmount <= 0) {
          return new Response(JSON.stringify({ error: "Invalid counter amount" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await supabase.from("offers").update({ status: "countered", counter_amount: counterAmount }).eq("id", offerId);

        // TODO: Send counter email to buyer
        console.log(`[OFFER] Counter offer ${offerId}: £${counterAmount}`);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "accept") {
        const agreedPrice = offer.offer_amount;
        const discount = offer.original_price - agreedPrice;

        // Try to create Shopify Draft Order
        if (shopifyAdminToken) {
          try {
            const draftOrderRes = await fetch(
              `https://${shopifyStoreDomain}/admin/api/2025-07/draft_orders.json`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Shopify-Access-Token": shopifyAdminToken,
                },
                body: JSON.stringify({
                  draft_order: {
                    line_items: [
                      {
                        variant_id: offer.variant_id ? offer.variant_id.replace("gid://shopify/ProductVariant/", "") : undefined,
                        title: offer.product_title,
                        price: agreedPrice.toString(),
                        quantity: 1,
                      },
                    ],
                    applied_discount: {
                      description: "Accepted offer price",
                      value_type: "fixed_amount",
                      value: discount.toString(),
                      amount: discount.toString(),
                      title: "Negotiated Price",
                    },
                    email: offer.buyer_email,
                    note: `Accepted offer - Original: £${offer.original_price}, Offer: £${agreedPrice}`,
                    send_receipt: true,
                    send_fulfillment_receipt: true,
                  },
                }),
              }
            );

            const draftOrderData = await draftOrderRes.json();
            
            if (draftOrderData.draft_order) {
              const draftOrder = draftOrderData.draft_order;
              
              // Send invoice
              await fetch(
                `https://${shopifyStoreDomain}/admin/api/2025-07/draft_orders/${draftOrder.id}/send_invoice.json`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopifyAdminToken,
                  },
                  body: JSON.stringify({
                    draft_order_invoice: {
                      to: offer.buyer_email,
                      subject: `Your offer for ${offer.product_title} has been accepted!`,
                      custom_message: `Great news! Your offer of £${agreedPrice.toFixed(2)} for ${offer.product_title} has been accepted. Please complete your purchase using the link below.`,
                    },
                  }),
                }
              );

              await supabase.from("offers").update({
                status: "accepted",
                shopify_draft_order_id: draftOrder.id.toString(),
                shopify_invoice_url: draftOrder.invoice_url || null,
              }).eq("id", offerId);

              console.log(`[OFFER] Accepted offer ${offerId}, Draft Order created: ${draftOrder.id}`);
            } else {
              console.error("[OFFER] Failed to create draft order:", draftOrderData);
              await supabase.from("offers").update({ status: "accepted" }).eq("id", offerId);
            }
          } catch (shopifyErr) {
            console.error("[OFFER] Shopify API error:", shopifyErr);
            await supabase.from("offers").update({ status: "accepted" }).eq("id", offerId);
          }
        } else {
          // No Shopify admin token — just mark as accepted
          await supabase.from("offers").update({ status: "accepted" }).eq("id", offerId);
          console.log(`[OFFER] Accepted offer ${offerId} (no Shopify token configured)`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[OFFER] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
