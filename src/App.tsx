import { lazy, Suspense } from "react";
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
import AIChatbot from "@/components/AIChatbot";
import PopupBanner from "@/components/PopupBanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CustomBuilder = lazy(() => import("./pages/CustomBuilder"));
const GiftBuilder = lazy(() => import("./pages/GiftBuilder"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Community = lazy(() => import("./pages/Community"));
const CraftStories = lazy(() => import("./pages/CraftStories"));
const Learning = lazy(() => import("./pages/Learning"));
const Collections = lazy(() => import("./pages/Collections"));
const DesignVoting = lazy(() => import("./pages/DesignVoting"));
const SurpriseBox = lazy(() => import("./pages/SurpriseBox"));
const StyleQuiz = lazy(() => import("./pages/StyleQuiz"));
const OrderTracker = lazy(() => import("./pages/OrderTracker"));
const Loyalty = lazy(() => import("./pages/Loyalty"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const OccasionShop = lazy(() => import("./pages/OccasionShop"));
const AllReviews = lazy(() => import("./pages/AllReviews"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Checkout = lazy(() => import("./pages/Checkout"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminCustomOrders = lazy(() => import("./pages/admin/AdminCustomOrders"));
const AdminGiftOrders = lazy(() => import("./pages/admin/AdminGiftOrders"));
const AdminSubscriptions = lazy(() => import("./pages/admin/AdminSubscriptions"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminCommunity = lazy(() => import("./pages/admin/AdminCommunity"));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections"));
const AdminStories = lazy(() => import("./pages/admin/AdminStories"));
const AdminAIInsights = lazy(() => import("./pages/admin/AdminAIInsights"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLearning = lazy(() => import("./pages/admin/AdminLearning"));
const AdminLoyalty = lazy(() => import("./pages/admin/AdminLoyalty"));
const AdminDesignVotes = lazy(() => import("./pages/admin/AdminDesignVotes"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin text-4xl">🧶</div>
  </div>
);

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
            <AIChatbot />
            <PopupBanner />
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/occasions/:occasionId" element={<OccasionShop />} />
                <Route path="/reviews" element={<AllReviews />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkout" element={<Checkout />} />
                {/* Password reset removed — using phone OTP */}

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
                  <Route path="learning" element={<AdminLearning />} />
                  <Route path="loyalty" element={<AdminLoyalty />} />
                  <Route path="design-votes" element={<AdminDesignVotes />} />
                  <Route path="ai-insights" element={<AdminAIInsights />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
