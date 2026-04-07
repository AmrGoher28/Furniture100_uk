import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is assembly required?",
    a: "Assembly requirements vary by product. Please refer to the product details above or contact our support team for specific information.",
  },
  {
    q: "What is the return process?",
    a: "We offer a 30-day return policy. Simply contact our team and we'll arrange collection of the item. Full refunds are issued once the item is received in its original condition.",
  },
  {
    q: "How do I care for chenille fabric?",
    a: "Vacuum regularly with an upholstery attachment. Blot spills immediately with a clean cloth. For deeper cleaning, use a mild fabric cleaner and always test on a hidden area first.",
  },
  {
    q: "Can I see this in person?",
    a: "We currently operate online only, but we offer free fabric samples and a 30-day return policy so you can experience the quality risk-free.",
  },
];

const ProductFAQ = () => (
  <Accordion type="single" collapsible>
    {FAQS.map((faq, idx) => (
      <AccordionItem key={idx} value={`faq-${idx}`} className="border-border">
        <AccordionTrigger className="text-sm hover:no-underline">
          {faq.q}
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default ProductFAQ;
