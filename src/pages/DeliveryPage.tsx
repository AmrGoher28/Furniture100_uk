import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";

const DeliveryPage = () => {
  return (
    <Layout>
      <Seo title="Free UK Delivery | Furniture100" description="Free nationwide delivery on every order, with no minimum spend. Standard delivery in 3-5 working days across mainland UK." path="/delivery" />
      <section className="bg-secondary py-16 md:py-24 px-6 text-center">
        <p className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground mb-4">Shipping</p>
        <h1 className="text-4xl md:text-5xl mb-4">Free Nationwide Delivery</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Free standard delivery on every order across the UK. No minimum spend, no hidden fees.</p>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <h2 className="text-2xl mb-4">Free UK Delivery — Always</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Every order ships with <strong className="text-foreground">free standard delivery</strong> to mainland UK addresses. No minimum spend, no surprise charges at checkout.
          </p>

          <h2 className="text-2xl mb-4">Delivery Timeframes</h2>
          <div className="bg-secondary rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong className="text-foreground">Standard Delivery</strong><p className="text-muted-foreground mt-1">3-5 working days</p></div>
              <div><strong className="text-foreground">Express Delivery</strong><p className="text-muted-foreground mt-1">1-2 working days (£14.99)</p></div>
              <div><strong className="text-foreground">Large Items</strong><p className="text-muted-foreground mt-1">5-10 working days</p></div>
              <div><strong className="text-foreground">Scottish Highlands & Islands</strong><p className="text-muted-foreground mt-1">7-14 working days</p></div>
            </div>
          </div>

          <h2 className="text-2xl mb-4">What to Expect</h2>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>You'll receive a confirmation email with tracking details once your order is dispatched.</li>
            <li>Our delivery partner will contact you to arrange a convenient delivery slot for larger items.</li>
            <li>Someone will need to be available to receive the delivery and sign for it.</li>
            <li>Please inspect your item upon delivery and report any damage within 48 hours.</li>
          </ul>

          <h2 className="text-2xl mb-4">Need Help?</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about your delivery, please contact our team at{" "}
            <a href="mailto:hello@furniture100.co.uk" className="text-gold hover:underline">hello@furniture100.co.uk</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default DeliveryPage;
