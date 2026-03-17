import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Users, Heart, Award } from "lucide-react";

const stats = [
  { icon: Star, label: "Average Rating", end: 4.9, suffix: "", decimals: 1, color: "text-peach" },
  { icon: Users, label: "Happy Customers", end: 500, suffix: "+", decimals: 0, color: "text-lavender" },
  { icon: Heart, label: "Handmade With Love", end: 100, suffix: "%", decimals: 0, color: "text-pink" },
  { icon: Award, label: "Crochet Designs", end: 50, suffix: "+", decimals: 0, color: "text-mint" },
];

const AnimatedNumber = ({ end, suffix, decimals }: { end: number; suffix: string; decimals: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, end]);

  return <span ref={ref}>{value.toFixed(decimals)}{suffix}</span>;
};

const StatsCounter = () => (
  <section className="py-14 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="p-6 rounded-3xl bg-card shadow-soft text-center"
          >
            <s.icon size={28} className={`mx-auto mb-3 ${s.color}`} />
            <p className="font-display text-3xl font-bold">
              <AnimatedNumber end={s.end} suffix={s.suffix} decimals={s.decimals} />
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsCounter;
