import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listMyOffers from "./tools/list-my-offers";
import listMyWishlist from "./tools/list-my-wishlist";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "furniture100-mcp",
  title: "Furniture100",
  version: "0.1.0",
  instructions:
    "Furniture100 storefront tools. Use `search_products` and `get_product` to browse the catalogue. Use `list_my_offers` and `list_my_wishlist` to read the signed-in customer's saved items and price offers.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchProducts, getProduct, listMyOffers, listMyWishlist],
});
