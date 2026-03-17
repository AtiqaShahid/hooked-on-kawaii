import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (productId: string, productName?: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hookonloop-wishlist") || "[]");
    } catch { return []; }
  });

  const toggleWishlist = useCallback((productId: string, productName?: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("hookonloop-wishlist", JSON.stringify(next));
      if (next.includes(productId)) {
        toast({ title: "Added to wishlist 💕", description: productName ? `${productName} saved!` : "Item saved!" });
      } else {
        toast({ title: "Removed from wishlist", description: productName ? `${productName} removed.` : "Item removed." });
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
