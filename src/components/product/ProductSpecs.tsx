import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SPECS = [
  { label: "Dimensions (H × W × D)", value: "See product listing" },
  { label: "Material", value: "See product listing" },
  { label: "Weight", value: "See product listing" },
  { label: "Assembly", value: "See product listing" },
  { label: "Care Instructions", value: "See product listing" },
];

const ProductSpecs = () => (
  <Accordion type="single" collapsible>
    <AccordionItem value="specs" className="border-border">
      <AccordionTrigger className="text-sm hover:no-underline">
        Product Details
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2.5">
          {SPECS.map((s) => (
            <div key={s.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default ProductSpecs;
