import { Star, CheckCircle } from "lucide-react";
import type { Review } from "@/lib/reviews";

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="p-5 rounded-3xl bg-card shadow-soft">
    <div className="flex items-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < review.rating ? "fill-peach text-peach" : "text-border"} />
      ))}
    </div>
    <p className="text-sm font-body text-foreground/80 leading-relaxed mb-3">"{review.text}"</p>
    <div className="flex items-center gap-2">
      <span className="font-display text-sm font-semibold">{review.userName}</span>
      {review.verified && (
        <span className="flex items-center gap-1 text-xs text-mint">
          <CheckCircle size={12} /> Verified
        </span>
      )}
    </div>
    <p className="text-xs text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
  </div>
);

export default ReviewCard;
