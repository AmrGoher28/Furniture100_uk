import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";

const TermsPage = () => {
  return (
    <Layout>
      <Seo title="Terms & Conditions | Furniture100" description="Terms and conditions for shopping with Furniture100." path="/terms" />
      <section className="bg-secondary py-16 md:py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Please read these terms carefully before using our website.</p>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl mb-3">1. General</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions govern your use of the Furniture100 website and your purchase of products from us. By placing an order, you agree to be bound by these terms.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">2. Orders</h2>
            <p className="text-muted-foreground leading-relaxed">
              All orders are subject to availability. We reserve the right to refuse or cancel any order. Prices are in GBP and include VAT where applicable. We will confirm your order by email.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">3. Pricing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We make every effort to ensure prices on our website are accurate. If we discover an error in the price of a product you have ordered, we will contact you to inform you and give you the option to reconfirm your order at the correct price or cancel it.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">4. Delivery</h2>
            <p className="text-muted-foreground leading-relaxed">
              Delivery timescales are estimates and are not guaranteed. We will do our best to deliver within the stated timescale. Please see our Delivery Information page for full details.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">5. Returns & Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have 30 days from delivery to return items in their original condition. Please see our Returns Policy page for full details on how to return items.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, images, logos and design, is owned by Furniture100 and is protected by copyright law. You may not reproduce, distribute or use our content without permission.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Furniture100 shall not be liable for any indirect, incidental, special or consequential damages arising from the use of our website or products. Our total liability is limited to the price of the product purchased.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">8. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Last updated: April 2026
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
