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

const Index = () => {
  return (
    <Layout>
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
