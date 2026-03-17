import { motion } from "framer-motion";
import { Star, Heart, Users } from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";
import { getTopReviews } from "@/lib/reviews";

const stats = [
  { icon: Star, label: "Average Rating", value: "4.9", color: "text-peach" },
  { icon: Users, label: "Happy Customers", value: "500+", color: "text-lavender" },
  { icon: Heart, label: "Handmade With Love", value: "100%", color: "text-pink" },
];

const CustomerLoveSection = () => {
  const topReviews = getTopReviews(4);

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            💕 Customer Love
          </h2>
          <p className="text-muted-foreground font-body">What our crochet family says</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-card shadow-soft text-center"
            >
              <s.icon size={24} className={`mx-auto mb-2 ${s.color}`} />
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerLoveSection;
