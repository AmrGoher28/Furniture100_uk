import { Link } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

/**
 * Editorial product card — borderless, portrait, calm.
 * Used on homepage best sellers, category grid, and similar products.
 */
export const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const images = product.node.images.edges;
  const firstImg = images[0]?.node;
  const secondImg = images[1]?.node;
  const price = product.node.priceRange.minVariantPrice;

  return (
    <Link
      to={`/product/${product.node.handle}`}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden bg-[#FAFAFA] aspect-square sm:aspect-[4/5] mb-4">
        {firstImg && (
          <img
            src={firstImg.url}
            alt={firstImg.altText || product.node.title}
            loading={priority ? undefined : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] ${
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
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-[900ms] ease-out group-hover:opacity-100"
          />
        )}
      </div>
      <p className="text-sm font-normal tracking-tight text-foreground truncate">
        {product.node.title}
      </p>
      <p className="text-sm text-muted-foreground mt-1 tabular-nums">
        £{parseFloat(price.amount).toFixed(0)}
      </p>
    </Link>
  );
};
