import { motion } from "framer-motion";
import { Star, ShoppingBag, Clock } from "lucide-react";
import { featuredProduct } from "@/lib/products";
import heroBouquet from "@/assets/hero-bouquet.jpg";

const CrochetOfTheWeek = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 p-8 md:p-14 overflow-hidden relative">
        {/* Background stitch pattern */}
        <div className="absolute inset-0 stitch-bg opacity-30" />

        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square rounded-3xl overflow-hidden shadow-soft"
          >
            <img src={heroBouquet} alt="Enchanted Garden Bouquet" className="w-full h-full object-cover" />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-2 mb-4">
              {featuredProduct.badges.map((b) => (
                <span key={b} className="px-3 py-1.5 rounded-2xl bg-peach text-foreground text-xs font-bold font-body">
                  {b}
                </span>
              ))}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              🌟 Crochet of the Week
            </h2>
            <h3 className="font-display text-xl font-semibold mb-4 text-gradient-pink">
              {featuredProduct.name}
            </h3>
            <p className="text-muted-foreground font-body mb-6 leading-relaxed">
              {featuredProduct.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-peach text-peach" />
                <span className="font-semibold text-sm">{featuredProduct.rating}</span>
                <span className="text-xs text-muted-foreground">({featuredProduct.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Clock size={14} />
                <span>Only 10 left!</span>
              </div>
            </div>

            {/* Colors */}
            <div className="flex gap-2 mb-8">
              {featuredProduct.colors.map((c) => (
                <div key={c} className="w-8 h-8 rounded-full border-2 border-card shadow-sm cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-bold">${featuredProduct.price}</span>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-primary text-primary-foreground font-display font-semibold shadow-glow btn-squish hover:shadow-float transition-all">
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default CrochetOfTheWeek;
