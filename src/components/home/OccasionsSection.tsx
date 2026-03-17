import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { occasions } from "@/lib/products";

const OccasionsSection = () => (
  <section className="py-20 px-6 bg-gradient-section">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          🎁 Shop by Occasion
        </h2>
        <p className="text-muted-foreground font-body">Find the perfect handmade gift</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {occasions.map((occ, i) => (
          <motion.div
            key={occ.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/occasions/${occ.id}`}
              className="block rounded-3xl bg-card shadow-soft p-6 text-center card-hover group"
            >
              <motion.span
                className="text-5xl block mb-3"
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {occ.emoji}
              </motion.span>
              <h3 className="font-display font-semibold text-sm">{occ.name}</h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default OccasionsSection;
