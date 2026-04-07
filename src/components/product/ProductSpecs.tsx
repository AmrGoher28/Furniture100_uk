import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InlineEditor from "@/components/admin/InlineEditor";

const SPECS = [
  { label: "Dimensions (H × W × D)", value: "See product listing" },
  { label: "Material", value: "See product listing" },
  { label: "Weight", value: "See product listing" },
  { label: "Assembly", value: "See product listing" },
  { label: "Care Instructions", value: "See product listing" },
];

interface Props {
  isAdmin?: boolean;
  overrides?: Record<string, string>;
  onSave?: (key: string, value: string) => void;
}

const ProductSpecs = ({ isAdmin = false, overrides = {}, onSave }: Props) => (
  <Accordion type="single" collapsible>
    <AccordionItem value="specs" className="border-border">
      <AccordionTrigger className="text-sm hover:no-underline">
        Product Details
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2.5">
          {SPECS.map((s, idx) => {
            const key = `spec_${idx}`;
            const val = overrides[key] || s.value;
            return (
              <div key={s.label} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="flex items-center gap-1 text-foreground">
                  {val}
                  <InlineEditor
                    value={val}
                    onSave={(v) => onSave?.(key, v)}
                    isAdmin={isAdmin}
                    label={s.label}
                    multiline={false}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default ProductSpecs;
