import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WishlistDrawer = ({ open, onOpenChange }: WishlistDrawerProps) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { data: products = [] } = useProducts();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md rounded-l-3xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border/30">
          <SheetTitle className="font-display flex items-center gap-2">
            <Heart size={20} className="text-pink fill-pink" /> My Wishlist
            <span className="text-sm font-normal text-muted-foreground">({wishlistedProducts.length})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {wishlistedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl mb-4">💕</span>
              <p className="font-display font-semibold mb-1">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mb-4">Save items you love by tapping the heart icon</p>
              <Link to="/shop" onClick={() => onOpenChange(false)}>
                <Button className="rounded-2xl">Browse Shop</Button>
              </Link>
            </div>
          ) : (
            <AnimatePresence>
              {wishlistedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-colors mb-2"
                >
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => onOpenChange(false)}
                    className="shrink-0"
                  >
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">🧶</div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`} onClick={() => onOpenChange(false)}>
                      <p className="font-display font-semibold text-sm truncate hover:text-primary transition-colors">{product.name}</p>
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display font-bold text-sm">Rs. {product.price.toLocaleString()}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-[10px] text-muted-foreground line-through">Rs. {product.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image_url || "",
                          category: product.category?.slug || "",
                          type: "product",
                        });
                      }}
                      className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Add to cart"
                    >
                      <ShoppingBag size={14} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id, product.name)}
                      className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
