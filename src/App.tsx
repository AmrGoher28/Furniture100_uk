import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { AdminProvider, useAdminMode } from "@/hooks/useAdminMode";
import AdminLoginModal from "@/components/admin/AdminLoginModal";
import AdminBadge from "@/components/admin/AdminBadge";
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
import AdminProducts from "./pages/AdminProducts";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminOverlay = () => {
  const { isAdmin, showLogin, setShowLogin, login, logout } = useAdminMode();
  return (
    <>
      <AdminLoginModal open={showLogin} onClose={() => setShowLogin(false)} onLogin={login} />
      {isAdmin && <AdminBadge onExit={logout} />}
    </>
  );
};

const AppContent = () => {
  useCartSync();
  return (
    <>
      <AdminOverlay />
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
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminProvider>
          <AppContent />
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
