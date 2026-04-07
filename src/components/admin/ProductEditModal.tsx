import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductImageManager } from "./ProductImageManager";
import { ProductPreview } from "./ProductPreview";

interface ProductEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    title: string;
    description: string;
    handle: string;
    price: string;
    currencyCode: string;
    images: Array<{ url: string; altText: string | null }>;
    variantId?: string;
  };
  onSaved: () => void;
}

export const ProductEditModal = ({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductEditModalProps) => {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [saving, setSaving] = useState(false);
  const [imageManagerOpen, setImageManagerOpen] = useState(false);

  const hasChanges = title !== product.title || description !== product.description || price !== product.price;

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      if (title !== product.title) updates.title = title;
      if (description !== product.description) updates.description = description;
      if (price !== product.price) {
        updates.price = price;
        updates.variantId = product.variantId;
      }

      const { data, error } = await supabase.functions.invoke("admin-update-product", {
        body: { productId: product.id, updates },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Product updated successfully");
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">Edit Product</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* Edit fields */}
            <div className="space-y-5">
              <div>
                <Label className={`text-xs uppercase tracking-wider ${!title ? 'text-destructive' : 'text-muted-foreground'}`}>
                  Title {!title && "⚠"}
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`mt-1.5 ${!title ? 'border-destructive/50' : ''}`}
                />
              </div>

              <div>
                <Label className={`text-xs uppercase tracking-wider ${!description ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  Description {!description && "⚠"}
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className={`mt-1.5 ${!description ? 'border-amber-400/50' : ''}`}
                />
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Price (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Images</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageManagerOpen(true)}
                  className="mt-1.5 w-full"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Manage Images ({product.images.length})
                </Button>
              </div>

              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>

            {/* Live preview */}
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Live Preview</p>
              <ProductPreview
                title={title}
                price={price}
                currencyCode={product.currencyCode}
                imageUrl={product.images[0]?.url}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductImageManager
        open={imageManagerOpen}
        onOpenChange={setImageManagerOpen}
        productId={product.id}
        images={product.images}
        onImagesUpdated={onSaved}
      />
    </>
  );
};
