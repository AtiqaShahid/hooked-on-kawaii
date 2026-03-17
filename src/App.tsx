import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ScrollToTop from "@/components/ScrollToTop";
import CartDrawer from "@/components/CartDrawer";
import SocialProofToast from "@/components/SocialProofToast";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CustomBuilder from "./pages/CustomBuilder";
import GiftBuilder from "./pages/GiftBuilder";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Community from "./pages/Community";
import CraftStories from "./pages/CraftStories";
import Learning from "./pages/Learning";
import Collections from "./pages/Collections";
import DesignVoting from "./pages/DesignVoting";
import SurpriseBox from "./pages/SurpriseBox";
import StyleQuiz from "./pages/StyleQuiz";
import OrderTracker from "./pages/OrderTracker";
import Loyalty from "./pages/Loyalty";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCustomOrders from "./pages/admin/AdminCustomOrders";
import AdminGiftOrders from "./pages/admin/AdminGiftOrders";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminStories from "./pages/admin/AdminStories";
import AdminAIInsights from "./pages/admin/AdminAIInsights";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartDrawer />
            <SocialProofToast />
            <Routes>
              {/* Public storefront */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/custom-builder" element={<CustomBuilder />} />
              <Route path="/gift-builder" element={<GiftBuilder />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/community" element={<Community />} />
              <Route path="/craft-stories" element={<CraftStories />} />
              <Route path="/learn" element={<Learning />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/design-voting" element={<DesignVoting />} />
              <Route path="/surprise-box" element={<SurpriseBox />} />
              <Route path="/style-quiz" element={<StyleQuiz />} />
              <Route path="/orders" element={<OrderTracker />} />
              <Route path="/loyalty" element={<Loyalty />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="custom-orders" element={<AdminCustomOrders />} />
                <Route path="gift-orders" element={<AdminGiftOrders />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="community" element={<AdminCommunity />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="stories" element={<AdminStories />} />
                <Route path="ai-insights" element={<AdminAIInsights />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
