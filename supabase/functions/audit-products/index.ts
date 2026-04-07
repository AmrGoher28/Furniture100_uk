import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_STORE_DOMAIN = "swifliving-showroom-build-xw1vp.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
const STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id title description handle
          images(first: 1) { edges { node { url } } }
        }
      }
    }
  }
`;

async function fetchAllProducts(token: string) {
  const allProducts: any[] = [];
  let hasNext = true;
  let cursor: string | null = null;

  while (hasNext) {
    const variables: any = { first: 50 };
    if (cursor) variables.after = cursor;

    const res = await fetch(STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables }),
    });
    const json = await res.json();
    const edges = json?.data?.products?.edges || [];
    const pageInfo = json?.data?.products?.pageInfo || {};
    allProducts.push(...edges.map((e: any) => e.node));
    hasNext = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }
  return allProducts;
}

const AUDIT_TOOL = {
  type: "function" as const,
  function: {
    name: "product_audit_result",
    description:
      "Return the structured audit result for a product image vs description analysis.",
    parameters: {
      type: "object",
      properties: {
        image_match_score: {
          type: "integer",
          description: "0-100 score of how well the description matches the image",
        },
        image_match_notes: {
          type: "string",
          description: "Explanation of any mismatches between image and description",
        },
        suggested_description: {
          type: "string",
          description:
            "An improved product description that accurately reflects the image. Return empty string if current description is good.",
        },
        inferred_specs: {
          type: "object",
          properties: {
            dimensions: { type: "string" },
            material: { type: "string" },
            weight: { type: "string" },
            color: { type: "string" },
            care_instructions: { type: "string" },
          },
          description: "Specs inferred from the product image",
        },
        flags: {
          type: "array",
          items: { type: "string" },
          description:
            "List of flags e.g. description_mismatch, missing_dimensions, missing_material, missing_color, vague_description",
        },
      },
      required: [
        "image_match_score",
        "image_match_notes",
        "suggested_description",
        "inferred_specs",
        "flags",
      ],
      additionalProperties: false,
    },
  },
};

async function auditProduct(
  product: any,
  apiKey: string
): Promise<any> {
  const imageUrl = product.images?.edges?.[0]?.node?.url;
  if (!imageUrl) {
    return {
      image_match_score: 0,
      image_match_notes: "No product image available to analyze.",
      suggested_description: "",
      inferred_specs: {},
      flags: ["no_image"],
    };
  }

  const userContent: any[] = [
    {
      type: "text",
      text: `Analyze this product:\n\nTitle: ${product.title}\nCurrent Description: ${product.description || "(empty)"}\n\nCompare the image against the description. Rate the match 0-100, note mismatches, infer any missing specs (dimensions, material, weight, color, care), suggest an improved description if needed, and list flags.`,
    },
    {
      type: "image_url",
      image_url: { url: imageUrl },
    },
  ];

  const res = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a product data quality auditor for a luxury furniture e-commerce store. Analyze product images and descriptions for accuracy and completeness. Be specific and practical in your suggestions.",
          },
          { role: "user", content: userContent },
        ],
        tools: [AUDIT_TOOL],
        tool_choice: {
          type: "function",
          function: { name: "product_audit_result" },
        },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`AI gateway error ${res.status}:`, text);
    throw new Error(`AI gateway error: ${res.status}`);
  }

  const json = await res.json();
  const toolCall = json?.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("No tool call in AI response");
  }
  return JSON.parse(toolCall.function.arguments);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SHOPIFY_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
    if (!SHOPIFY_TOKEN)
      throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const batchSize = body.batchSize || 5;
    const offset = body.offset || 0;

    // Fetch all products once
    const allProducts = await fetchAllProducts(SHOPIFY_TOKEN);
    const totalProducts = allProducts.length;
    const batch = allProducts.slice(offset, offset + batchSize);

    if (batch.length === 0) {
      return new Response(
        JSON.stringify({ results: [], total: totalProducts, offset, done: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const batchId = body.batchId || crypto.randomUUID();
    const results: any[] = [];

    // Process products with delay between calls
    for (let i = 0; i < batch.length; i++) {
      const product = batch[i];
      try {
        const audit = await auditProduct(product, LOVABLE_API_KEY);

        const row = {
          product_handle: product.handle,
          product_title: product.title,
          product_image: product.images?.edges?.[0]?.node?.url || null,
          original_description: product.description || null,
          suggested_description: audit.suggested_description || null,
          image_match_score: audit.image_match_score,
          image_match_notes: audit.image_match_notes,
          inferred_specs: audit.inferred_specs || {},
          flags: audit.flags || [],
          status: "pending",
          audit_batch_id: batchId,
        };

        const { error } = await supabase.from("product_audits").insert(row);
        if (error) console.error("Insert error:", error);

        results.push(row);
      } catch (err) {
        console.error(`Error auditing ${product.handle}:`, err);
        results.push({
          product_handle: product.handle,
          product_title: product.title,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }

      // Rate limit: 2s delay between AI calls
      if (i < batch.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    const done = offset + batchSize >= totalProducts;

    return new Response(
      JSON.stringify({ results, total: totalProducts, offset, batchId, done }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("audit-products error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
