import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SHOPIFY_URL = "https://swifliving-showroom-build-xw1vp.myshopify.com/api/2025-07/graphql.json";
const SHOPIFY_TOKEN = "73f85d3bdb6f0f9ac02b43a88c6edf8d";

const QUERY = /* GraphQL */ `
  query Search($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          handle
          title
          description
          availableForSale
          priceRange { minVariantPrice { amount currencyCode } }
          featuredImage { url altText }
          onlineStoreUrl
        }
      }
    }
  }
`;

export default defineTool({
  name: "search_products",
  title: "Search products",
  description: "Search the Furniture100 catalogue by keyword and return matching products with price, availability and product URL.",
  inputSchema: {
    query: z.string().min(1).describe("Search query, e.g. 'oak dining table'."),
    limit: z.number().int().min(1).max(20).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const res = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query: QUERY, variables: { query, first: limit ?? 10 } }),
    });
    if (!res.ok) {
      return { content: [{ type: "text", text: `Shopify error: ${res.status}` }], isError: true };
    }
    const json = await res.json();
    const products = (json?.data?.products?.edges ?? []).map((e: any) => ({
      handle: e.node.handle,
      title: e.node.title,
      description: e.node.description?.slice(0, 300),
      price: `${e.node.priceRange?.minVariantPrice?.amount} ${e.node.priceRange?.minVariantPrice?.currencyCode}`,
      inStock: e.node.availableForSale,
      image: e.node.featuredImage?.url,
      url: `https://furniture100.co.uk/product/${e.node.handle}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
