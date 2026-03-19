import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import ReviewCard from "@/components/reviews/ReviewCard";
import { mockReviews } from "@/lib/reviews";

const AllReviews = () => {
  const reviews = mockReviews.filter(r => r.rating >= 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold mb-3">💕 All Customer Reviews</h1>
            <p className="text-muted-foreground font-body">{reviews.length} reviews from our crochet family</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllReviews;
