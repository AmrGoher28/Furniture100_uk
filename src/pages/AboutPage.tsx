import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const stats = [
    { value: "10,000+", label: "Orders Delivered" },
    { value: "9,500+", label: "Happy Customers" },
    { value: "5+", label: "Years Experience" },
  ];

  return (
    <Layout>
      <Seo title="About Furniture100 | Premium UK Furniture" description="Learn about Furniture100 — a UK furniture retailer delivering premium mid-century, vintage and contemporary pieces nationwide." path="/about" />
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">About Furniture100</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Premium furniture for modern British homes, delivered nationwide.
        </p>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl mb-6">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Furniture100 was founded with a simple mission: to make premium, design-led furniture accessible to everyone across the UK. We believe that your home deserves beautiful pieces that don't compromise on quality or style.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We curate a carefully selected collection of mid-century modern, vintage-inspired and contemporary furniture — each piece chosen for its craftsmanship, design integrity and lasting appeal. From statement lounge chairs to elegant dining sets, everything in our collection is built to transform your space.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            With free nationwide delivery, 30-day hassle-free returns and a UK-based support team, we make buying furniture online easy, trustworthy and enjoyable.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Quality First", desc: "Every piece is selected for its craftsmanship, materials and design integrity. We never compromise on quality." },
              { title: "Transparency", desc: "Honest pricing, clear delivery timelines, and straightforward returns. No hidden fees, no small print." },
              { title: "Customer First", desc: "Our UK-based team is here to help with every question. Your satisfaction is our priority." },
            ].map((v) => (
              <div key={v.title} className="bg-card rounded-lg p-8 text-center">
                <h3 className="text-lg font-semibold mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-semibold text-gold mb-2 font-serif">{s.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal py-16 px-6 text-center">
        <h2 className="text-3xl text-white mb-4">Ready to Transform Your Home?</h2>
        <Link to="/shop" className="inline-block bg-gold text-white px-8 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          Shop Now
        </Link>
      </section>
    </Layout>
  );
};

export default AboutPage;
