import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, createShopifyCart } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Layout } from "@/components/Layout";
import { Loader2, Heart, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import MakeOfferModal from "@/components/MakeOfferModal";
import ProductReviews from "@/components/ProductReviews";
import SimilarProducts from "@/components/SimilarProducts";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import DeliveryBanner from "@/components/product/DeliveryBanner";
import ProductSpecs from "@/components/product/ProductSpecs";
import ProductFAQ from "@/components/product/ProductFAQ";
import KlarnaInfo from "@/components/KlarnaInfo";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ name: string; values: string[] }>;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        setProduct(data?.data?.productByHandle || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-3xl mb-4">Product Not Found</h1>
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
              Return to shop
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;
  const price = parseFloat(variant?.price.amount || "0");

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`Added ${quantity} to basket`, { position: "top-center" });
  };

  const handleBuyNow = async () => {
    if (!variant) return;
    setBuyNowLoading(true);
    try {
      const result = await createShopifyCart({
        lineId: null,
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      if (result?.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
      } else {
        toast.error("Could not create checkout");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setBuyNowLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex-1 py-10 md:py-14 px-6 md:px-12 pb-28 md:pb-14">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10 md:gap-20">
            {/* Images */}
            <div>
              <div className="relative aspect-square bg-secondary overflow-hidden rounded-xl shadow-sm mb-3 group">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
                {/* Mobile swipe arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 text-foreground shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 text-foreground shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === selectedImage ? "bg-foreground" : "bg-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnails — desktop only */}
              {images.length > 1 && (
                <div className="hidden md:flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => {
                    const isLast = idx === images.length - 1 && images.length > 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-20 h-20 bg-secondary overflow-hidden rounded-md border-2 transition-colors shrink-0 ${
                          idx === selectedImage ? "border-gold" : "border-transparent hover:border-border"
                        }`}
                      >
                        <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                        {isLast && (
                          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                            <span className="text-background text-[10px] font-medium leading-tight text-center">
                              View All {images.length}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-xl md:text-4xl mb-4">{product.title}</h1>
              <p className="text-3xl md:text-4xl font-bold mb-2">
                £{price.toFixed(2)}
              </p>
              <KlarnaInfo price={price * quantity} />

              {/* Divider */}
              <div className="border-t border-border/40 my-6" />

              {/* Variant selectors */}
              {product.options.map((option) => {
                if (option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title") return null;
                return (
                  <div key={option.name} className="mb-6">
                    <p className="text-sm font-medium mb-2">{option.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const matchingIdx = product.variants.edges.findIndex((v) =>
                          v.node.selectedOptions.some((o) => o.name === option.name && o.value === value)
                        );
                        const isSelected = matchingIdx === selectedVariantIdx;
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedVariantIdx(matchingIdx >= 0 ? matchingIdx : 0)}
                            className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                              isSelected ? "border-foreground bg-primary text-primary-foreground" : "border-border hover:border-foreground"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-5">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-medium">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Desktop buttons */}
              <div className="hidden md:flex flex-col gap-3 mb-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !variant?.availableForSale}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : !variant?.availableForSale ? (
                    "Sold Out"
                  ) : (
                    "Add to Basket"
                  )}
                </button>
              </div>

              {/* Trust badges row */}
              <ProductTrustBadges />

              {/* Delivery banner */}
              <div className="mb-4">
                <DeliveryBanner />
              </div>

              <div className="hidden md:flex flex-col items-center gap-3 mb-10">
                <MakeOfferModal
                  productTitle={product.title}
                  productHandle={product.handle}
                  productImage={images[0]?.node.url}
                  variantId={variant?.id}
                  variantTitle={variant?.title}
                  originalPrice={price}
                />
                <button
                  onClick={() => {
                    if (!product) return;
                    const inWishlist = isInWishlist(product.handle);
                    if (inWishlist) {
                      removeFromWishlist(product.handle);
                    } else {
                      addToWishlist({
                        handle: product.handle,
                        title: product.title,
                        image: images[0]?.node.url,
                        price: variant?.price.amount,
                      });
                    }
                  }}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isInWishlist(product.handle)
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.handle) ? "fill-gold" : ""}`} />
                  {isInWishlist(product.handle) ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-3">Description</p>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Specs Accordion */}
              <div className="mb-3">
                <ProductSpecs />
              </div>

              {/* FAQ Accordion */}
              <div className="mb-10">
                <ProductFAQ />
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <SimilarProducts currentHandle={product.handle} productTitle={product.title} />

          {/* Reviews */}
          <ProductReviews productHandle={product.handle} />
        </div>
      </main>

      {/* Mobile sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-4 py-3 md:hidden">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="w-full bg-primary text-primary-foreground py-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : !variant?.availableForSale ? (
              "Sold Out"
            ) : (
              "Add to Basket"
            )}
          </button>
          <MakeOfferModal
            productTitle={product.title}
            productHandle={product.handle}
            productImage={images[0]?.node.url}
            variantId={variant?.id}
            variantTitle={variant?.title}
            originalPrice={price}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
