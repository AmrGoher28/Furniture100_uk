import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, FileText, Eye, Image, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductAIToolsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  };
  onApplyDescription: (desc: string) => void;
}

type AIAction = "describe" | "compare" | "generate-angles" | "generate-dimensions";

export const ProductAITools = ({
  open,
  onOpenChange,
  product,
  onApplyDescription,
}: ProductAIToolsProps) => {
  const [loading, setLoading] = useState<AIAction | null>(null);
  const [textResult, setTextResult] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);

  const runAction = async (action: AIAction) => {
    setLoading(action);
    setTextResult("");
    setGeneratedImages([]);
    setActiveAction(action);

    try {
      const { data, error } = await supabase.functions.invoke("admin-ai-tools", {
        body: {
          action,
          imageUrl: product.imageUrl,
          description: product.description,
          productTitle: product.title,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.result) setTextResult(data.result);
      if (data?.images) setGeneratedImages(data.images.filter(Boolean));
      if (data?.text && !data?.result) setTextResult(data.text);
    } catch (err: any) {
      toast.error(err.message || "AI request failed");
    } finally {
      setLoading(null);
    }
  };

  const actions: { key: AIAction; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "describe", label: "Generate Description", icon: <FileText className="w-4 h-4" />, desc: "AI writes a product description from the image" },
    { key: "compare", label: "Compare Image vs Text", icon: <Eye className="w-4 h-4" />, desc: "Check for mismatches between image and description" },
    { key: "generate-angles", label: "Generate Angles", icon: <Image className="w-4 h-4" />, desc: "AI creates alternative angle images" },
    { key: "generate-dimensions", label: "Dimensions Image", icon: <Ruler className="w-4 h-4" />, desc: "Annotate the product with estimated dimensions" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Tools - {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {actions.map((a) => (
              <button
                key={a.key}
                onClick={() => runAction(a.key)}
                disabled={loading !== null}
                className={`text-left p-4 rounded-lg border transition-all ${
                  activeAction === a.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                } ${loading !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {loading === a.key ? <Loader2 className="w-4 h-4 animate-spin" /> : a.icon}
                  <span className="text-sm font-medium">{a.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </button>
            ))}
          </div>

          {/* Results */}
          {textResult && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Result</p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {textResult}
              </div>
              {activeAction === "describe" && (
                <Button
                  size="sm"
                  onClick={() => {
                    onApplyDescription(textResult);
                    toast.success("Description applied - save the product to confirm");
                  }}
                >
                  Apply as Description
                </Button>
              )}
            </div>
          )}

          {generatedImages.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Generated Images</p>
              <div className="grid grid-cols-2 gap-3">
                {generatedImages.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={src} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
