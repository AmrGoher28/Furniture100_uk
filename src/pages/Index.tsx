import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { BestSellers } from "@/components/BestSellers";
import { LifestyleBanner } from "@/components/LifestyleBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CustomerReviews } from "@/components/CustomerReviews";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <TrustBar />
      <div className="mt-6 md:mt-0">
        <FeaturedCategories />
      </div>
      <div id="best-sellers">
        <BestSellers />
      </div>
      <LifestyleBanner />
      <WhyChooseUs />
      <CustomerReviews />
      
      <Newsletter />
    </Layout>
  );
};

export default Index;
