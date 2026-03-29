import { Star, CheckCircle } from "lucide-react";
import type { Review } from "@/lib/reviews";

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="p-6 rounded-3xl bg-white border border-border/40 shadow-md">
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
      ))}
    </div>
    <p className="text-sm font-body text-foreground leading-relaxed mb-4">"{review.text}"</p>
    <div className="flex items-center gap-2">
      <span className="font-display text-sm font-bold text-foreground">{review.userName}</span>
      {review.verified && (
        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
          <CheckCircle size={12} /> Verified
        </span>
      )}
    </div>
    <p className="text-xs text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
  </div>
);

export default ReviewCard;
