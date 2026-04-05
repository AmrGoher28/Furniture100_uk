import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { BestSellers } from "@/components/BestSellers";
import { LifestyleBanner } from "@/components/LifestyleBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CustomerReviews } from "@/components/CustomerReviews";
import { SocialFeed } from "@/components/SocialFeed";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <Layout heroPage>
      <Hero />
      <TrustBar />
      <FeaturedCategories />
      <div id="best-sellers">
        <BestSellers />
      </div>
      <LifestyleBanner />
      <WhyChooseUs />
      <CustomerReviews />
      <SocialFeed />
      <Newsletter />
    </Layout>
  );
};

export default Index;
