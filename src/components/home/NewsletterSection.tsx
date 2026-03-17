import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-5xl block mb-4">💌</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Join the Crochet Club
          </h2>
          <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
            Get early access to new designs, exclusive offers, and crochet tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-3.5 rounded-3xl bg-card border border-border/50 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-soft"
            />
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-3xl bg-primary text-primary-foreground font-display font-semibold text-sm shadow-glow btn-squish hover:shadow-float transition-all">
              <Send size={16} /> Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
