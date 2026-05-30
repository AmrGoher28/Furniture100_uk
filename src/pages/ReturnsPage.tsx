import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";

const ReturnsPage = () => {
  return (
    <Layout>
      <Seo title="Returns Policy | Furniture100" description="Easy 30-day returns on every order. Read our hassle-free returns policy and how to start a return." path="/returns" />
      <section className="bg-secondary py-16 md:py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Returns Policy</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">We want you to love your purchase. If not, returns are easy.</p>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl mb-4">30 Day Returns</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            If you're not completely happy with your purchase, you can return it within <strong className="text-foreground">30 days</strong> of delivery for a full refund, no questions asked.
          </p>

          <h2 className="text-2xl mb-4">How to Return</h2>
          <ol className="space-y-3 text-muted-foreground mb-6 list-decimal list-inside">
            <li>Contact our team at <a href="mailto:hello@furniture100.co.uk" className="text-gold hover:underline">hello@furniture100.co.uk</a> to arrange your return.</li>
            <li>We'll provide a prepaid returns label or arrange collection for larger items.</li>
            <li>Pack the item securely in its original packaging where possible.</li>
            <li>Once we receive the item and confirm its condition, your refund will be processed within 5-7 working days.</li>
          </ol>

          <h2 className="text-2xl mb-4">Conditions</h2>
          <ul className="space-y-2 text-muted-foreground mb-6 list-disc list-inside">
            <li>Items must be in their original condition, unused and with all original packaging.</li>
            <li>Items that have been assembled or show signs of use may not be eligible for return.</li>
            <li>Bespoke or made-to-order items cannot be returned unless faulty.</li>
          </ul>

          <h2 className="text-2xl mb-4">Damaged or Faulty Items</h2>
          <p className="text-muted-foreground leading-relaxed">
            If your item arrives damaged or faulty, please contact us within 48 hours of delivery with photos and we'll arrange a replacement or full refund at no cost to you.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ReturnsPage;
