import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_DOMAIN = "swifliving-showroom-build-xw1vp.myshopify.com";

const UpdateSchema = z.object({
  productId: z.string().min(1),
  updates: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.union([z.string(), z.number()]).optional(),
    variantId: z.string().optional(),
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one update is required",
  }),
});

type ShopifyTokenCandidate = {
  name: "SHOPIFY_ADMIN_TOKEN" | "SHOPIFY_ACCESS_TOKEN";
  value: string;
};

function createAuthClient(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabasePublishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !supabasePublishableKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    global: { headers: { Authorization: authHeader } },
  });
}

async function resolveWorkingShopifyToken(): Promise<ShopifyTokenCandidate> {
  const candidates: ShopifyTokenCandidate[] = [
    { name: "SHOPIFY_ADMIN_TOKEN", value: Deno.env.get("SHOPIFY_ADMIN_TOKEN") || "" },
    { name: "SHOPIFY_ACCESS_TOKEN", value: Deno.env.get("SHOPIFY_ACCESS_TOKEN") || "" },
  ].filter((candidate) => candidate.value);

  if (candidates.length === 0) {
    throw new Error("No Shopify admin token is configured for backend product editing.");
  }

  const failures: string[] = [];

  for (const candidate of candidates) {
    const probe = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/shop.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": candidate.value,
      },
    });

    const probeText = await probe.text();
    console.log(`[admin-update-product] ${candidate.name} probe status=${probe.status}`);

    if (probe.ok) {
      return candidate;
    }

    failures.push(`${candidate.name}:${probe.status}`);
    console.error(`[admin-update-product] ${candidate.name} probe failed:`, probeText);
  }

  throw new Error(`No valid Shopify admin token is available (${failures.join(", ")}). Reconnect Shopify or refresh the admin token.`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createAuthClient(req);
    if (!supabase) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = UpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { productId, updates } = parsed.data;
    const { name: tokenSource, value: shopifyToken } = await resolveWorkingShopifyToken();
    console.log(`[admin-update-product] Using token source: ${tokenSource}`);

    const numericProductId = productId.replace("gid://shopify/Product/", "");
    const productUpdate: Record<string, unknown> = {
      id: Number(numericProductId),
    };

    if (updates.title !== undefined) productUpdate.title = updates.title;
    if (updates.description !== undefined) productUpdate.body_html = updates.description;

    if (updates.price !== undefined && updates.variantId) {
      const numericVariantId = updates.variantId.replace("gid://shopify/ProductVariant/", "");
      const variantRes = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/variants/${numericVariantId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyToken,
        },
        body: JSON.stringify({
          variant: {
            id: Number(numericVariantId),
            price: String(updates.price),
          },
        }),
      });

      if (!variantRes.ok) {
        const details = await variantRes.text();
        return new Response(JSON.stringify({ error: "Shopify variant update failed", details }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const hasProductLevelUpdate = Object.keys(productUpdate).length > 1;
    if (!hasProductLevelUpdate) {
      return new Response(JSON.stringify({ success: true, tokenSource }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products/${numericProductId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyToken,
      },
      body: JSON.stringify({
        product: productUpdate,
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Shopify API error", details: responseText, tokenSource }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(responseText);
    return new Response(JSON.stringify({ success: true, product: data.product, tokenSource }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-update-product error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
