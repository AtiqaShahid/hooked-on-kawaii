import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { getReviewsForProduct } from "@/lib/reviews";

const ProductReviews = ({ productId }: { productId: string }) => {
  const reviews = getReviewsForProduct(productId);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to Supabase once Cloud is enabled
    setShowForm(false);
    setNewText("");
    setNewRating(5);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold mb-2">Customer Reviews 💬</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(Number(avgRating)) ? "fill-peach text-peach" : "text-border"} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">{avgRating} · {reviews.length} reviews</span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-3xl bg-card shadow-soft text-sm font-semibold font-display btn-squish hover:shadow-float transition-all"
        >
          <MessageSquare size={16} /> Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-card shadow-float mb-8 space-y-4"
        >
          <div>
            <p className="font-display font-semibold text-sm mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(s)}
                >
                  <Star
                    size={24}
                    className={`transition-colors ${s <= (hoverRating || newRating) ? "fill-peach text-peach" : "text-border"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display font-semibold text-sm mb-2">Your Review</p>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full rounded-2xl bg-muted/50 border-0 p-4 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-3xl bg-primary text-primary-foreground font-display font-semibold btn-squish shadow-glow text-sm"
          >
            Submit Review ✨
          </button>
        </motion.form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-3xl bg-card shadow-soft">
          <span className="text-4xl block mb-3">💬</span>
          <p className="font-display font-semibold">No reviews yet</p>
          <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
