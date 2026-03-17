import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CrochetOfTheWeek from "@/components/home/CrochetOfTheWeek";
import OccasionsSection from "@/components/home/OccasionsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import CustomerLoveSection from "@/components/home/CustomerLoveSection";
import AnnouncementMarquee from "@/components/home/AnnouncementMarquee";
import StatsCounter from "@/components/home/StatsCounter";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <AnnouncementMarquee />
    <StatsCounter />
    <CategoriesSection />
    <FeaturedProducts />
    <CustomerLoveSection />
    <CrochetOfTheWeek />
    <OccasionsSection />
    <NewsletterSection />
    <Footer />
  </div>
);

export default Index;
