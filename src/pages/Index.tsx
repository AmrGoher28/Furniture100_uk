import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { BestSellers } from "@/components/BestSellers";
import { LifestyleBanner } from "@/components/LifestyleBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CustomerReviews } from "@/components/CustomerReviews";
import { Newsletter } from "@/components/Newsletter";
import LazySection from "@/components/LazySection";
import { Seo } from "@/components/Seo";

const Index = () => {
  return (
    <Layout>
      <Seo
        title="Furniture100 - Premium Furniture. Delivered Nationwide."
        description="Premium UK furniture: mid-century, vintage style and contemporary sofas, lounge chairs, dining, lighting and more. Free nationwide delivery."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Furniture100",
          url: "https://furniture100.co.uk",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://furniture100.co.uk/shop?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <Hero />
      <TrustBar />
      <FeaturedCategories />
      <div id="best-sellers">
        <BestSellers />
      </div>
      <LazySection minHeight="400px">
        <LifestyleBanner />
      </LazySection>
      <LazySection minHeight="300px">
        <WhyChooseUs />
      </LazySection>
      <LazySection minHeight="300px">
        <CustomerReviews />
      </LazySection>
      <LazySection minHeight="200px">
        <Newsletter />
      </LazySection>
    </Layout>
  );
};

export default Index;
