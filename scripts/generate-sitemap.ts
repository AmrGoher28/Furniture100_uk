// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
// Fetches all Shopify product handles via the Storefront API so every
// product has a crawlable URL in the sitemap.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { CATEGORIES } from "../src/lib/categories";

const BASE_URL = "https://furniture100.co.uk";
const SHOPIFY_DOMAIN = "swifliving-showroom-build-xw1vp.myshopify.com";
const SHOPIFY_TOKEN = "73f85d3bdb6f0f9ac02b43a88c6edf8d";
const SHOPIFY_URL = `https://${SHOPIFY_DOMAIN}/api/2025-07/graphql.json`;

interface Entry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

const STATIC: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/delivery", changefreq: "monthly", priority: "0.5" },
  { path: "/returns", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
];

async function fetchAllProductHandles(): Promise<{ handle: string; updatedAt?: string }[]> {
  const handles: { handle: string; updatedAt?: string }[] = [];
  let cursor: string | null = null;
  const query = `
    query ($cursor: String) {
      products(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges { node { handle updatedAt } }
      }
    }`;
  while (true) {
    const res: Response = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables: { cursor } }),
    });
    if (!res.ok) {
      console.warn(`[sitemap] Shopify fetch failed (${res.status}); skipping products`);
      return handles;
    }
    const json: any = await res.json();
    const products = json?.data?.products;
    if (!products) return handles;
    for (const edge of products.edges) {
      handles.push({ handle: edge.node.handle, updatedAt: edge.node.updatedAt });
    }
    if (!products.pageInfo.hasNextPage) break;
    cursor = products.pageInfo.endCursor;
  }
  return handles;
}

function categoryEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const cat of CATEGORIES) {
    entries.push({ path: `/category/${cat.slug}`, changefreq: "weekly", priority: "0.8" });
  }
  return entries;
}

function generate(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

(async () => {
  const products = await fetchAllProductHandles();
  const productEntries: Entry[] = products.map((p) => ({
    path: `/product/${p.handle}`,
    changefreq: "weekly",
    priority: "0.7",
    lastmod: p.updatedAt ? p.updatedAt.slice(0, 10) : undefined,
  }));

  const entries = [...STATIC, ...categoryEntries(), ...productEntries];
  writeFileSync(resolve("public/sitemap.xml"), generate(entries));
  console.log(`sitemap.xml written (${entries.length} entries, ${productEntries.length} products)`);
})();
