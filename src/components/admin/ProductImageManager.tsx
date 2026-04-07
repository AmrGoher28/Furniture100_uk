import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductImageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  images: Array<{ url: string; altText: string | null }>;
  onImagesUpdated: () => void;
}

export const ProductImageManager = ({
  open,
  onOpenChange,
  productId,
  images,
  onImagesUpdated,
}: ProductImageManagerProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCroppedImage = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!imgRef.current || !completedCrop) {
        resolve(selectedImage || "");
        return;
      }
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(selectedImage || ""); return; }
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0, 0,
        completedCrop.width,
        completedCrop.height
      );
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    });
  }, [completedCrop, selectedImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCrop(undefined);
      setCompletedCrop(undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setUploading(true);
    try {
      const imageData = completedCrop ? await getCroppedImage() : selectedImage;
      const { data, error } = await supabase.functions.invoke("admin-upload-image", {
        body: { productId, imageBase64: imageData },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Image uploaded successfully");
      setSelectedImage(null);
      setCrop(undefined);
      onImagesUpdated();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Image Manager</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current images */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Current Images</p>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={img.url} alt={img.altText || ""} className="w-full h-full object-cover" />
                </div>
              ))}
              {images.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-4">No images yet</p>
              )}
            </div>
          </div>

          {/* Upload new */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Upload New Image</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {!selectedImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
              >
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to select an image</span>
              </button>
            ) : (
              <div className="space-y-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Upload preview"
                    className="max-h-[400px] w-auto mx-auto"
                  />
                </ReactCrop>
                <div className="flex gap-3">
                  <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    {completedCrop ? "Upload Cropped" : "Upload Original"}
                  </Button>
                  <Button variant="outline" onClick={() => { setSelectedImage(null); setCrop(undefined); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
