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

const triggerClass =
  "text-[11px] tracking-[0.18em] uppercase font-medium hover:no-underline py-5";

const ProductSpecs = ({ isAdmin = false, overrides = {}, onSave }: Props) => (
  <Accordion type="single" collapsible className="border-t border-border">
    <AccordionItem value="specs" className="border-border">
      <AccordionTrigger className={triggerClass}>Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 pb-4">
          {SPECS.map((s, idx) => {
            const key = `spec_${idx}`;
            const val = overrides[key] || s.value;
            return (
              <div key={s.label} className="flex justify-between items-center text-sm gap-4">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="flex items-center gap-1 text-foreground text-right">
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

    <AccordionItem value="delivery" className="border-border">
      <AccordionTrigger className={triggerClass}>Delivery & Returns</AccordionTrigger>
      <AccordionContent>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3 pb-4">
          <p>Free standard delivery to mainland UK. Most orders arrive in 3–5 working days.</p>
          <p>Not the right fit? Return within 30 days for a full refund - no questions asked.</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default ProductSpecs;
