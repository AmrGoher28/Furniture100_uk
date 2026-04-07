interface ProductPreviewProps {
  title: string;
  price: string;
  currencyCode: string;
  imageUrl?: string;
}

export const ProductPreview = ({ title, price, currencyCode, imageUrl }: ProductPreviewProps) => {
  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode || "GBP",
  }).format(parseFloat(price) || 0);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <div className="aspect-[4/5] bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <p className="text-sm font-light leading-snug line-clamp-2">{title || "Untitled Product"}</p>
        <p className="text-sm text-muted-foreground">{formattedPrice}</p>
      </div>
    </div>
  );
};
