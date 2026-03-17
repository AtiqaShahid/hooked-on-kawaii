import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  color: string | null;
  description: string | null;
};

type Product = {
  name: string;
  price: number;
  image_url: string | null;
  slug: string;
  category_id: string | null;
};

const categoryColors: Record<string, { bg: string; btn: string }> = {
  "Crochet Flowers": { bg: "bg-[hsl(var(--pink)/0.15)]", btn: "bg-[hsl(var(--pink))]" },
  "Bouquets": { bg: "bg-[hsl(var(--mint)/0.2)]", btn: "bg-[hsl(var(--mint))]" },
  "Amigurumi": { bg: "bg-[hsl(var(--lavender)/0.15)]", btn: "bg-[hsl(var(--lavender))]" },
  "Keychains": { bg: "bg-[hsl(var(--peach)/0.2)]", btn: "bg-[hsl(var(--peach))]" },
  "Accessories": { bg: "bg-[hsl(var(--warm-beige)/0.25)]", btn: "bg-[hsl(var(--warm-beige))]" },
  "Home Decor": { bg: "bg-[hsl(var(--baby-blue)/0.15)]", btn: "bg-[hsl(var(--baby-blue))]" },
};

const fallbackColors = [
  { bg: "bg-primary/10", btn: "bg-primary" },
  { bg: "bg-secondary/30", btn: "bg-secondary" },
  { bg: "bg-accent/20", btn: "bg-accent" },
];

const Collections = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("products").select("name, price, image_url, slug, category_id").eq("is_active", true).order("name"),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
    };
    load();
  }, []);

  const getColors = (name: string, index: number) =>
    categoryColors[name] || fallbackColors[index % fallbackColors.length];

  const getProductsForCategory = (catId: string) =>
    products.filter((p) => p.category_id === catId).slice(0, 4);

  const getCategoryProductCount = (catId: string) =>
    products.filter((p) => p.category_id === catId).length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">💎 Our Collections</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Browse our handmade crochet categories</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const colors = getColors(cat.name, i);
              const catProducts = getProductsForCategory(cat.id);
              const totalCount = getCategoryProductCount(cat.id);

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl overflow-hidden shadow-soft"
                >
                  {/* Header */}
                  <div className={`${colors.bg} px-6 pt-6 pb-5 text-center`}>
                    <span className="text-3xl block mb-2">{cat.emoji || "🧶"}</span>
                    <h3 className="font-display text-xl font-bold mb-1">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-muted-foreground text-xs font-body mb-3 leading-relaxed">{cat.description}</p>
                    )}
                    <span className="inline-block px-3 py-1 rounded-full border border-foreground/20 text-xs font-medium">
                      {totalCount} item{totalCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Product List */}
                  <div className="bg-card px-5 py-4 space-y-1">
                    {catProducts.length > 0 ? (
                      catProducts.map((product) => (
                        <Link
                          key={product.slug}
                          to={`/product/${product.slug}`}
                          className="flex items-center gap-3 py-2.5 px-2 rounded-2xl hover:bg-muted/60 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border-2 border-card flex-shrink-0 bg-muted">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">🧶</div>
                            )}
                          </div>
                          <span className="font-body text-sm font-medium flex-1 group-hover:text-primary transition-colors truncate">
                            {product.name}
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                            Rs {product.price.toLocaleString()}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-6 font-body">Coming soon ✨</p>
                    )}
                  </div>

                  {/* View All Button */}
                  <div className="px-5 pb-5 bg-card">
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className={`${colors.btn} block w-full text-center py-3 rounded-full text-sm font-display font-semibold text-primary-foreground shadow-soft hover:shadow-float transition-all btn-squish`}
                    >
                      View All {cat.name}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collections;
