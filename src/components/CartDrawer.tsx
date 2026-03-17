import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-float z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <ShoppingBag size={20} /> Cart ({totalItems})
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-2xl hover:bg-muted transition-colors btn-squish">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4">🧶</span>
                  <p className="font-display font-semibold mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add some cute crochet items!</p>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className="inline-block mt-4 px-6 py-2.5 rounded-3xl bg-primary text-primary-foreground text-sm font-semibold btn-squish"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 p-4 rounded-2xl bg-card shadow-soft"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl shrink-0">
                      {item.product.category === "bouquets" && "💐"}
                      {item.product.category === "keychains" && "🔑"}
                      {item.product.category === "toys" && "🧸"}
                      {item.product.category === "decor" && "🌼"}
                      {item.product.category === "accessories" && "🎀"}
                      {item.product.category === "flowers" && "🌸"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-sm truncate">{item.product.name}</h4>
                      <p className="text-sm font-bold mt-1">${item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center btn-squish">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center btn-squish">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="self-start p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 space-y-4">
                <div className="flex justify-between font-display">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full py-4 rounded-3xl bg-primary text-primary-foreground font-display font-semibold shadow-glow btn-squish hover:shadow-float transition-all">
                  Checkout 💕
                </button>
                <button onClick={clearCart} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
