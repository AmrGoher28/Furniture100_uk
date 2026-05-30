import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { requireAdmin } from "../_shared/admin-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "";
const shopifyStoreDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN") || "swifliving-showroom-build-xw1vp.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
const siteUrl = Deno.env.get("SITE_URL") || "https://luxe-calm-shop.lovable.app";

type ShopifyRequestResult =
  | {
      success: true;
      data: unknown;
      text: string;
      status: number;
    }
  | {
      success: false;
      error: string;
      details?: string;
      status: number;
    };

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseJsonSafely(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function stringifyDetails(value: unknown) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

async function shopifyAdminRequest(
  endpoint: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {},
): Promise<ShopifyRequestResult> {
  // Collect all candidate tokens
  const envObj = Deno.env.toObject();
  const candidates: { name: string; value: string }[] = [];
  
  for (const [key, value] of Object.entries(envObj)) {
    if (key.startsWith("SHOPIFY_ONLINE_ACCESS_TOKEN") && value) {
      candidates.unshift({ name: key, value }); // prefer online tokens
    }
  }
  const adminToken = Deno.env.get("SHOPIFY_ADMIN_TOKEN");
  if (adminToken) candidates.push({ name: "SHOPIFY_ADMIN_TOKEN", value: adminToken });
  const accessToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (accessToken) candidates.push({ name: "SHOPIFY_ACCESS_TOKEN", value: accessToken });

  if (candidates.length === 0) {
    console.error("[OFFER] No Shopify tokens found");
    return { success: false, error: "Shopify is not authenticated.", status: 502 };
  }

  // Try each token
  for (const candidate of candidates) {
    try {
      const url = `https://${shopifyStoreDomain}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;
      console.log(`[OFFER] Trying ${candidate.name} for ${options.method ?? "GET"} ${url}`);

      const response = await fetch(url, {
        method: options.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": candidate.value,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const text = await response.text();
      const data = parseJsonSafely(text);

      if (response.ok) {
        console.log(`[OFFER] Shopify ${endpoint} succeeded with ${candidate.name}`);
        return { success: true, data, text, status: response.status };
      }

      if (response.status === 401 || response.status === 403) {
        console.warn(`[OFFER] Token ${candidate.name} rejected (${response.status}), trying next...`);
        continue;
      }

      const details = stringifyDetails(data);
      console.error(`[OFFER] Shopify ${endpoint} failed: ${response.status} ${details}`);
      return { success: false, error: "Shopify could not process this offer request.", details, status: response.status };
    } catch (err) {
      console.error(`[OFFER] Error with ${candidate.name}:`, err);
      continue;
    }
  }

  return {
    success: false,
    error: "All Shopify tokens were rejected. Please reconnect your Shopify account.",
    status: 401,
  };
}

async function sendOfferEmail(
  supabase: any,
  templateName: string,
  recipientEmail: string,
  templateData: Record<string, any>,
  idempotencyKey: string,
) {
  try {
    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName,
        recipientEmail,
        idempotencyKey,
        templateData,
      },
    });

    if (error) {
      console.error(`[OFFER] Failed to send ${templateName} email:`, error);
    } else {
      console.log(`[OFFER] ${templateName} email queued for ${recipientEmail}`);
    }
  } catch (err) {
    console.error(`[OFFER] Error sending ${templateName} email:`, err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { action } = body;

    if (action === "new_offer") {
      const { productTitle, offerAmount, buyerEmail } = body;

      if (adminEmail) {
        console.log(`[OFFER NOTIFICATION] New offer from ${buyerEmail} for ${productTitle}: £${offerAmount}`);
        console.log(`Admin email would be sent to: ${adminEmail}`);
      }

      return jsonResponse({ success: true });
    }

    if (action === "accept" || action === "decline" || action === "counter") {
      const auth = await requireAdmin(req);
      if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status);
      }
      const { offerId, counterAmount } = body;

      const { data: offer, error: fetchErr } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

      if (fetchErr || !offer) {
        return jsonResponse({ error: "Offer not found" }, 404);
      }

      if (action === "decline") {
        await supabase.from("offers").update({ status: "declined" }).eq("id", offerId);

        await sendOfferEmail(supabase, "offer-declined", offer.buyer_email, {
          productTitle: offer.product_title,
          originalPrice: Number(offer.original_price).toFixed(2),
          offerAmount: Number(offer.offer_amount).toFixed(2),
          shopUrl: `${siteUrl}/shop`,
        }, `offer-declined-${offerId}`);

        return jsonResponse({ success: true });
      }

      if (action === "counter") {
        if (!counterAmount || counterAmount <= 0) {
          return jsonResponse({ error: "Invalid counter amount" }, 400);
        }

        await supabase.from("offers").update({ status: "countered", counter_amount: counterAmount }).eq("id", offerId);

        await sendOfferEmail(supabase, "offer-counter", offer.buyer_email, {
          productTitle: offer.product_title,
          originalPrice: Number(offer.original_price).toFixed(2),
          offerAmount: Number(offer.offer_amount).toFixed(2),
          counterAmount: Number(counterAmount).toFixed(2),
          productUrl: `${siteUrl}/product/${offer.product_handle}`,
        }, `offer-counter-${offerId}`);

        return jsonResponse({ success: true });
      }

      if (action === "accept") {
        const agreedPrice = Number(offer.offer_amount);
        const discount = Number(offer.original_price) - agreedPrice;

        try {
          const draftOrderResult = await shopifyAdminRequest("draft_orders.json", {
            method: "POST",
            body: {
              draft_order: {
                line_items: [
                  {
                    variant_id: offer.variant_id
                      ? offer.variant_id.replace("gid://shopify/ProductVariant/", "")
                      : undefined,
                    quantity: offer.quantity || 1,
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
              },
            },
          });

          if (!draftOrderResult.success) {
            console.error("[OFFER] Draft order request failed:", draftOrderResult.details);
            return jsonResponse({
              error: draftOrderResult.error,
              details: draftOrderResult.details,
            }, draftOrderResult.status || 502);
          }

          const draftOrderPayload = (draftOrderResult as { success: true; data: unknown }).data as Record<string, any> | string | null;
          const draftOrder = typeof draftOrderPayload === "object" && draftOrderPayload ? draftOrderPayload.draft_order : null;

          if (!draftOrder) {
            console.error("[OFFER] Missing draft order in Shopify response:", (draftOrderResult as { success: true; text: string }).text);
            return jsonResponse({
              error: "Shopify did not return a draft order.",
              details: stringifyDetails(draftOrderPayload),
            }, 502);
          }

          const invoiceResult = await shopifyAdminRequest(`draft_orders/${draftOrder.id}/send_invoice.json`, {
            method: "POST",
            body: {
              draft_order_invoice: {
                to: offer.buyer_email,
                subject: `Your offer for ${offer.product_title} has been accepted!`,
                custom_message: `Great news! Your offer of £${agreedPrice.toFixed(2)} for ${offer.product_title} has been accepted. Please complete your purchase using the link below.`,
              },
            },
          });

          await supabase.from("offers").update({
            status: "accepted",
            shopify_draft_order_id: draftOrder.id?.toString() || null,
            shopify_invoice_url: draftOrder.invoice_url || null,
          }).eq("id", offerId);

          if (!invoiceResult.success) {
            console.error("[OFFER] Invoice send failed:", invoiceResult.details);
            return jsonResponse({
              error: "The draft order was created, but Shopify could not send the invoice email.",
              invoiceUrl: draftOrder.invoice_url || null,
              details: invoiceResult.details,
            }, invoiceResult.status ?? 502);
          }

          console.log(`[OFFER] Accepted offer ${offerId}, Draft Order created: ${draftOrder.id}`);
          console.log(`[OFFER] Invoice send result:`, stringifyDetails((invoiceResult as { success: true; data: unknown }).data));

          return jsonResponse({
            success: true,
            draftOrderId: draftOrder.id?.toString() || null,
            invoiceUrl: draftOrder.invoice_url || null,
          });
        } catch (shopifyErr) {
          console.error("[OFFER] Shopify API error:", shopifyErr);
          return jsonResponse({
            error: shopifyErr instanceof Error
              ? shopifyErr.message
              : "Unexpected Shopify error while creating the draft order.",
          });
        }
      }
    }

    return jsonResponse({ error: "Invalid action" }, 400);
  } catch (err) {
    console.error("[OFFER] Error:", err);
    return jsonResponse({
      error: err instanceof Error ? err.message : "Unknown error",
    }, 500);
  }
});