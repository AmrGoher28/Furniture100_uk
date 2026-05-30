import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState, useRef } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import ProductStars from "./ProductStars";
import { productRating } from "@/lib/productRating";


interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
  badge?: "NEW" | "SALE" | null;
  status?: string | null;
  statusVariant?: "in-stock" | "pre-order" | "default";
  subtitle?: string;
  largeImage?: boolean;
}

/**
 * Cult-style editorial product card - soft cream tile, top badge,
 * wishlist heart, status strip at bottom of image, title, subtitle, price.
 */
export const ProductCard = ({
  product,
  priority = false,
  badge,
  status,
  statusVariant = "default",
  subtitle,
  largeImage = false,
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

  const [bgColor, setBgColor] = useState<string>("#F2F0ED");
  const detectedRef = useRef(false);

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (detectedRef.current) return;
    const img = e.currentTarget;
    try {
      const canvas = document.createElement("canvas");
      const w = (canvas.width = 8);
      const h = (canvas.height = 8);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const samples = [
        ctx.getImageData(0, 0, 1, 1).data,
        ctx.getImageData(w - 1, 0, 1, 1).data,
        ctx.getImageData(0, h - 1, 1, 1).data,
        ctx.getImageData(w - 1, h - 1, 1, 1).data,
      ];
      const avg = samples.reduce(
        (acc, d) => ({ r: acc.r + d[0], g: acc.g + d[1], b: acc.b + d[2] }),
        { r: 0, g: 0, b: 0 }
      );
      const n = samples.length;
      setBgColor(`rgb(${Math.round(avg.r / n)}, ${Math.round(avg.g / n)}, ${Math.round(avg.b / n)})`);
      detectedRef.current = true;
    } catch {
      // CORS-tainted canvas - keep fallback
    }
  };

  return (
    <Link to={`/product/${product.node.handle}`} className="group flex flex-col">
      <div
        className={`relative overflow-hidden mb-3 md:mb-4 ${largeImage ? "aspect-[4/5]" : "aspect-[3/4] md:aspect-square"}`}
        style={{ backgroundColor: bgColor }}
      >
        {firstImg && (
          <img
            src={firstImg.url}
            alt={firstImg.altText || product.node.title}
            crossOrigin="anonymous"
            onLoad={handleImgLoad}
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
            className={`absolute bottom-0 inset-x-0 text-white text-[10px] tracking-[0.2em] uppercase font-medium text-center py-1 ${
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
      <div className="mt-1.5">
        {(() => {
          const { rating, count } = productRating(product.node.handle || product.node.id);
          return <ProductStars rating={rating} count={count} />;
        })()}
      </div>
    </Link>

  );
};
