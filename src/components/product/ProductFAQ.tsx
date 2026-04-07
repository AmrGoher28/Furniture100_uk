import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InlineEditor from "@/components/admin/InlineEditor";

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

interface Props {
  isAdmin?: boolean;
  overrides?: Record<string, string>;
  onSave?: (key: string, value: string) => void;
}

const ProductFAQ = ({ isAdmin = false, overrides = {}, onSave }: Props) => (
  <Accordion type="single" collapsible>
    {FAQS.map((faq, idx) => {
      const qKey = `faq_q_${idx}`;
      const aKey = `faq_a_${idx}`;
      const question = overrides[qKey] || faq.q;
      const answer = overrides[aKey] || faq.a;
      return (
        <AccordionItem key={idx} value={`faq-${idx}`} className="border-border">
          <AccordionTrigger className="text-sm hover:no-underline">
            <span className="flex items-center gap-1">
              {question}
              <InlineEditor
                value={question}
                onSave={(v) => onSave?.(qKey, v)}
                isAdmin={isAdmin}
                label="Question"
                multiline={false}
              />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-start gap-1">
              <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
              <InlineEditor
                value={answer}
                onSave={(v) => onSave?.(aKey, v)}
                isAdmin={isAdmin}
                label="Answer"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    })}
  </Accordion>
);

export default ProductFAQ;
