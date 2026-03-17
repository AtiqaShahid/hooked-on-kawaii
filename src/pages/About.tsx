import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-6xl block mb-4">🧶</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About the Maker</h1>
          <p className="text-muted-foreground font-body text-lg max-w-lg mx-auto">
            The heart and hands behind every stitch
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/30 to-lavender/30 flex items-center justify-center text-9xl shadow-soft">
              👩‍🎨
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold mb-4">Hi, I'm the creator of HookOnLoop! 💕</h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              What started as a hobby during quiet evenings has blossomed into a full-fledged passion. Every single piece you see in this shop is handcrafted by me with love, patience, and premium materials.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              I believe handmade items carry a special energy — the care of the maker woven into every stitch. My mission is to create adorable, high-quality crochet pieces that bring joy to your everyday life.
            </p>
            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-primary/20 text-center">
                <p className="font-display text-2xl font-bold">500+</p>
                <p className="text-xs text-muted-foreground">Items Crafted</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 text-center">
                <p className="font-display text-2xl font-bold">300+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/30 text-center">
                <p className="font-display text-2xl font-bold">4.9</p>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl font-bold text-center mb-8">What Makes Us Special ✨</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: "🧵", title: "Premium Materials", desc: "Only the finest cotton and blended yarns" },
              { emoji: "💖", title: "Made with Love", desc: "Every stitch is crafted by hand with care" },
              { emoji: "🎨", title: "Fully Customizable", desc: "Your colors, your size, your design" },
            ].map((v) => (
              <div key={v.title} className="p-6 rounded-3xl bg-card shadow-soft text-center card-hover">
                <span className="text-4xl block mb-3">{v.emoji}</span>
                <h3 className="font-display font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
