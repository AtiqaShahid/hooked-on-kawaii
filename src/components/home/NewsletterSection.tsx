import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers" as any).insert({ email: trimmed });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already subscribed! 💕" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Successfully joined Crochet Club! 🎉", description: "Welcome to the family!" });
      }
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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

          {subscribed ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-green-50 text-green-700 font-display font-semibold">
              <CheckCircle2 size={18} /> You're in the club! 🎉
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="your@email.com"
                maxLength={255}
                className="flex-1 px-5 py-3.5 rounded-3xl bg-card border border-border/50 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-soft"
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-3xl bg-primary text-primary-foreground font-display font-semibold text-sm shadow-glow btn-squish hover:shadow-float transition-all disabled:opacity-50"
              >
                <Send size={16} /> {loading ? "Joining..." : "Subscribe"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
