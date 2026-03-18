import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import ShopFilters, { type ShopFilterState } from "@/components/shop/ShopFilters";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";
import { Skeleton } from "@/components/ui/skeleton";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("cat") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 20000), [products]);

  const [filters, setFilters] = useState<ShopFilterState>({
    priceRange: [0, 20000],
    colors: [],
    moods: [],
    inStockOnly: false,
    badges: [],
    sortBy: "newest",
  });

  // Update max price when products load
  useMemo(() => {
    if (maxPrice > filters.priceRange[1]) {
      setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], maxPrice] }));
    }
  }, [maxPrice]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "all") setSearchParams({});
    else setSearchParams({ cat });
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const catSlug = p.category?.slug;
      const matchesCat =
        activeCategory === "all" ||
        (activeCategory === "sale" ? (p.badges || []).includes("Sale") : catSlug === activeCategory);
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

      const matchesColors =
        filters.colors.length === 0 ||
        (p.colors || []).some((pc) => filters.colors.some((fc) => pc.toLowerCase() === fc.toLowerCase()));

      const matchesBadges =
        filters.badges.length === 0 || (p.badges || []).some((b) => filters.badges.includes(b));

      return matchesCat && matchesSearch && matchesPrice && matchesColors && matchesBadges;
    });

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      default:
        break; // newest is default order
    }

    return result;
  }, [products, activeCategory, searchQuery, filters]);

  const activeFilterCount = [
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
    filters.colors.length > 0,
    filters.moods.length > 0,
    filters.inStockOnly,
    filters.badges.length > 0,
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">🛍️ Our Shop</h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Every piece is handmade with love and premium yarn
            </p>
          </motion.div>

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
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-3xl border border-border/50 text-sm font-medium shadow-soft btn-squish transition-all ${
                filtersOpen || activeFilterCount > 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground"
              }`}
            >
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-card text-foreground text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-5 py-2.5 rounded-3xl text-sm font-semibold font-body whitespace-nowrap transition-all btn-squish ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-foreground/60 shadow-soft"
              }`}
            >
              All ✨
            </button>
            <button
              onClick={() => handleCategoryChange("sale")}
              className={`px-5 py-2.5 rounded-3xl text-sm font-semibold font-body whitespace-nowrap transition-all btn-squish ${
                activeCategory === "sale"
                  ? "bg-red-500 text-white shadow-glow"
                  : "bg-red-50 text-red-500 shadow-soft"
              }`}
            >
              🔥 Sale
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-5 py-2.5 rounded-3xl text-sm font-semibold font-body whitespace-nowrap transition-all btn-squish ${
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-card text-foreground/60 shadow-soft"
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Filter sidebar */}
            <ShopFilters
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              filters={filters}
              onChange={setFilters}
              maxPrice={maxPrice}
            />

            {/* Product grid */}
            <div className="flex-1">
              {loadingProducts ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-3xl overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-4 font-body">
                    {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                  </p>
                  <div className={`grid gap-4 md:gap-6 ${filtersOpen ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
                    {filtered.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                </>
              )}

              {!loadingProducts && filtered.length === 0 && (
                <div className="text-center py-20">
                  <span className="text-5xl block mb-4">🧶</span>
                  <p className="font-display text-lg font-semibold mb-2">No products found</p>
                  <p className="text-muted-foreground text-sm">Try a different search or filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
