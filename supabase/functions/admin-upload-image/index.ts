import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_DOMAIN = "swifliving-showroom-build-xw1vp.myshopify.com";

const UploadSchema = z.object({
  productId: z.string().min(1),
  imageBase64: z.string().optional(),
  action: z.string().optional(),
  imageId: z.union([z.string(), z.number()]).optional(),
});

type ShopifyTokenCandidate = {
  name: string;
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

function getShopifyTokenCandidates(): ShopifyTokenCandidate[] {
  const env = Deno.env.toObject();
  return Object.entries(env)
    .filter(([key, value]) => {
      if (!value) return false;
      return key === "SHOPIFY_ADMIN_TOKEN"
        || key === "SHOPIFY_ACCESS_TOKEN"
        || key.startsWith("SHOPIFY_ONLINE_ACCESS_TOKEN");
    })
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const score = (name: string) => {
        if (name.startsWith("SHOPIFY_ONLINE_ACCESS_TOKEN")) return 0;
        if (name === "SHOPIFY_ADMIN_TOKEN") return 1;
        return 2;
      };
      return score(a.name) - score(b.name);
    });
}

async function resolveWorkingShopifyToken(): Promise<ShopifyTokenCandidate> {
  const candidates = getShopifyTokenCandidates();

  if (candidates.length === 0) {
    throw new Error("No Shopify token is configured for image management.");
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
    console.log(`[admin-upload-image] ${candidate.name} probe status=${probe.status}`);

    if (probe.ok) {
      return candidate;
    }

    failures.push(`${candidate.name}:${probe.status}`);
    console.error(`[admin-upload-image] ${candidate.name} probe failed:`, probeText);
  }

  throw new Error(`No valid Shopify token is available (${failures.join(", ")}). Reconnect Shopify or refresh the token.`);
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

    const parsed = UploadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { productId, imageBase64, action, imageId } = parsed.data;
    const { name: tokenSource, value: shopifyToken } = await resolveWorkingShopifyToken();
    console.log(`[admin-upload-image] Using token source: ${tokenSource}`);

    const numericProductId = productId.replace("gid://shopify/Product/", "");

    if (action === "delete" && imageId) {
      const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products/${numericProductId}/images/${imageId}.json`, {
        method: "DELETE",
        headers: {
          "X-Shopify-Access-Token": shopifyToken,
        },
      });

      const responseText = await response.text();
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "Shopify image delete failed", details: responseText, tokenSource }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, tokenSource }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products/${numericProductId}/images.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyToken,
      },
      body: JSON.stringify({
        image: { attachment: base64Data },
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Shopify upload error", details: responseText, tokenSource }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(responseText);
    return new Response(JSON.stringify({ success: true, image: data.image, tokenSource }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-upload-image error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
