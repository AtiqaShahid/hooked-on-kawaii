import { motion } from "framer-motion";
import ReviewCard from "@/components/reviews/ReviewCard";
import { getTopReviews } from "@/lib/reviews";

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
            💕 What Our Customers Say
          </h2>
          <p className="text-muted-foreground font-body">Real love from our crochet family</p>
        </motion.div>

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
