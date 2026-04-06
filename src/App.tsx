import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import ShopAll from "./pages/ShopAll";
import AboutPage from "./pages/AboutPage";
import DeliveryPage from "./pages/DeliveryPage";
import ReturnsPage from "./pages/ReturnsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AdminOffers from "./pages/AdminOffers";
import AdminCategories from "./pages/AdminCategories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<ShopAll />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/product/:handle" element={<ProductDetail />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/returns" element={<ReturnsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/admin/offers" element={<AdminOffers />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
