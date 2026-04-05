import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Layout } from "@/components/Layout";
import { Loader2, ArrowLeft } from "lucide-react";
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
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

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
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
              Return to collection
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

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
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <Layout>
      <main className="flex-1 py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Link to="/#collection" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Collection
          </Link>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {/* Images */}
            <div>
              <div className="aspect-[4/5] bg-muted/40 overflow-hidden mb-4">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs tracking-[0.2em] uppercase">No image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-20 bg-muted/40 overflow-hidden border transition-colors ${idx === selectedImage ? "border-foreground" : "border-transparent hover:border-border"}`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl mb-4">{product.title}</h1>
              <p className="text-xl mb-8">
                {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
              </p>
              <p className="text-muted-foreground font-light leading-relaxed mb-10 max-w-lg">
                {product.description}
              </p>

              {/* Variant selectors */}
              {product.options.map((option) => {
                if (option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title") return null;
                return (
                  <div key={option.name} className="mb-8">
                    <p className="text-xs tracking-[0.2em] uppercase mb-3">{option.name}</p>
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
                            className={`px-5 py-2.5 text-xs tracking-[0.1em] border transition-colors ${
                              isSelected ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
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

              <button
                onClick={handleAddToCart}
                disabled={isLoading || !variant?.availableForSale}
                className="w-full md:w-auto px-12 py-4 bg-foreground text-background text-xs tracking-[0.25em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : !variant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  "Add to Bag"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
