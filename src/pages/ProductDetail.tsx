import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/lib/products";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 text-center py-20">
          <span className="text-5xl block mb-4">🧶</span>
          <p className="font-display text-xl font-bold">Product not found</p>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground mt-2 inline-block">
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const badgeColors: Record<string, string> = {
    "Bestseller": "bg-pink text-primary-foreground",
    "Handmade": "bg-warm-beige text-foreground",
    "Customizable": "bg-lavender text-secondary-foreground",
    "Limited Edition": "bg-mint text-accent-foreground",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-9xl shadow-soft"
            >
              {product.category === "bouquets" && "💐"}
              {product.category === "keychains" && "🔑"}
              {product.category === "toys" && "🧸"}
              {product.category === "decor" && "🌼"}
              {product.category === "accessories" && "🎀"}
              {product.category === "flowers" && "🌸"}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges.map((b) => (
                  <span key={b} className={`px-3 py-1 rounded-2xl text-xs font-bold font-body ${badgeColors[b] || "bg-muted"}`}>
                    {b}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-peach text-peach" : "text-border"} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-muted-foreground font-body leading-relaxed mb-8">{product.description}</p>

              {/* Color Selector */}
              <div className="mb-8">
                <p className="font-display font-semibold text-sm mb-3">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full border-2 shadow-sm transition-all btn-squish ${
                        selectedColor === i ? "border-foreground scale-110" : "border-card hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-display font-semibold text-sm mb-3">Quantity</p>
                <div className="inline-flex items-center rounded-3xl bg-card border border-border/50 shadow-soft">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 text-lg font-medium btn-squish">−</button>
                  <span className="px-4 py-2.5 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2.5 text-lg font-medium btn-squish">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-3xl bg-primary text-primary-foreground font-display font-semibold shadow-glow btn-squish hover:shadow-float transition-all">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button className="w-14 h-14 rounded-3xl bg-card border border-border/50 flex items-center justify-center text-foreground/60 hover:text-pink shadow-soft btn-squish transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: "Free Shipping" },
                  { icon: Shield, text: "Handmade Quality" },
                  { icon: RefreshCw, text: "Easy Returns" },
                ].map((t) => (
                  <div key={t.text} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 text-center">
                    <t.icon size={16} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">{t.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-bold mb-8">You Might Also Love 💕</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
