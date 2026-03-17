import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useSupabaseData";
import { motion, AnimatePresence } from "framer-motion";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const { data: products = [] } = useProducts();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category?.name || "").toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, products]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 rounded-3xl overflow-hidden gap-0">
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <Search size={20} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-base font-body outline-none placeholder:text-muted-foreground/50"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="text-sm">No products found for "{query}"</p>
            </div>
          )}

          {!query.trim() && (
            <div className="py-12 text-center text-muted-foreground">
              <span className="text-3xl block mb-2">✨</span>
              <p className="text-sm">Start typing to search products</p>
            </div>
          )}

          <AnimatePresence>
            {results.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/10 transition-colors"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl">🧶</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-sm">Rs. {product.price.toLocaleString()}</p>
                    {product.original_price && product.original_price > product.price && (
                      <p className="text-[10px] text-muted-foreground line-through">Rs. {product.original_price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {query.trim() && results.length > 0 && (
          <div className="p-3 border-t border-border/30">
            <Link
              to={`/shop`}
              onClick={() => onOpenChange(false)}
              className="block text-center text-sm text-primary font-medium hover:underline"
            >
              View all in Shop →
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
