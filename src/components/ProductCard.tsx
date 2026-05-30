import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
  badge?: "NEW" | "SALE" | null;
  status?: string | null;
  statusVariant?: "in-stock" | "pre-order" | "default";
  subtitle?: string;
}

/**
 * Cult-style editorial product card — soft cream tile, top badge,
 * wishlist heart, status strip at bottom of image, title, subtitle, price.
 */
export const ProductCard = ({
  product,
  priority = false,
  badge,
  status,
  statusVariant = "default",
  subtitle,
}: ProductCardProps) => {
  const images = product.node.images.edges;
  const firstImg = images[0]?.node;
  const secondImg = images[1]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const variant = product.node.variants.edges[0]?.node;
  const computedSubtitle =
    subtitle ??
    variant?.selectedOptions
      ?.filter((o) => o.name.toLowerCase() !== "title")
      .map((o) => o.value)
      .join(" & ");

  return (
    <Link to={`/product/${product.node.handle}`} className="group flex flex-col">
      <div className="relative overflow-hidden bg-cream aspect-[3/4] md:aspect-square mb-3 md:mb-4">
        {firstImg && (
          <img
            src={firstImg.url}
            alt={firstImg.altText || product.node.title}
            loading={priority ? undefined : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : undefined}
            className={`absolute inset-0 w-full h-full object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] ${
              secondImg ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {secondImg && (
          <img
            src={secondImg.url}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-[900ms] ease-out group-hover:opacity-100"
          />
        )}

        {badge && (
          <span className="absolute top-0 left-0 bg-[#A8967A] text-white text-[10px] tracking-[0.18em] uppercase font-medium px-3 py-1.5">
            {badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart className="w-4 h-4 text-foreground" strokeWidth={1.5} />
        </button>

        {status && (
          <div
            className={`absolute bottom-0 inset-x-0 text-white text-[10px] tracking-[0.2em] uppercase font-medium text-center py-2 ${
              statusVariant === "in-stock"
                ? "bg-[#5E6A45]"
                : statusVariant === "pre-order"
                ? "bg-[#A8967A]"
                : "bg-[#A8967A]"
            }`}
          >
            {status}
          </div>
        )}
      </div>

      <p className="text-sm font-medium tracking-tight text-foreground truncate">
        {product.node.title}
      </p>
      {computedSubtitle && (
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{computedSubtitle}</p>
      )}
      <p className="text-sm text-foreground mt-2 tabular-nums">
        £{parseFloat(price.amount).toFixed(0)}
      </p>
    </Link>
  );
};
