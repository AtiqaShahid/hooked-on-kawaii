import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SearchDialog from "@/components/SearchDialog";
import WishlistDrawer from "@/components/WishlistDrawer";

const createLinks = [
  { path: "/custom-builder", label: "✂️ Custom Crochet" },
  { path: "/gift-builder", label: "🎁 Gift Builder" },
  { path: "/style-quiz", label: "🎀 Style Quiz" },
];

const exploreLinks = [
  { path: "/community", label: "💬 Community" },
  { path: "/learn", label: "📚 Learn Crochet" },
  { path: "/craft-stories", label: "✨ Craft Stories" },
  { path: "/loyalty", label: "⭐ Rewards" },
  { path: "/gallery", label: "🖼️ Gallery" },
  { path: "/design-voting", label: "🗳️ Vote on Designs" },
];

const DropdownMenu = ({ label, links, isActive }: { label: string; links: { path: string; label: string }[]; isActive: boolean }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-4 py-2 rounded-2xl text-sm font-medium font-body transition-all duration-300 btn-squish ${
          isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-primary/30"
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full mt-2 glass-panel rounded-2xl p-2 shadow-float min-w-[200px] z-50"
          >
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-body transition-all hover:bg-primary/20"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const createPaths = createLinks.map(l => l.path);
  const explorePaths = exploreLinks.map(l => l.path);

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
              <Link
                to="/"
                className={`px-4 py-2 rounded-2xl text-sm font-medium font-body transition-all duration-300 btn-squish ${
                  location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-primary/30"
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`px-4 py-2 rounded-2xl text-sm font-medium font-body transition-all duration-300 btn-squish ${
                  location.pathname === "/shop" ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-primary/30"
                }`}
              >
                Shop
              </Link>
              <Link
                to="/collections"
                className={`px-4 py-2 rounded-2xl text-sm font-medium font-body transition-all duration-300 btn-squish ${
                  location.pathname === "/collections" ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-primary/30"
                }`}
              >
                Collections
              </Link>
              <DropdownMenu label="Create" links={createLinks} isActive={createPaths.includes(location.pathname)} />
              <DropdownMenu label="Explore" links={exploreLinks} isActive={explorePaths.includes(location.pathname)} />
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
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium transition-all btn-squish hover:shadow-soft"
              >
                <User size={16} />
                Account
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
              {[
                { path: "/", label: "Home" },
                { path: "/shop", label: "Shop" },
                { path: "/collections", label: "Collections" },
              ].map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all ${location.pathname === link.path ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-primary/30"}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">Create</div>
              {createLinks.map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 3) * 0.03 }}>
                  <Link to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all ${location.pathname === link.path ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-primary/30"}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">Explore</div>
              {exploreLinks.map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 6) * 0.03 }}>
                  <Link to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all ${location.pathname === link.path ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-primary/30"}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">More</div>
              {[
                { path: "/orders", label: "📦 Order Tracker" },
                { path: "/surprise-box", label: "🎁 Mystery Box" },
                { path: "/about", label: "💕 About" },
                { path: "/contact", label: "💌 Contact" },
              ].map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 12) * 0.03 }}>
                  <Link to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all ${location.pathname === link.path ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-primary/30"}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <WishlistDrawer open={wishlistOpen} onOpenChange={setWishlistOpen} />
    </motion.header>
  );
};

export default Navbar;
