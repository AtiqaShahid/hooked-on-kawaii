import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/lib/products";

const CategoriesSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Shop by Category
        </h2>
        <p className="text-muted-foreground font-body">Find your perfect handmade piece</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/shop?cat=${cat.id}`}
              className={`block p-6 rounded-3xl ${cat.color}/40 text-center card-hover group`}
            >
              <motion.span
                className="text-4xl block mb-3"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {cat.emoji}
              </motion.span>
              <h3 className="font-display font-semibold text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
