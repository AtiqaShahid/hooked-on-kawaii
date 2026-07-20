import { motion } from "framer-motion";
import { Star, ShoppingBag, Clock } from "lucide-react";
import { useProducts } from "@/hooks/useSupabaseData";
import { useCart } from "@/contexts/CartContext";
import ProductImage from "@/components/ui/ProductImage";

const CrochetOfTheWeek = () => {
  const { data: products = [] } = useProducts();
  const { addItem } = useCart();
  
  // Pick the highest-rated featured product
  const featured = products.find((p) => p.is_featured) || products[0];
  if (!featured) return null;

  const handleAdd = () => {
    addItem({
      id: featured.id,
      name: featured.name,
      price: featured.price,
      image: featured.image_url || "",
      category: featured.category?.slug || "",
      type: "product",
    });
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 p-8 md:p-14 overflow-hidden relative">
          <div className="absolute inset-0 stitch-bg opacity-30" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-square rounded-3xl overflow-hidden shadow-soft">
              <ProductImage
                src={featured.image_url}
                alt={featured.name}
                categorySlug={featured.category?.slug}
                emoji={featured.category?.emoji || undefined}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                showLabel
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1.5 rounded-2xl bg-peach text-foreground text-xs font-bold font-body">Crochet of the Week</span>
                <span className="px-3 py-1.5 rounded-2xl bg-peach text-foreground text-xs font-bold font-body">Limited Stock</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">🌟 Crochet of the Week</h2>
              <h3 className="font-display text-xl font-semibold mb-4 text-gradient-pink">{featured.name}</h3>
              <p className="text-muted-foreground font-body mb-6 leading-relaxed">{featured.description}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-peach text-peach" />
                  <span className="font-semibold text-sm">{featured.rating}</span>
                  <span className="text-xs text-muted-foreground">({featured.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock size={14} /><span>Only 10 left!</span>
                </div>
              </div>
              <div className="flex gap-2 mb-8">
                {(featured.colors || []).map((c) => (
                  <div key={c} className="w-8 h-8 rounded-full border-2 border-card shadow-sm cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl font-bold">Rs. {featured.price.toLocaleString()}</span>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-primary text-primary-foreground font-display font-semibold shadow-glow btn-squish hover:shadow-float transition-all">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrochetOfTheWeek;
