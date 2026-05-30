import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { AdminProvider, useAdminMode } from "@/hooks/useAdminMode";
import AdminBadge from "@/components/admin/AdminBadge";
import Index from "./pages/Index";

// Lazy-load non-critical routes for code splitting
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ShopAll = lazy(() => import("./pages/ShopAll"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
const ReturnsPage = lazy(() => import("./pages/ReturnsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AdminOffers = lazy(() => import("./pages/AdminOffers"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AdminOverlay = () => {
  const { isAdmin, logout } = useAdminMode();
  return <>{isAdmin && <AdminBadge onExit={logout} />}</>;
};

const AppContent = () => {
  useCartSync();
  return (
    <>
      <AdminOverlay />
      <Suspense fallback={null}>
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
      </Suspense>
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
