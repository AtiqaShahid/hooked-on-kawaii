import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CrochetOfTheWeek from "@/components/home/CrochetOfTheWeek";
import OccasionsSection from "@/components/home/OccasionsSection";
import FeaturesStrip from "@/components/home/FeaturesStrip";
import NewsletterSection from "@/components/home/NewsletterSection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturesStrip />
    <CategoriesSection />
    <FeaturedProducts />
    <CrochetOfTheWeek />
    <OccasionsSection />
    <NewsletterSection />
    <Footer />
  </div>
);

export default Index;
