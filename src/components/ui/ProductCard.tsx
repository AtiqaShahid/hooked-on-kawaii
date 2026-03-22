import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { DbProduct } from "@/hooks/useSupabaseData";
import { resolveImageUrl, handleImageError } from "@/lib/imageUtils";

const badgeColors: Record<string, string> = {
  "Bestseller": "bg-pink text-primary-foreground",
  "Handmade": "bg-warm-beige text-foreground",
  "Customizable": "bg-lavender text-secondary-foreground",
  "Limited Edition": "bg-mint text-accent-foreground",
  "Crochet of the Week": "bg-peach text-foreground",
  "Limited Stock": "bg-baby-blue text-foreground",
  "Sale": "bg-red-500 text-white",
};

const categoryEmojis: Record<string, string> = {
  bouquets: "💐", keychains: "🔑", toys: "🧸", decor: "🌼", accessories: "🎀", flowers: "🌸",
};

const ProductCard = ({ product, index = 0 }: { product: DbProduct; index?: number }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const catSlug = product.category?.slug || "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Convert to the cart format
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "",
      category: catSlug,
      type: "product",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="bg-card rounded-3xl overflow-hidden shadow-soft card-hover">
          <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
            <img
              src={resolveImageUrl(product.image_url)}
              alt={product.name}
              onError={handleImageError}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {(product.badges || []).map((badge) => (
                <span key={badge} className={`px-2.5 py-1 rounded-2xl text-xs font-semibold font-body ${badgeColors[badge] || "bg-muted text-foreground"}`}>
                  {badge}
                </span>
              ))}
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleToggleWishlist}
                className={`w-9 h-9 rounded-2xl bg-card/80 backdrop-blur-sm flex items-center justify-center transition-colors btn-squish shadow-sm ${
                  isWishlisted(product.id) ? "text-pink" : "text-foreground/60 hover:text-pink"
                }`}
              >
                <Heart size={16} className={isWishlisted(product.id) ? "fill-current" : ""} />
              </button>
            </div>
            <motion.button
              initial={false}
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-2xl bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all btn-squish shadow-sm opacity-0 group-hover:opacity-100"
            >
              <ShoppingBag size={16} />
            </motion.button>
          </div>
          <div className="p-4">
            <h3 className="font-display font-semibold text-sm leading-tight mb-1 group-hover:text-gradient-pink transition-all">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {product.review_count > 0 ? (
                <>
                  <Star size={12} className="fill-peach text-peach" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {product.rating} ({product.review_count})
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground/60 font-medium italic">
                  Be the first to rate ✨
                </span>
              )}
            </div>
            <div className="flex gap-1 mb-3">
              {(product.colors || []).slice(0, 4).map((color) => (
                <div key={color} className="w-4 h-4 rounded-full border-2 border-card shadow-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base">Rs. {product.price.toLocaleString()}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xs text-muted-foreground line-through">Rs. {product.original_price.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
