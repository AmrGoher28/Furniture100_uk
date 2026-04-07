import { Layout } from "@/components/Layout";

const PrivacyPage = () => {
  return (
    <Layout>
      <section className="bg-secondary py-16 md:py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">How we collect, use and protect your data.</p>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you place an order or create an account, we collect personal information including your name, email address, delivery address, phone number and payment details. We also collect browsing data through cookies to improve your experience.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use your information to process orders, deliver products, communicate about your order, send marketing communications (with your consent), improve our website and comply with legal obligations.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">3. Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal data against unauthorised access, alteration, disclosure or destruction. All payment transactions are encrypted using SSL technology.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, analyse site traffic and personalise content. You can manage your cookie preferences through your browser settings.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">5. Third Parties</h2>
            <p className="text-muted-foreground leading-relaxed">
              We share your data only with trusted third parties who assist us in operating our website, conducting our business, or servicing you. These parties agree to keep this information confidential.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Under GDPR, you have the right to access, rectify, erase, restrict processing of, and port your personal data. To exercise these rights, contact us at{" "}
              <a href="mailto:hello@furniture100.co.uk" className="text-gold hover:underline">hello@furniture100.co.uk</a>.
            </p>
          </div>
          <div>
            <h2 className="text-2xl mb-3">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any privacy-related queries, please email <a href="mailto:hello@furniture100.co.uk" className="text-gold hover:underline">hello@furniture100.co.uk</a>.
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

export default PrivacyPage;
