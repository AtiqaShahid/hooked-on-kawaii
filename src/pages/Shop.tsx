import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { products, categories } from "@/lib/products";

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
              🛍️ Our Shop
            </h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Every piece is handmade with love and premium yarn
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-5 py-3 rounded-3xl bg-card border border-border/50 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-soft"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-3xl bg-card border border-border/50 text-sm font-medium shadow-soft btn-squish">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-3xl text-sm font-semibold font-body whitespace-nowrap transition-all btn-squish ${
                activeCategory === "all" ? "bg-primary text-primary-foreground shadow-glow" : "bg-card text-foreground/60 shadow-soft"
              }`}
            >
              All ✨
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-3xl text-sm font-semibold font-body whitespace-nowrap transition-all btn-squish ${
                  activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-glow" : "bg-card text-foreground/60 shadow-soft"
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🧶</span>
              <p className="font-display text-lg font-semibold mb-2">No products found</p>
              <p className="text-muted-foreground text-sm">Try a different search or category</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
