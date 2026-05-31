import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, createShopifyCart } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Loader2, Heart, ChevronLeft, ChevronRight, Minus, Plus, Package, ShoppingBag, Leaf, Briefcase } from "lucide-react";
import MakeOfferModal from "@/components/MakeOfferModal";

import SimilarProducts from "@/components/SimilarProducts";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import DeliveryBanner from "@/components/product/DeliveryBanner";
import ProductSpecs from "@/components/product/ProductSpecs";
import ProductFAQ from "@/components/product/ProductFAQ";
import KlarnaInfo from "@/components/KlarnaInfo";
import { useWishlist } from "@/hooks/useWishlist";
import { useAdminMode } from "@/hooks/useAdminMode";
import { useProductOverrides } from "@/hooks/useProductOverrides";
import InlineEditor from "@/components/admin/InlineEditor";
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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAdmin } = useAdminMode();
  const { overrides, saveOverride } = useProductOverrides(handle);

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
            <h1 className="text-2xl mb-4 tracking-tight">Product not found</h1>
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
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
  const description = overrides["description"] || product.description;

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

  const heroImage = images[0]?.node.url;
  const seoTitle = `${product.title} | Furniture100`;
  const seoDesc = (description || `Shop ${product.title} at Furniture100. Free UK delivery, 30-day returns.`)
    .replace(/<[^>]+>/g, "")
    .slice(0, 155);

  // Skip variant selectors when only "Default Title" exists
  const meaningfulOptions = product.options.filter(
    (o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title")
  );

  return (
    <Layout>
      <Seo
        title={seoTitle.slice(0, 60)}
        description={seoDesc}
        path={`/product/${product.handle}`}
        image={heroImage}
        type="product"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: seoDesc,
            image: images.map((i) => i.node.url),
            sku: variant?.id,
            mpn: product.id,
            brand: { "@type": "Brand", name: "Furniture100" },
            offers: {
              "@type": "Offer",
              url: `https://furniture100.co.uk/product/${product.handle}`,
              priceCurrency: variant?.price.currencyCode || "GBP",
              price: variant?.price.amount,
              itemCondition: "https://schema.org/NewCondition",
              availability: variant?.availableForSale
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "GB",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 30,
                returnMethod: "https://schema.org/ReturnByMail",
                returnFees: "https://schema.org/FreeReturn",
              },
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "GBP" },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "GB" },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                  transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 7, unitCode: "DAY" },
                },
              },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://furniture100.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "https://furniture100.co.uk/shop" },
              { "@type": "ListItem", position: 3, name: product.title, item: `https://furniture100.co.uk/product/${product.handle}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is assembly required?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Assembly requirements vary by product. Please refer to the product details above or contact our support team for specific information.",
                },
              },
              {
                "@type": "Question",
                name: "What is the return process?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We offer a 30-day return policy. Simply contact our team and we'll arrange collection of the item. Full refunds are issued once the item is received in its original condition.",
                },
              },
              {
                "@type": "Question",
                name: "Can I see this in person?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We currently operate online only, but we offer free fabric samples and a 30-day return policy so you can experience the quality risk-free.",
                },
              },
            ],
          },
        ]}
      />

      <main className="flex-1 py-10 md:py-16 px-6 md:px-12 pb-28 md:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground/70 normal-case tracking-tight">{product.title}</span>
          </nav>

          {/* 60/40 split */}
          <div className="grid md:grid-cols-5 gap-10 md:gap-16 lg:gap-24">
            {/* Images - 60% */}
            <div className="md:col-span-3 -mx-6 md:mx-0">
              {images.length > 0 ? (
                <>
                  {/* Mobile: horizontal scroll, full-bleed */}
                  <div
                    id="pd-mobile-scroller"
                    className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  >
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        data-pd-slide={idx}
                        className="relative w-full shrink-0 snap-center aspect-square bg-[#FAFAFA] overflow-hidden"
                      >
                        <img
                          src={img.node.url}
                          alt={img.node.altText || `${product.title} - image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Mobile: preview thumbnails strip (limited to fit viewport) */}
                  {images.length > 1 && (
                    <div className="md:hidden flex gap-2 px-6 mt-3">
                      {images.slice(0, 4).map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const scroller = document.getElementById("pd-mobile-scroller");
                            const slide = scroller?.querySelector(`[data-pd-slide="${idx}"]`) as HTMLElement | null;
                            slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
                          }}
                          className="flex-1 aspect-square bg-[#FAFAFA] overflow-hidden border border-border/60"
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img
                            src={img.node.url}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Desktop: 2-column grid */}
                  <div className="hidden md:grid grid-cols-2 gap-0.5">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square bg-[#FAFAFA] overflow-hidden"
                      >
                        <img
                          src={img.node.url}
                          alt={img.node.altText || `${product.title} - image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="aspect-square bg-[#FAFAFA] flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
            </div>


            {/* Details - 40% */}
            <div className="md:col-span-2">
              {/* Title row with wishlist */}
              <div className="flex items-start justify-between gap-4">
                <h1
                  className="text-foreground uppercase"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 2.125rem)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                    fontWeight: 500,
                  }}
                >
                  {product.title}
                </h1>
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
                  aria-label="Add to wishlist"
                  className="shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.handle) ? "fill-foreground text-foreground" : ""}`} strokeWidth={1.5} />
                </button>
              </div>


              {/* Subtitle (variant) */}
              {variant?.title && variant.title !== "Default Title" && (
                <p className="mt-2 text-sm text-muted-foreground">{variant.title}</p>
              )}


              {/* Price */}
              <p className="mt-4 text-2xl text-foreground font-normal tabular-nums">
                £{price.toFixed(2)}
              </p>




              {/* Divider */}
              <div className="my-7 h-px bg-border" />

              {isAdmin && (
                <InlineEditor
                  value={description}
                  onSave={(v) => saveOverride("description", v)}
                  isAdmin={isAdmin}
                  label="Description"
                />
              )}


              {/* Variant selectors */}
              {meaningfulOptions.length > 0 && (
                <div className="mt-7 space-y-6">
                  {meaningfulOptions.map((option) => {
                    const currentValue = variant?.selectedOptions.find((o) => o.name === option.name)?.value;
                    return (
                      <div key={option.name}>
                        <p className="text-sm text-foreground mb-3">
                          <span className="font-medium">{option.name}:</span>{" "}
                          <span className="text-muted-foreground">{currentValue}</span>
                        </p>
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
                                className={`px-4 h-9 text-xs tracking-tight rounded-full border transition-colors ${
                                  isSelected
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
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
                </div>
              )}

              {/* Quantity + Add to basket - desktop */}
              <div className="mt-8 hidden md:flex items-stretch gap-3">
                <div className="flex items-center gap-1 px-3 h-14 rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !variant?.availableForSale}
                  className="flex-1 bg-foreground text-background h-14 rounded-full text-sm font-medium tracking-tight hover:bg-foreground/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : !variant?.availableForSale ? (
                    "Sold Out"
                  ) : (
                    <>
                      Add to Basket
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    </>
                  )}
                </button>
              </div>

              {/* Dispatch badge */}
              <div className="mt-4 rounded-2xl bg-cream px-5 py-4 flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  <span className="font-medium">Dispatched within 24hrs</span> · Free UK delivery
                </p>
              </div>


              {/* Klarna / payment info */}
              <div className="mt-4 text-xs text-muted-foreground">
                <KlarnaInfo price={price * quantity} />
              </div>

              {/* Divider */}
              <div className="my-7 h-px bg-border" />

              {/* Info rows */}
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-foreground/80">Sustainable Item</span>
                </div>



                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-foreground/80">
                    <a href="/contact" className="underline underline-offset-4 hover:text-foreground">Trade enquiries</a> for commercial &amp; hospitality customers
                  </span>
                </div>
              </div>

              {/* Make an offer */}
              <div className="mt-7">
                <MakeOfferModal
                  productTitle={product.title}
                  productHandle={product.handle}
                  productImage={images[0]?.node.url}
                  variantId={variant?.id}
                  variantTitle={variant?.title}
                  originalPrice={price}
                />
              </div>

              {/* Full description anchor */}
              <div id="full-description" className="mt-10 scroll-mt-20">
                <h2 className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3 font-medium">Description</h2>
                <p className="text-[15px] leading-[1.75] text-foreground/80 max-w-prose">
                  {description}
                </p>
              </div>


              {/* Consolidated accordion */}
              <div className="mt-8">
                <ProductSpecs isAdmin={isAdmin} overrides={overrides} onSave={saveOverride} />
                <ProductFAQ isAdmin={isAdmin} overrides={overrides} onSave={saveOverride} />
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <SimilarProducts currentHandle={product.handle} productTitle={product.title} />

        </div>
      </main>

      {/* Mobile sticky bar - price left, CTA right */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-sm font-medium tabular-nums">£{price.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="flex-1 bg-foreground text-background h-12 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
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
