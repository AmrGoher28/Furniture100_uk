import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Seo
        title="Page Not Found | Furniture100"
        description="The page you're looking for doesn't exist. Browse our collection of premium UK furniture instead."
        path={location.pathname}
        noindex
      />
      <section className="bg-cream py-24 md:py-32 px-6 text-center">
        <p className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground mb-6">Error 404</p>
        <h1 className="font-serif-display text-foreground" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.95, fontWeight: 500 }}>
          <em className="italic font-normal">Lost</em> in the showroom.
        </h1>
        <p className="mt-6 text-muted-foreground max-w-md mx-auto">
          The page you're looking for has moved or no longer exists. Let's get you back on track.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-foreground text-background px-7 py-3 text-xs tracking-[0.18em] uppercase font-medium hover:bg-foreground/85 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center rounded-full border border-foreground/40 text-foreground px-7 py-3 text-xs tracking-[0.18em] uppercase font-medium hover:border-foreground transition-colors"
          >
            Shop All
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
          <Link to="/category/lounge-chairs" className="hover:text-foreground">Lounge</Link>
          <Link to="/category/dining" className="hover:text-foreground">Dining</Link>
          <Link to="/category/bar-stools" className="hover:text-foreground">Bar Stools</Link>
          <Link to="/category/office-chairs" className="hover:text-foreground">Office</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
