import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, MoreHorizontal } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SearchDialog from "@/components/SearchDialog";
import WishlistDrawer from "@/components/WishlistDrawer";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/shop", label: "Shop" },
  { path: "/custom-builder", label: "Custom Builder" },
  { path: "/collections", label: "Collections" },
  { path: "/community", label: "Community" },
];

const moreLinks = [
  { path: "/gift-builder", label: "🎁 Gift Builder" },
  { path: "/craft-stories", label: "✨ Craft Stories" },
  { path: "/learn", label: "📚 Learn Crochet" },
  { path: "/design-voting", label: "🗳️ Vote on Designs" },
  { path: "/surprise-box", label: "🎁 Mystery Box" },
  { path: "/style-quiz", label: "🎀 Style Quiz" },
  { path: "/loyalty", label: "⭐ Loyalty Rewards" },
  { path: "/orders", label: "📦 Order Tracker" },
  { path: "/gallery", label: "🖼️ Gallery" },
  { path: "/about", label: "💕 About" },
  { path: "/admin", label: "📊 Admin" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { wishlist } = useWishlist();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass-panel rounded-3xl px-6 py-3 shadow-soft max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🧶
              </motion.span>
              <span className="font-display text-xl font-bold text-gradient-pink">
                HookOnLoop
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium font-body transition-all duration-300 btn-squish ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-primary/30"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-3 py-2 rounded-2xl text-sm font-medium font-body text-foreground/70 hover:text-foreground hover:bg-primary/30 transition-all btn-squish"
                >
                  <MoreHorizontal size={18} />
                </button>
                <AnimatePresence>
                  {showMore && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 glass-panel rounded-2xl p-2 shadow-float min-w-[200px]"
                      onMouseLeave={() => setShowMore(false)}
                    >
                      {moreLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setShowMore(false)}
                          className={`block px-4 py-2.5 rounded-xl text-sm font-body transition-all ${
                            location.pathname === link.path
                              ? "bg-primary/50 font-medium"
                              : "hover:bg-primary/20"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-primary/30 transition-all btn-squish hidden sm:flex">
                <Search size={20} />
              </button>
              <button onClick={() => setWishlistOpen(true)} className="relative p-2 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-primary/30 transition-all btn-squish hidden sm:flex">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-primary/30 transition-all btn-squish"
              >
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </button>
              <Link
                to="/custom-builder"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium transition-all btn-squish hover:shadow-soft"
              >
                <Sparkles size={16} />
                Custom Order
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-2xl lg:hidden text-foreground/60 hover:text-foreground btn-squish"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-2 lg:hidden"
          >
            <div className="glass-panel rounded-3xl p-4 shadow-float max-h-[70vh] overflow-y-auto">
              {[...navLinks, ...moreLinks].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all ${
                      location.pathname === link.path
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-primary/30"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
