import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Layout } from "@/components/Layout";
import { Loader2, ArrowLeft, Truck, RotateCcw, ShieldCheck, Phone, Heart } from "lucide-react";
import MakeOfferModal from "@/components/MakeOfferModal";
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

const TRUST_ICONS = [
  { icon: Truck, label: "Free Delivery" },
  { icon: RotateCcw, label: "30 Day Returns" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Phone, label: "UK Support" },
];

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

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
  const klarnaMonthly = (price / 3).toFixed(2);

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to basket", { position: "top-center" });
  };

  return (
    <Layout>
      <main className="flex-1 py-8 md:py-12 px-6 md:px-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Images */}
            <div>
              <div className="aspect-square bg-secondary overflow-hidden rounded-lg mb-3">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 md:w-20 md:h-20 bg-secondary overflow-hidden rounded-md border-2 transition-colors shrink-0 ${
                        idx === selectedImage ? "border-gold" : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-2xl md:text-4xl mb-3">{product.title}</h1>
              <p className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                £{price.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                From £{klarnaMonthly}/month with Klarna. <span className="text-gold cursor-pointer">Learn more</span>
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

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

              {/* Add to basket — hidden on mobile (sticky version below) */}
              <button
                onClick={handleAddToCart}
                disabled={isLoading || !variant?.availableForSale}
                className="hidden md:flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mb-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : !variant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  "Add to Basket"
                )}
              </button>

              <div className="hidden md:flex flex-col gap-2 mb-8">
                <MakeOfferModal
                  productTitle={product.title}
                  productHandle={product.handle}
                  productImage={images[0]?.node.url}
                  variantId={variant?.id}
                  variantTitle={variant?.title}
                  originalPrice={price}
                />
                <button className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <Heart className="w-4 h-4" />
                  Add to Wishlist
                </button>
              </div>

              {/* Trust icons */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {TRUST_ICONS.map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <t.icon className="w-4 h-4 text-gold" />
                    {t.label}
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                🚚 Order today, delivered in <strong className="text-foreground">3–5 working days</strong>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky Add to Basket */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{product.title}</p>
            <p className="text-base font-semibold">£{price.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
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
      </div>
    </Layout>
  );
};

export default ProductDetail;
