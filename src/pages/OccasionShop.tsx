import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useSupabaseData";
import ProductCard from "@/components/ui/ProductCard";

import { occasions } from "@/lib/products";

// Map occasion IDs to product badge/category keywords
const occasionFilters: Record<string, { keywords: string[]; badges: string[] }> = {
  birthday: { keywords: ["gift", "bouquet", "keychain"], badges: ["Gift", "Bestseller"] },
  wedding: { keywords: ["bouquet", "flower", "decor", "gajra"], badges: ["Wedding", "Limited Edition"] },
  "baby-shower": { keywords: ["toy", "stuffie", "rattle", "bunny", "bear"], badges: ["Baby", "Gift"] },
  valentines: { keywords: ["heart", "rose", "bouquet", "love"], badges: ["Valentine", "Romantic"] },
  eid: { keywords: ["gajra", "flower", "decor", "bouquet"], badges: ["Eid", "Festival"] },
};

const OccasionShop = () => {
  const { occasionId } = useParams<{ occasionId: string }>();
  const { data: products = [], isLoading } = useProducts();

  const occasion = occasions.find(o => o.id === occasionId);
  const filter = occasionFilters[occasionId || ""] || { keywords: [], badges: [] };

  // Filter products that match occasion keywords in name/description or badges
  const filtered = products.filter(p => {
    const name = p.name.toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const matchesKeyword = filter.keywords.some(k => name.includes(k) || desc.includes(k));
    const matchesBadge = filter.badges.some(b => (p.badges || []).some(pb => pb.toLowerCase().includes(b.toLowerCase())));
    return matchesKeyword || matchesBadge;
  });

  // If no filtered results, show all products as fallback
  const displayProducts = filtered.length > 0 ? filtered : products.slice(0, 12);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="text-5xl block mb-3">{occasion?.emoji || "🎁"}</span>
            <h1 className="font-display text-4xl font-bold mb-3">{occasion?.name || "Occasion Shop"}</h1>
            <p className="text-muted-foreground font-body">
              Handpicked crochet gifts perfect for {occasion?.name?.toLowerCase() || "every occasion"}
            </p>
          </motion.div>

          {/* Occasion quick nav */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {occasions.map(occ => (
              <Link
                key={occ.id}
                to={`/occasions/${occ.id}`}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  occ.id === occasionId
                    ? "bg-primary text-primary-foreground"
                    : "bg-card shadow-soft hover:bg-primary/20"
                }`}
              >
                {occ.emoji} {occ.name}
              </Link>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image_url || "/placeholder.svg",
                    category: product.category?.slug || "",
                    badges: product.badges || [],
                    description: product.description || "",
                    colors: product.colors || [],
                    rating: product.rating || 0,
                    reviews: product.review_count || 0,
                  }} />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Showing all products — curated {occasion?.name} items coming soon!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OccasionShop;
