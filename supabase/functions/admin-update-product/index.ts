import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const shopifyAdminToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN") || Deno.env.get("SHOPIFY_ADMIN_TOKEN") || "";
const shopifyStoreDomain = "swifliving-showroom-build-xw1vp.myshopify.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "";
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!shopifyAdminToken) {
      return new Response(JSON.stringify({ error: "Shopify Admin token not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[admin-update-product] Using token from:", Deno.env.get("SHOPIFY_ACCESS_TOKEN") ? "SHOPIFY_ACCESS_TOKEN" : "SHOPIFY_ADMIN_TOKEN");

    const body = await req.json();
    const { productId, updates } = body;

    if (!productId) {
      return new Response(JSON.stringify({ error: "productId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract numeric ID from GID
    const numericId = productId.replace("gid://shopify/Product/", "");

    const productUpdate: Record<string, unknown> = {};
    if (updates.title !== undefined) productUpdate.title = updates.title;
    if (updates.description !== undefined) productUpdate.body_html = updates.description;

    // Handle variant price update
    if (updates.price !== undefined && updates.variantId) {
      const variantNumericId = updates.variantId.replace("gid://shopify/ProductVariant/", "");
      const variantRes = await fetch(
        `https://${shopifyStoreDomain}/admin/api/2025-07/variants/${variantNumericId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": shopifyAdminToken,
          },
          body: JSON.stringify({
            variant: { id: parseInt(variantNumericId), price: updates.price.toString() },
          }),
        }
      );
      if (!variantRes.ok) {
        const errText = await variantRes.text();
        console.error("Variant update error:", errText);
      }
    }

    // Update product if there are product-level fields
    if (Object.keys(productUpdate).length > 0) {
      const res = await fetch(
        `https://${shopifyStoreDomain}/admin/api/2025-07/products/${numericId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": shopifyAdminToken,
          },
          body: JSON.stringify({ product: productUpdate }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        return new Response(JSON.stringify({ error: "Shopify API error", details: errText }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      return new Response(JSON.stringify({ success: true, product: data.product }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-update-product error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
