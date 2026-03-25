import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null } | null;
}

const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id, rating, review_text, created_at, user_id")
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      setReviews(data || []);
      setLoading(false);
    };
    fetchReviews();
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to submit a review.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Check if user purchased this product
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("id, order_id, orders!inner(user_id, status)")
        .eq("product_id", productId);

      const purchased = orderItems?.some((item: any) => {
        const order = item.orders;
        return order?.user_id === user.id && ["delivered", "completed", "shipped", "confirmed"].includes(order?.status);
      });

      if (!purchased) {
        toast({ title: "Purchase required", description: "You must purchase this product before submitting a review.", variant: "destructive" });
        setSubmitting(false);
        return;
      }

      // Check for existing review
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        toast({ title: "Already reviewed", description: "You have already reviewed this product.", variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: newRating,
        review_text: newText.trim() || null,
        is_approved: false,
      });

      if (error) throw error;

      toast({ title: "Review submitted! ✨", description: "Your review will appear after approval." });
      setShowForm(false);
      setNewText("");
      setNewRating(5);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
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

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-card shadow-float mb-8 space-y-4"
        >
          {!user && (
            <p className="text-sm text-destructive font-medium">⚠️ Please sign in to submit a review.</p>
          )}
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
            disabled={submitting || !user}
            className="px-6 py-3 rounded-3xl bg-primary text-primary-foreground font-display font-semibold btn-squish shadow-glow text-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit Review ✨
          </button>
        </motion.form>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto text-primary" size={32} />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ReviewCard review={{
                id: review.id,
                productId: productId,
                userName: "Customer",
                rating: review.rating,
                text: review.review_text || "",
                date: review.created_at,
                verified: true,
              }} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-3xl bg-card shadow-soft">
          <span className="text-4xl block mb-3">💬</span>
          <p className="font-display font-semibold">No reviews yet</p>
          <p className="text-sm text-muted-foreground">Be the first to rate this product! ✨</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
