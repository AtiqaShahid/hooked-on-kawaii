import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReviewCard from "@/components/reviews/ReviewCard";
import { mockReviews } from "@/lib/reviews";
import { useEffect, useRef, useState } from "react";

const CustomerLoveSection = () => {
  const allReviews = mockReviews.filter(r => r.rating >= 4);
  // Duplicate for seamless infinite scroll
  const doubled = [...allReviews, ...allReviews];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    const speed = 0.5; // px per frame

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        // Reset when we've scrolled through the first set
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused]);

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

        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-4 overflow-x-hidden"
          style={{ scrollBehavior: "auto" }}
        >
          {doubled.map((review, i) => (
            <div key={`${review.id}-${i}`} className="min-w-[280px] md:min-w-[320px] shrink-0">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/20 text-primary-foreground font-medium text-sm hover:bg-primary/40 transition-all btn-squish"
          >
            View All Reviews →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomerLoveSection;
