import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroCollection from "@/assets/hero-collection.jpg";
const FloatingYarn = ({ emoji, className }: { emoji: string; className: string }) => (
  <motion.div
    className={`absolute text-4xl md:text-5xl select-none pointer-events-none ${className}`}
    animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  >
    {emoji}
  </motion.div>
);

const HeroSection = () => (
  <section className="relative min-h-screen bg-gradient-hero overflow-hidden flex items-center pt-24">
    {/* Stitch background */}
    <div className="absolute inset-0 stitch-bg opacity-50" />

    {/* Floating elements */}
    <FloatingYarn emoji="🧶" className="top-32 left-[8%] animate-float" />
    <FloatingYarn emoji="🌸" className="top-40 right-[12%] animate-float-delayed" />
    <FloatingYarn emoji="🪡" className="bottom-32 left-[15%] animate-float-slow" />
    <FloatingYarn emoji="💐" className="bottom-40 right-[8%] animate-float" />
    <FloatingYarn emoji="🧸" className="top-[55%] left-[5%] animate-float-delayed" />
    <FloatingYarn emoji="🎀" className="top-28 left-[45%] animate-float-slow" />

    <div className="relative max-w-7xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-3xl bg-card/70 backdrop-blur-sm shadow-soft border border-border/30 mb-8"
        >
          <span className="animate-wiggle inline-block">✨</span>
          <span className="text-sm font-medium text-muted-foreground">Handmade with Love, One Stitch at a Time</span>
        </motion.div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <span className="text-gradient-pink">Crochet</span>
          <br />
          <span className="text-foreground">Magic Awaits</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body"
        >
          Discover adorable handmade crochet creations — from forever flowers to cuddly amigurumi.
          Every piece is crafted with premium yarn and endless love.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-3xl bg-primary text-primary-foreground font-display font-semibold text-base shadow-glow hover:shadow-float transition-all btn-squish"
          >
            Explore Shop <ArrowRight size={18} />
          </Link>
          <Link
            to="/custom-builder"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-3xl bg-card text-foreground font-display font-semibold text-base shadow-soft hover:shadow-float transition-all btn-squish border border-border/50"
          >
            <Sparkles size={18} /> Build Your Own
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-foreground/30" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
