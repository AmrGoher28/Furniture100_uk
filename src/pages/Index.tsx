import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeCategory={activeCategory} onCategoryChange={setActiveCategory} onCategoryHover={setHoveredCategory} />
      <Hero hoveredCategory={hoveredCategory} />
      <ProductGrid activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Editorial lifestyle image break */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80"
            alt="Minimalist living room with natural light"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
            alt="Warm toned dining space with wooden furniture"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <About />
      <Footer />
    </div>
  );
};

export default Index;
