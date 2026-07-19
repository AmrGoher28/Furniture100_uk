import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SHOPIFY_URL = "https://swifliving-showroom-build-xw1vp.myshopify.com/api/2025-07/graphql.json";
const SHOPIFY_TOKEN = "73f85d3bdb6f0f9ac02b43a88c6edf8d";

const QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      handle
      title
      descriptionHtml
      availableForSale
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 5) { edges { node { url altText } } }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  }
`;

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description: "Fetch full details for a Furniture100 product by its handle (URL slug).",
  inputSchema: {
    handle: z.string().min(1).describe("Product handle, e.g. 'oak-dining-table'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ handle }) => {
    const res = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query: QUERY, variables: { handle } }),
    });
    if (!res.ok) {
      return { content: [{ type: "text", text: `Shopify error: ${res.status}` }], isError: true };
    }
    const json = await res.json();
    const p = json?.data?.product;
    if (!p) {
      return { content: [{ type: "text", text: "Product not found" }], isError: true };
    }
    const product = {
      handle: p.handle,
      title: p.title,
      description: p.descriptionHtml?.replace(/<[^>]+>/g, "").slice(0, 1000),
      inStock: p.availableForSale,
      price: `${p.priceRange?.minVariantPrice?.amount} ${p.priceRange?.minVariantPrice?.currencyCode}`,
      images: (p.images?.edges ?? []).map((e: any) => e.node.url),
      variants: (p.variants?.edges ?? []).map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        inStock: e.node.availableForSale,
        price: `${e.node.price?.amount} ${e.node.price?.currencyCode}`,
      })),
      url: `https://furniture100.co.uk/product/${p.handle}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
