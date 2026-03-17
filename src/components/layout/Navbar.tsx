import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/shop", label: "Shop" },
  { path: "/custom-builder", label: "Custom Builder" },
  { path: "/gift-builder", label: "Gift Builder" },
  { path: "/occasions", label: "Occasions" },
  { path: "/gallery", label: "Gallery" },
  { path: "/about", label: "About" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
            {/* Logo */}
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

            {/* Desktop Nav */}
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
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-primary/30 transition-all btn-squish hidden sm:flex">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-primary/30 transition-all btn-squish hidden sm:flex">
                <Heart size={20} />
              </button>
              <button className="relative p-2 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-primary/30 transition-all btn-squish">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
              <Link
                to="/ai-studio"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium transition-all btn-squish hover:shadow-soft"
              >
                <Sparkles size={16} />
                AI Studio
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-2 lg:hidden"
          >
            <div className="glass-panel rounded-3xl p-4 shadow-float">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
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
